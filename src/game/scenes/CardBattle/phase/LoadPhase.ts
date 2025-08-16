import { Phase } from "./Phase";
import { CardBattlePhase } from "./CardBattlePhase";
import { SummonPhase } from "./SummonPhase";
import { TriggerPhase } from "./TriggerPhase";
import { LOAD_PHASE } from "@/game/constants/keys";
import { CardData } from "@/game/types";
import { LoadPhasePlay } from "@/game/api/CardBattle";
import { CARD_WIDTH } from "@/game/constants/default";
import { CardUi } from "@/game/ui/Card/CardUi";
import { TimelineEvent } from "../../VueScene";
import { CardsetEvents } from "@/game/ui/Cardset/types/CardsetEvents";

export class LoadPhase extends CardBattlePhase implements Phase {

    async create(): Promise<void> {
        this.#createLoadPhaseWindows();
        super.openAllWindows();
    }

    #createLoadPhaseWindows(): void {
        super.createTextWindowCentered('Load Phase started!', {
            textAlign: 'center',
            onClose: () => this.#loadLoadPhase()
        });
        super.addTextWindow('Select and use a Power Card');
    }

    async #loadLoadPhase(): Promise<void> {
        await this.#createAndOpenBoards();
        if (await this.cardBattle.isStartPlaying(this.scene.room.playerId)) {
            this.#goPlay();
            return;
        }
        this.#nextPlay();
    }

    async #createAndOpenBoards(): Promise<void> {
        super.createBoard(await this.cardBattle.getBoard(this.scene.room.playerId));
        super.createOpponentBoard(await this.cardBattle.getOpponentBoard(this.scene.room.playerId));
        super.openBoard();
        super.openOpponentBoard();
    }

    async #goPlay(): Promise<void> {
        await this.cardBattle.setPlaying(this.scene.room.playerId);
        this.#createPlayerCommandWindow();
    }

    #createPlayerCommandWindow() {
        this.#createCommandWindow();
        super.openCommandWindow()
    }

    #createCommandWindow(): void {
        const options = [
            {
                description: 'Yes',
                onSelect: () => {
                    super.closeFieldCardset();
                    super.closeOpponentBoard();
                    super.closeBoard({ onComplete: () => this.#createPlayerHandZone() });
                }
            },
            {
                description: 'No',
                onSelect: async (): Promise<void> => {
                    await this.cardBattle.pass(this.scene.room.playerId);
                    this.#nextPlay();
                }
            }
        ];
        super.createCommandWindowBottom('Use a Power Card?', options);
    }

    #createPlayerHandZone(): void {
        this.#createPlayerHandDisplayWindows();
        this.#createPlayerHandCardset();
    }

    #createPlayerHandDisplayWindows(): void {
        super.createTextWindowTop('Your Hand', {
            textAlign: 'center',
        });
        super.addTextWindow('...', { marginTop: 32 });
        super.addTextWindow('...');
        super.addTextWindow('...');
    }

    async #createPlayerHandCardset(): Promise<void> {
        const playerCards: CardData[] = await this.cardBattle.getHandCards(this.scene.room.playerId);
        const cardset = super.createPlayerHandCardset(playerCards);
        cardset.setCardsInLinePosition();
        cardset.setCardsClosed();
        this.#openHandCardset();
    }

    #openHandCardset(): void {
        const cardset = super.getPlayerCardset();
        cardset.disableBattleCards();
        super.openPlayerCardset({ onComplete: () => {
            super.openAllWindows();
            super.openBoard();
            cardset.selectModeOne(this.#getCardsetEvents());
        }});
    }

    #getCardsetEvents(): CardsetEvents {
        const cardset = super.getPlayerCardset();
        return {
            onChangeIndex: (cardIndex: number) => {
                if (!cardset.isValidIndex(cardIndex)) return;
                super.setTextWindowText(cardset.getCardByIndex(cardIndex).getName(), 1);
                super.setTextWindowText(cardset.getCardByIndex(cardIndex).getDescription(), 2);
                super.setTextWindowText(cardset.getCardByIndex(cardIndex).getDetails(), 3);
            },
            onComplete: (cardIndexes: number[]) => {
                cardset.highlightCardsByIndexes(cardIndexes);
                super.createCommandWindowBottom('Complete your choice?', [
                    {
                        description: 'Yes',
                        onSelect: () => {
                            super.closeAllWindows();
                            super.closeBoard();
                            super.closeCardset({
                                onComplete: () => {
                                    super.openOpponentBoard();
                                    super.openBoard({
                                        onComplete: async () => {
                                            // PlayerPass
                                            const powerCard = await this.cardBattle.getPowerCardByIndex(
                                                this.scene.room.playerId, 
                                                cardIndexes.shift() || 0
                                            );
                                            this.#playPowerCard(powerCard, () => {
                                                console.log('Set power card play!');
                                                this.#loadPlayAndMovePowerCardToField();
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    },
                    {
                        description: 'No',
                        onSelect: () => cardset.restoreSelectState()
                    },
                ]);
                super.openCommandWindow();
            },
            onLeave: () => {
                super.closeCardset({ onComplete: () => {
                    super.openBoard({ onComplete: () => this.#nextPlay() });
                    super.openOpponentBoard();
                }});
                super.closeAllWindows();
                super.closeBoard();
            },
        };
    }

    async #playPowerCard(powerCard: CardData, onComplete: () => void): Promise<void> {
        const powerCards: CardData[] = await this.cardBattle.getFieldPowerCards();
        const cardset = super.createFieldCardset([...powerCards, powerCard]);
        cardset.setCardsInLinePosition();
        const widthEdge = (this.scene.scale.width - cardset.x) - ((CARD_WIDTH * 1.5) - 20);
        cardset.setCardAtPosition(cardset.getCardsLastIndex(), widthEdge);
        cardset.setCardsClosed();
        super.openFieldCardset({
            onComplete: () => {
                const lastIndex = cardset.getCardsLastIndex();
                const card = cardset.getCardByIndex(lastIndex);
                cardset.selectCard(card);
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
    //                 this.#loadPlayAndMovePowerCardToField();
    //             }
    //         },
    //         {
    //             description: 'No',
    //             onSelect: () => {
    //                 super.closeAllWindows();
    //                 super.closeOpponentBoard();
    //                 super.closeBoard();
    //                 super.closeFieldCardset({ onComplete: () => this.#createPlayerHandZone() });
    //             }
    //         }
    //     ]);
    //     super.openAllWindows();
    //     super.openCommandWindow();
    // }

    #createOpponentPlayingWaitingWindow(): void {
        super.createWaitingWindow('Waiting for opponent to play...');
    }

    #loadPlayAndMovePowerCardToField(): void {
        super.closeAllWindows();
        const cardset = super.getFieldCardset();
        const lastIndex = cardset.getCardsLastIndex();
        const card = cardset.getCardByIndex(lastIndex);
        cardset.deselectCard(card);
        this.#movePowerCardToField();
    }

    #movePowerCardToField(): void {
        const totalCards = this.getFieldCardset().getCardsTotal();
        const moveConfig = {
            targets: this.getFieldCardset().getCardsUi(),
            x: 0,
            eachX: CARD_WIDTH,
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                card.moveFromTo({
                    xTo: 0 + (index! * CARD_WIDTH),
                    yTo: 0,
                    delay: (index! * 100), 
                    duration: (300 / totalCards) * (totalCards - index!),
                    onComplete: () => resume()
                });
            },
            onAllComplete: () => this.#nextPlay(),
        };
        this.scene.timeline(moveConfig);
    }

    async #nextPlay(): Promise<void> {
        if (await this.cardBattle.isPowerfieldLimitReached()) {
            this.changeToTriggerPhase(LOAD_PHASE);
            return;
        }
        if (await this.cardBattle.allPass()) {
            if (await this.cardBattle.hasPowerCardsInField()) {
                this.changeToTriggerPhase(LOAD_PHASE);
                return;
            }
            this.changeToSummonPhase();
            return;
        }
        if (await this.cardBattle.isOpponentPassed(this.scene.room.playerId)) {
            // opponentPass
            this.#goPlay();
            return;
        }
        this.#createOpponentPlayingWaitingWindow();
        super.openAllWindows({
            onComplete: async () => {
                await this.cardBattle.listenOpponentPlay(
                    this.scene.room.playerId, 
                    (opponentPlay: LoadPhasePlay) => super.closeAllWindows({ 
                        onComplete: () => {
                            super.closeAllWindows({ 
                                onComplete: () => {
                                    if (opponentPlay.pass) {
                                        // this.#opponentPass();
                                        return;
                                    }
                                    this.#playPowerCard(opponentPlay.powerAction!.powerCard, () => {
                                        console.log('Maybe Set power card play!');
                                        this.#loadPlayAndMovePowerCardToField();
                                    });
                                } 
                            });
                        }
                    })
                );
            }
        });
    }




























    // #createZoneCommandWindow(): void {
    //     const options = [
    //         {
    //             description: 'Play Power card',
    //             onSelect: () => {
    //                 this.#powerSlots.addPowerSlot({
    //                     action: 'POWER_1',
    //                     params: {
    //                         cardId: 'card_1',
    //                         zone: 'player'
    //                     } 
    //                 });
    //                 if (this.#powerSlots.isLimitReached()) {
    //                     this.changeToTriggerPhase(LOAD_PHASE);
    //                     return;
    //                 }
    //                 this.changeToLoadPhase();
    //             }
    //         },
    //         {
    //             description: 'Trash',
    //             onSelect: () => {
    //                 this.changeToLoadPhase();
    //             }
    //         },
    //         {
    //             description: 'Field',
    //             onSelect: () => {
    //                 this.changeToLoadPhase();
    //             }
    //         },
    //         {
    //             description: 'Hand',
    //             onSelect: () => {
    //                 this.changeToLoadPhase();
    //             }
    //         }
    //     ];
    //     super.createCommandWindowBottom('Select your zone', options);
    // }

    changeToChallengePhase(): void {
        throw new Error("Method not implemented.");
    }
    
    changeToStartPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToDrawPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToLoadPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToTriggerPhase(origin: string): void {
        this.scene.changePhase(new TriggerPhase(this.scene, origin));
    }

    changeToSummonPhase(): void {
        this.closeBoard({ onComplete: () => this.scene.changePhase(new SummonPhase(this.scene)) });
        this.closeOpponentBoard();
    }

    changeToCompilePhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToBattlePhase(): void {
        throw new Error("Method not implemented.");
    }
    
    destroy(): void {
        super.destroyAllTextWindows();
    }
}