import { Phase } from "./Phase";
import { CardBattlePhase } from "./CardBattlePhase";
import { SummonPhase } from "./SummonPhase";
import { TriggerPhase } from "./TriggerPhase";
import { LOAD_PHASE, PLAYER } from "@/game/constants/keys";
import { CardData } from "@/game/types";
import { LoadPhasePlay } from "@/game/api/CardBattle";
import { CARD_WIDTH } from "@/game/constants/default";
import { Player } from "@/game/types/Player";
import { CardUi } from "@/game/ui/Card/CardUi";
import { TimelineEvent } from "../../VueScene";
import { CardsetEvents } from "@/game/ui/Cardset/types/CardsetEvents";
import { PowerCardAction } from "@/game/types/PowerAction";

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
            this.#playFirst();
            return;
        }
        this.#createOpponentPlayingWaitingWindow();
        // maybe stay in next play
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
                                    this.#loadPlay()
                                } 
                            });
                        }
                    })
                );
            }
        });
    }

    async #createAndOpenBoards(): Promise<void> {
        super.createBoard(await this.cardBattle.getBoard(this.scene.room.playerId));
        super.createOpponentBoard(await this.cardBattle.getOpponentBoard(this.scene.room.playerId));
        super.openPlayerBoard();
        super.openOpponentBoard();
    }

    #playFirst(): void {
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
                    super.closePlayerBoard({ onComplete: () => this.#createPlayerHandZone() });
                }
            },
            {
                description: 'No',
                onSelect: async (): Promise<void> => {
                    await this.cardBattle.pass(this.scene.room.playerId);
                    this.#allPass();
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
            super.openPlayerBoard();
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
                            super.closePlayerBoard();
                            super.closePlayerCardset({
                                onComplete: () => {
                                    super.openPlayerBoard({
                                        onComplete: () => {
                                            const cardIndex = cardIndexes.shift() || 0;
                                            this.#playPowerCard(cardIndex);
                                        }
                                    });
                                    super.openOpponentBoard();
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
                super.closePlayerCardset({ onComplete: () => {
                    super.openPlayerBoard({ onComplete: () => this.#allPass() });
                    super.openOpponentBoard();
                }});
                super.closeAllWindows();
                super.closePlayerBoard();
            },
        };
    }

    async #playPowerCard(cardIndex: number): Promise<void> {
        const powerCard = await this.cardBattle.getPowerCardByIndex(this.scene.room.playerId, cardIndex);
        const powerCards: CardData[] = await this.cardBattle.getFieldPowerCards();
        const cardset = super.createFieldCardset([...powerCards, powerCard]);
        this.#openPowerfield(() => {
            const lastIndex = cardset.getCardsLastIndex();
            const card = cardset.getCardByIndex(lastIndex);
            cardset.selectCard(card);
            this.#createPowerCardWindows(powerCard);
        });
    }

    async #openPowerfield(onComplete: () => void): Promise<void> {

        cardset.setCardsInLinePosition();
        const widthEdge = (this.scene.scale.width - cardset.x) - ((CARD_WIDTH * 1.5) - 20);
        cardset.setCardAtPosition(cardset.getCardsLastIndex(), widthEdge);
        cardset.setCardsClosed();
        super.openFieldCardset({ onComplete });
    }

    #createPowerCardWindows(powerCard: CardData): void {
        super.createTextWindowTop(powerCard.name, { textAlign: 'center' });
        super.addTextWindow(`${powerCard.description} ${powerCard.description} ${powerCard.description}`);
        super.createCommandWindowBottom('Use this Power Card?', [
            {
                description: 'Yes',
                onSelect: async () => {
                    const powerAction = {
                        playerId: this.scene.room.playerId,
                        powerCard
                    };
                    await this.cardBattle.makePowerCardPlay(this.scene.room.playerId, powerAction);
                    this.#loadPlay();
                }
            },
            {
                description: 'No',
                onSelect: () => {
                    super.closeAllWindows();
                    super.closeOpponentBoard();
                    super.closePlayerBoard();
                    super.closeFieldCardset({ onComplete: () => this.#createPlayerHandZone() });
                }
            }
        ]);
        super.openAllWindows();
        super.openCommandWindow();
    }

    #createOpponentPlayingWaitingWindow(): void {
        super.createWaitingWindow('Waiting for opponent to play...');
    }

    #loadPlay(): void {
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

    #nextPlay(): void {

    }

    async #allPass() {
        if (await this.cardBattle.isPowerfieldLimitReached()) {
            this.changeToTriggerPhase(LOAD_PHASE);
            return;
        }
        if(await this.cardBattle.allPass()) {
            if (await this.cardBattle.hasPowerCardsInField()) {
                this.changeToTriggerPhase(LOAD_PHASE);
                return;
            }
            this.changeToSummonPhase();
            return;
        }
        if (await this.cardBattle.isOpponentPassed() === false) {
            this.#createOpponentWaitingWindow();
            return;
        }
        this.#createPlayerCommandWindow();
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
        const startPhase = false;
        this.scene.changePhase(new LoadPhase(this.scene, startPhase));
    }

    changeToTriggerPhase(origin: string): void {
        this.scene.changePhase(new TriggerPhase(this.scene, origin));
    }

    changeToSummonPhase(): void {
        this.closePlayerBoard({ onComplete: () => this.scene.changePhase(new SummonPhase(this.scene)) });
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