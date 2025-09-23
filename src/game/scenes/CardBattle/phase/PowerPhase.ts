import { HAND } from "@constants/keys";
import { CARD_WIDTH } from "@constants/default";
import { CardUi } from "@ui/Card/CardUi";
import { CardData } from "@objects/CardData";
import { TimelineEvent } from "@scenes/VueScene";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { TweenConfig } from '@game/types/TweenConfig';
import { CardActionsBuilder } from "@ui/Card/CardActionsBuilder";
import { PowerCardPlayData } from "@/game/objects/PowerCardPlayData";

export abstract class PowerPhase extends CardBattlePhase {

    async create(goToPlays: boolean = false): Promise<void> {
        if (goToPlays) {
            super.removeBoardPass();
            super.removeOpponentBoardPass();
            this.resumePhase();
            return;
        }
        await super.createGameBoard();
        this.startPhase();
    }

    async resumePhase(): Promise<void> {
        if (await this.cardBattle.isStartPlaying(this.scene.room.playerId)) {
            this.#goPlay();
            return;
        }
        this.#nextPlay();
    }

    async #goPlay(): Promise<void> {
        await this.#resetPlay();
        await this.#createCommandWindow();
        super.openCommandWindow()
    }

    #resetPlay(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            await this.cardBattle.setPlaying(this.scene.room.playerId);
            super.removeBoardPass();
            resolve();
        });
    }

    #createCommandWindow(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            super.createCommandWindowBottom('Use a Power Card?', [
                {
                    description: 'Yes',
                    disabled: !await this.cardBattle.hasPowerCardInHand(this.scene.room.playerId),
                    onSelect: () => this.#onUsePowerCard()
                },
                {
                    description: 'No',
                    onSelect: () => this.#onPassPlay()
                }
            ]);
            resolve();
        });
    }

    #onUsePowerCard(): void {
        this.scene.timeline({
            targets: [
                (config?: TweenConfig) => super.closeOpponentBoard(config),
                (config?: TweenConfig) => super.closeBoard(config),
                (config?: TweenConfig) => super.closeFieldCardset(config)
            ],
            onAllComplete: () => this.#createHandZone(),
        });
    }

    async #onPassPlay(): Promise<void> {
        await this.#passPlay();
        this.#nextPlay();
    }

    async #nextPlay(): Promise<void> {
        if (await this.cardBattle.isPowerfieldLimitReached()) {
            this.changeToTriggerPhase();
            return;
        }
        if (await this.cardBattle.allPass()) {
            if (await this.cardBattle.hasPowerCardsInField()) {
                this.changeToTriggerPhase();
                return;
            }
            this.changeTo();
            return;
        }
        if (await this.cardBattle.isOpponentPassed(this.scene.room.playerId)) {
            this.#goPlay();
            return;
        }
        super.createWaitingWindow('Waiting for opponent to play...');
        super.openAllWindows({
            onComplete: async () => {
                await this.cardBattle.listenOpponentPlay(
                    this.scene.room.playerId, 
                    (opponentPlay: PowerCardPlayData) => this.#loadOpponentPlay(
                            opponentPlay.pass, 
                            opponentPlay.powerAction?.powerCard
                        )
                );
            }
        });
    }

    async #loadOpponentPlay(pass: boolean, powerCard?: CardData): Promise<void> {
        super.closeAllWindows({ onComplete: async () => {
            super.addOpponentBoardPass();
            if (pass) {
                this.#nextPlay();
                return;
            }
            if (!await this.cardBattle.isPowerfieldLimitReached()) {
                await this.#resetPlay();
            }
            if (!pass && powerCard) {
                this.playPowerCard(powerCard, () => {
                    this.removeOpponentBoardZonePoints(HAND, 1);
                    this.loadPlayAndMovePowerCardToField();
                });
            }
        }})
    }

    #passPlay(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            await this.cardBattle.pass(this.scene.room.playerId);
            super.addBoardPass();
            resolve();
        });
    }

    #createHandZone(): void {
        this.#createHandDisplayWindows();
        this.#createHandCardset();
    }

    #createHandDisplayWindows(): void {
        super.createTextWindowTop('Your Hand', {
            textAlign: 'center',
        });
        super.addTextWindow('...', { marginTop: 32 });
        super.addTextWindow('...');
        super.addTextWindow('...');
    }

    async #createHandCardset(): Promise<void> {
        const cards: CardData[] = await this.cardBattle.getCardsFromHandInTheLoadPhase(this.scene.room.playerId);
        super.createHandCardset(cards);
        this.#openHandCardset();
    }

    #openHandCardset(): void {
        const cardset = super.getCardset();
        super.openCardset({ 
            faceUp: true, 
            onComplete: () => {
                super.openAllWindows();
                super.openBoard();
                cardset.selectModeOne({
                    onChangeIndex: (cardId: string) => this.#onChangeHandCardsetIndex(cardId),
                    onComplete: (cardIds: string[]) => this.#onSelectHandCardsetCard(cardIds),
                    onLeave: () => this.#onLeaveHand(),
                });
            }
        });
    }

    #onChangeHandCardsetIndex(cardId: string): void {
        const cardset = super.getCardset();
        super.setTextWindowText(cardset.getCardById(cardId).getName(), 1);
        super.setTextWindowText(cardset.getCardById(cardId).getDescription(), 2);
        super.setTextWindowText(cardset.getCardById(cardId).getDetails(), 3);
    }

    #onSelectHandCardsetCard(cardIds: string[]): void {
        const cardset = super.getCardset();
        cardset.highlightCardsByIndexes(cardIds);
        super.createCommandWindowBottom('Complete your choice?', [
            {
                description: 'Yes',
                onSelect: () => this.#onPlayPowerCard(cardIds.shift() as string)
            },
            {
                description: 'No',
                onSelect: () => cardset.restoreSelectMode()
            },
        ]);
        super.openCommandWindow();
    }

    #onPlayPowerCard(cardId: string): void {
        this.#closeHandBoard({ onComplete: () => {
            this.openGameBoard({ onComplete: () => this.#loadPowerCardAction(cardId) });
        }});
    }

    #closeHandBoard(config: TweenConfig): void {
        super.closeAllWindows();
        super.closeBoard();
        super.closeCardset(config);
    }

    async #loadPowerCardAction(cardId: string): Promise<void> {
        const powerCard = await this.cardBattle.getPowerCardById(this.scene.room.playerId, cardId);
        this.playPowerCard(powerCard, () => {
            this.removeBoardZonePoints(HAND, 1);
            this.#onSetPowerCardAction(powerCard);
        });
    }

    async #onSetPowerCardAction(powerCard: CardData): Promise<void> {
        console.log('Set power card play!');
        const powerAction = {
            powerCard,
            // action:{} config...
        }
        await this.cardBattle.makePowerCardPlay(this.scene.room.playerId, powerAction);
        await this.#passPlay();
        if (!await this.cardBattle.isPowerfieldLimitReached()) {
            super.removeOpponentBoardPass();
        }
        this.loadPlayAndMovePowerCardToField();
    }

    #onLeaveHand(): void {
        this.#closeHandBoard({ onComplete: () => {
            this.openGameBoard({ onComplete: () => this.#goPlay() });
        }});
    }

    async playPowerCard(powerCard: CardData, onComplete: () => void): Promise<void> {
        const powerCards: CardData[] = await this.cardBattle.getFieldPowerCards();
        const powerCardsFiltered = powerCards.filter(card => card.id !== powerCard.id);
        const cardset = super.createFieldCardset({
            cards: [...powerCardsFiltered, powerCard], 
            faceUp: true
        });
        cardset.setCardsInLinePosition();
        const widthEdge = (this.scene.scale.width - cardset.x) - ((CARD_WIDTH * 1.5) - 20);
        const lastIndex = cardset.getCardsLastIndex();
        cardset.setCardAtPosition(lastIndex, widthEdge);
        cardset.setCardClosedByIndex(lastIndex);
        super.openFieldCardsetCardByIndex(lastIndex, {
            faceUp: true,
            onComplete: () => {
                const card = cardset.getCardByIndex(lastIndex);
                cardset.selectCardById(card.getId());
                onComplete(); // show select power action config or not
                // this.#createPowerCardWindows(powerCard); vai no onComplete
            }
        });
    }

    // comportamento de selecção yes ou no, poder ter outros como selecioanr outros cartões do jogo
    // #createPowerCardWindows(powerCard: CardData): void {
    //     super.createTextWindowTop(powerCard.name, { textAlign: 'center' });
    //     super.addTextWindow(`${powerCard.description} ${powerCard.description} ${powerCard.description}`);
    //     super.createCommandWindowBottom('Use this Power Card?', [
    //         {
    //             description: 'Yes',
    //             onSelect: async () => {
    //                 const powerAction = {
    //                     powerCard,
    //                     // action:{} config...
    //                 };
    //                 await this.cardBattle.makePowerCardPlay(this.scene.room.playerId, powerAction);
    //                 this.loadPlayAndMovePowerCardToField();
    //             }
    //         },
    //         {
    //             description: 'No',
    //             onSelect: () => {
    //                 super.closeAllWindows();
    //                 super.closeOpponentBoard();
    //                 super.closeBoard();
    //                 super.closeFieldCardset({ onComplete: () => this.#createHandZone() });
    //             }
    //         }
    //     ]);
    //     super.openAllWindows();
    //     super.openCommandWindow();
    // }

    loadPlayAndMovePowerCardToField(): void {
        super.closeAllWindows();
        const cardset = super.getFieldCardset();
        const lastIndex = cardset.getCardsLastIndex();
        const card = cardset.getCardByIndex(lastIndex);
        cardset.removeAllSelectCardById(card.getId());
        this.#movePowerCardToField();
    }

    #movePowerCardToField(): void {
        const totalCards = this.getFieldCardset().getCardsTotal();
        const moveConfig = {
            targets: this.getFieldCardset().getCardsUi(),
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                CardActionsBuilder
                    .create(card)
                    .move({
                        xTo: 0 + (index! * CARD_WIDTH),
                        yTo: 0,
                        delay: (index! * 100), 
                        duration: (300 / totalCards) * (totalCards - index!),
                        onComplete: () => resume()
                    })
                    .play();
            },
            onAllComplete: () => this.#nextPlay(),
        };
        this.scene.timeline(moveConfig);
    }

    abstract startPhase(): void;
    abstract changeTo(): void;
}
