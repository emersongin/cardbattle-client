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
import { TriggerPhase } from "./TriggerPhase";

export abstract class PowerPhase extends CardBattlePhase {

    async create(goToPlays: boolean = false): Promise<void> {
        if (goToPlays) {
            super.removeBoardPass();
            super.removeOpponentBoardPass();
            this.resumePhase();
            return;
        }
        this.createPhaseWindows();
        super.openAllWindows();
    }

    abstract createPhaseWindows(): void;

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
                    onSelect: async () => {
                        await super.closeGameBoard();
                        await this.createHandZone();
                        super.createHandDisplayWindows();
                        await super.openHandZone();
                        super.setSelectModeOnceCardset({
                            onChangeIndex: (card: Card) => this.#updateTextWindows(card),
                            onComplete: (cardIds: string[]) => this.#completeChoice(cardIds),
                            onLeave: () => this.#leaveHandZone(),
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

    abstract createHandZone(): Promise<void>;

    #updateTextWindows(card: Card): void {
        super.setTextWindowText(card.getName() + ' ' + card.getId(), 1);
        super.setTextWindowText(card.getDescription(), 2);
        super.setTextWindowText(card.getDetails(), 3);
    }

    #completeChoice(cardIds: string[]): void {
        const handCardset = super.getCardset();
        handCardset.highlightCardsByIndexes(cardIds);
        super.createCommandWindowBottom('Complete your choice?', [
            {
                description: 'Yes',
                onSelect: () => {
                    const cardId = cardIds.shift();
                    super.closeHandZone({
                        onComplete: async () => {
                            await super.createGameBoard({ isNotCreatePowerCards: true });
                            await super.openGameBoard();
                            this.#startPowerCardPlay(cardId as string);
                        }
                    });
                }
            },
            {
                description: 'No',
                onSelect: () => handCardset.restoreSelectMode()
            },
        ]);
        super.openCommandWindow();
    }

    async #startPowerCardPlay(cardId: string): Promise<void> {
        const powerCard = await this.cardBattle.getPowerCardById(this.scene.room.playerId, cardId);
        const finishPlayerPlay = () => {
            super.removeBoardZonePoints(HAND, 1);
            this.#finishPowerCardPlay(powerCard);
        };
        this.#playPowerCard(powerCard, finishPlayerPlay);
    }

    async #finishPowerCardPlay(powerCard: CardData): Promise<void> {
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

    async #playPowerCard(powerCard: CardData, onComplete: () => void): Promise<void> {
        const powerCards: CardData[] = await this.cardBattle.getFieldPowerCards();
        const powerCardsFiltered = powerCards.filter(card => card.id !== powerCard.id);
        const cardset = await super.createPowerCardset({
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
        super.getPowerCardset().removeAllSelect();
        super.movePowerCardsetToBoard({ onComplete: () => this.#nextPlay() });
    }

    // #movePowerCardToField(): void {
    //     const totalCards = this.getPowerCardset().getCardsTotal();
    //     const moveConfig = {
    //         targets: this.getPowerCardset().getCardsUi(),
    //         onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
    //             pause();
    //             CardActionsBuilder
    //                 .create(card)
    //                 .move({
    //                     xTo: 0 + (index! * CARD_WIDTH),
    //                     yTo: 0,
    //                     delay: (index! * 100), 
    //                     duration: (300 / totalCards) * (totalCards - index!),
    //                     onComplete: () => resume()
    //                 })
    //                 .play();
    //         },
    //         onAllComplete: () => ,
    //     };
    //     this.scene.timeline(moveConfig);
    // }

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

    abstract changeTo(): void;
    
    changeToTriggerPhase(): void {
        this.scene.changePhase(new TriggerPhase(this.scene, this));
    }

    #listanOpponentPlay() {
        super.createWaitingWindow('Waiting for opponent to play...');
        super.openAllWindows({
            onComplete: () => {
                this.cardBattle.listenOpponentPlay(
                    this.scene.room.playerId, 
                    (opponentPlay: PowerCardPlayData) => this.#onOpponentPlay(opponentPlay)
                );
            }
        });
    }

    async #onOpponentPlay(opponentPlay: PowerCardPlayData): Promise<void> {
        const { pass, powerAction } = opponentPlay;
        super.addOpponentBoardPass();
        if (pass) {
            await super.closeAllWindows();
            this.#nextPlay();
            return;
        }
        if (await this.cardBattle.isPowerfieldLimitReached() === false) {
            await this.#resetPlay();
        }
        if (powerAction?.powerCard) {
            const finishOpponentPlay = () => {
                super.removeOpponentBoardZonePoints(HAND, 1);
                this.#loadPlayAndMovePowerCardToField();
            };
            this.#playPowerCard(powerAction.powerCard, finishOpponentPlay);
        }
    }

    #leaveHandZone(): void {
        super.closeHandZone({
            onComplete: async () => {
                await super.createGameBoard({ isNotCreatePowerCards: true });
                await super.openGameBoard();
                this.#goPlay();
            }
        });
    }

}
