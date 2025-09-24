import { HAND } from "@constants/keys";
import { CARD_WIDTH } from "@constants/default";
import { CardUi } from "@ui/Card/CardUi";
import { CardData } from "@objects/CardData";
import { TimelineEvent } from "@scenes/VueScene";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { TweenConfig } from '@game/types/TweenConfig';
import { CardActionsBuilder } from "@ui/Card/CardActionsBuilder";
import { PowerCardPlayData } from "@/game/objects/PowerCardPlayData";
import { Card } from "@/game/ui/Card/Card";

export abstract class PowerPhase extends CardBattlePhase {

    async create(goToPlays: boolean = false): Promise<void> {
        if (goToPlays) {
            super.removeBoardPass();
            super.removeOpponentBoardPass();
            this.resumePhase();
            return;
        }
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
                            onComplete: () => this.createHandZone() 
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

    openHandZone(): void {
        const onComplete = () => {
            super.openAllWindows();
            super.setSelectModeOnceCardset({
                onChangeIndex: (card: Card) => this.#onChangeCardsetIndex(card),
                onComplete: (cardIds: string[]) => this.#onSelectCardFromCardset(cardIds),
                onLeave: () => this.#onLeaveHandZone(),
            });
        }
        super.openHandZone({ onComplete });
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
        super.openAllWindows({
            onComplete: () => {
                this.cardBattle.listenOpponentPlay(this.scene.room.playerId, (opponentPlay: PowerCardPlayData) => this.#onListening(opponentPlay));
            }
        });
    }

    async #onListening(opponentPlay: PowerCardPlayData): Promise<void> {
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
    }

    #onChangeCardsetIndex(card: Card): void {
        super.setTextWindowText(card.getName(), 1);
        super.setTextWindowText(card.getDescription(), 2);
        super.setTextWindowText(card.getDetails(), 3);
    }

    #onSelectCardFromCardset(cardIds: string[]): void {
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
            onAllComplete: async () => {
                await super.createGameBoard({ isNotCreatePowerCards: true });
                super.openGameBoard({ onComplete: () => this.#loadPowerCardAction(cardId) });
            },
        });
    }

    async #loadPowerCardAction(cardId: string): Promise<void> {
        const powerCard = await this.cardBattle.getPowerCardById(this.scene.room.playerId, cardId);
        this.#playPowerCard(powerCard, () => {
            super.removeBoardZonePoints(HAND, 1);
            this.#onSetPowerCardAction(powerCard);
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

    #onLeaveHandZone(): void {
        this.scene.timeline({
            targets: [
                (config?: TweenConfig) => super.closeAllWindows(config),
                (config?: TweenConfig) => super.closeBoard(config),
                (config?: TweenConfig) => super.closeCardset(config),
            ],
            onAllComplete: async () => {
                await super.createGameBoard();
                super.openGameBoard({ onComplete: () => this.#goPlay() });
            },
        });
    }

    abstract startPhase(): void;
    abstract changeTo(): void;
    abstract createHandZone(): void;
}
