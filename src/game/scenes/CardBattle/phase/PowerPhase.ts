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
        await Promise.all([
            this.#resetPlay(),
            this.#createCommandWindow()
        ]);
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
                    onSelect: () => {
                        super.closeGameBoard({ 
                            onComplete: () => this.#createHandZone() 
                        });
                    }
                },
                {
                    description: 'No',
                    onSelect: async () => {
                        await this.cardBattle.pass(this.scene.room.playerId);
                        super.setBoardPass();
                        this.#nextPlay();
                    }
                }
            ]);
            resolve();
        });
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
        this.#listanOpponentPlay();
    }

    #listanOpponentPlay() {
        super.createWaitingWindow('Waiting for opponent to play...');
        const onLoadPlay = async (opponentPlay: PowerCardPlayData) => {
            const { pass, powerAction } = opponentPlay;
            super.addOpponentBoardPass();
            if (pass) {
                super.closeAllWindows({ onComplete: () => this.#nextPlay() });
                return;
            }
            if (await this.cardBattle.isPowerfieldLimitReached() === false) {
                await this.#resetPlay();
            }
            if (powerAction?.powerCard) {
                this.#playPowerCard(powerAction.powerCard, () => {
                    this.removeOpponentBoardZonePoints(HAND, 1);
                    this.#loadPlayAndMovePowerCardToField();
                });
            }
        };
        super.openAllWindows({
            onComplete: () => {
                this.cardBattle.listenOpponentPlay(this.scene.room.playerId, onLoadPlay);
            }
        });
    }

    async #createHandZone(): Promise<void> {
        super.createHandDisplayWindows();
        const cards: CardData[] = await this.cardBattle.getCardsFromHandInTheLoadPhase(this.scene.room.playerId);
        super.createHandCardset(cards);
        this.#openAndSelectModeHandCardset();
    }

    #openAndSelectModeHandCardset(): void {
        this.scene.timeline({
            targets: [
                (config?: TweenConfig) => super.openAllWindows(config),
                (config?: TweenConfig) => super.openBoard(config),
                (config?: TweenConfig) => super.openCardset({ ...config, faceUp: true }),
            ],
            onAllComplete: () => {
                super.setSelectModeOnceCardset({
                    onChangeIndex: (cardId: string) => this.#onChangeHandCardsetIndex(cardId),
                    onComplete: (cardIds: string[]) => this.#onSelectHandCardsetCard(cardIds),
                    onLeave: () => this.#onLeaveHand(),
                });
            },
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
        this.scene.timeline({
            targets: [
                (config?: TweenConfig) => super.closeAllWindows(config),
                (config?: TweenConfig) => super.closeBoard(config),
                (config?: TweenConfig) => super.closeCardset(config),
            ],
            onAllComplete: () => {
                this.openGameBoard({ onComplete: () => this.#loadPowerCardAction(cardId) });
            },
        });
    }

    async #loadPowerCardAction(cardId: string): Promise<void> {
        const powerCard = await this.cardBattle.getPowerCardById(this.scene.room.playerId, cardId);
        this.#playPowerCard(powerCard, () => {
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
        await this.cardBattle.pass(this.scene.room.playerId);
        super.setBoardPass();
        if (!await this.cardBattle.isPowerfieldLimitReached()) {
            super.removeOpponentBoardPass();
        }
        this.#loadPlayAndMovePowerCardToField();
    }

    #onLeaveHand(): void {
        this.scene.timeline({
            targets: [
                (config?: TweenConfig) => super.closeAllWindows(config),
                (config?: TweenConfig) => super.closeBoard(config),
                (config?: TweenConfig) => super.closeCardset(config),
            ],
            onAllComplete: () => {
                this.openGameBoard({ onComplete: () => this.#goPlay() });
            },
        });
    }

    async #playPowerCard(powerCard: CardData, onComplete: () => void): Promise<void> {
        const powerCards: CardData[] = await this.cardBattle.getFieldPowerCards();
        const powerCardsFiltered = powerCards.filter(card => card.id !== powerCard.id);
        const cardset = super.createPowerCardset({
            cards: [...powerCardsFiltered, powerCard], 
            faceUp: true
        });
        cardset.setCardsInLinePosition();
        const widthEdge = (this.scene.scale.width - cardset.x) - ((CARD_WIDTH * 1.5) - 20);
        const lastIndex = cardset.getCardsLastIndex();
        cardset.setCardAtPosition(lastIndex, widthEdge);
        cardset.setCardClosedByIndex(lastIndex);
        super.openCardFromPowerCardsetByIndex(lastIndex, {
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
    //                 super.closePowerCardset({ onComplete: () => this.#createHandZone() });
    //             }
    //         }
    //     ]);
    //     super.openAllWindows();
    //     super.openCommandWindow();
    // }

    #loadPlayAndMovePowerCardToField(): void {
        super.closeAllWindows();
        const cardset = super.getPowerCardset();
        const lastIndex = cardset.getCardsLastIndex();
        const card = cardset.getCardByIndex(lastIndex);
        cardset.removeAllSelectCardById(card.getId());
        this.#movePowerCardToField();
    }

    #movePowerCardToField(): void {
        const totalCards = this.getPowerCardset().getCardsTotal();
        const moveConfig = {
            targets: this.getPowerCardset().getCardsUi(),
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
