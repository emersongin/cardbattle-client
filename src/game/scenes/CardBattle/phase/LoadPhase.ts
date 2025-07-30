import { Phase } from "./Phase";
import { CardBattleScene } from "../CardBattleScene";
import { CardBattlePhase } from "./CardBattlePhase";
import { SummonPhase } from "./SummonPhase";
import { TriggerPhase } from "./TriggerPhase";
import { PowerSlots } from "../abs/PowerSlots";
import { LOAD_PHASE } from "@/game/constants/Keys";
import { CardData } from "@/game/types";
import { TimelineConfig, TimelineEvent } from "../../VueScene";
import { CardUi } from "@/game/ui/Card/CardUi";
import { LoadPhasePlay } from "@/game/api/CardBattle";

export class LoadPhase extends CardBattlePhase implements Phase {
    #powerSlots: PowerSlots;
    #isStartPhase: boolean;
    
    constructor(readonly scene: CardBattleScene, powerSlots: any[] = [], startPhase: boolean = true) {
        super(scene);
        this.#powerSlots = new PowerSlots(powerSlots);
        this.#isStartPhase = startPhase;
    }

    async create(): Promise<void> {
        if (this.#isStartPhase) {
            this.#createLoadPhaseWindow();
            super.openAllWindows();
            return;
        }
        this.#createBoardsAndPlayerActions();
    }

    #createLoadPhaseWindow(): void {
        super.createTextWindowCentered('Load Phase started!', {
            textAlign: 'center',
            onClose: () => {
                this.#createBoardsAndPlayerActions();
            }
        });
        super.addTextWindow('Select and use a Power Card');
    }

    async #createBoardsAndPlayerActions(): Promise<void> {
        await super.createPlayerBoard();
        await super.createOpponentBoard();
        const iGo = await this.cardBattle.iGo();
        if (!iGo) {
            super.openPlayerBoard(() =>  this.#createOpponentWaitingWindow());
            super.openOpponentBoard();
            return;
        }
        super.openPlayerBoard(() => this.#createPlayerCommandWindow());
        super.openOpponentBoard();
    }

    async #createOpponentWaitingWindow(): Promise<void> {
        super.createWaitingWindow();
        super.openAllWindows();
        await this.cardBattle.listenOpponentLoadPhase((play: LoadPhasePlay) => {
            if (play.pass) {
                super.closeAllWindows(() => this.#allPass());
                return;
            }
        });
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
                    super.closeOpponentBoard();
                    super.closePlayerBoard(async () => {
                        this.#createPlayerHandZone();
                    });
                }
            },
            {
                description: 'No',
                onSelect: async (): Promise<void> => {
                    await this.cardBattle.playerPass();
                    this.#allPass();
                }
            }
        ];
        super.createCommandWindowBottom('Use a Power Card?', options);
    }

    async #allPass() {
        if(await this.cardBattle.allPass()) {
            if (await this.cardBattle.hasPowerCardsInField()) {
                this.changeToTriggerPhase(LOAD_PHASE);
                // this.#powerSlots.hasPower()
                return;
            }
            this.changeToSummonPhase();
            return;
        }
        if (await this.cardBattle.opponentPassed() === false) {
            this.#createOpponentWaitingWindow();
            return;
        }
        this.#createPlayerCommandWindow();
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
        const playerCards: CardData[] = await this.cardBattle.getPlayerHandCardsData();
        const cardset = super.createPlayerHandCardset(playerCards);
        cardset.setCardsInLinePosition();
        cardset.setCardsClosed();
        this.#openAllCardsDominoMovement();
    }

    #openAllCardsDominoMovement(): void {
        const cardset = super.getPlayerBattleCardset();
        const events = {
            onChangeIndex: (cardIndex: number) => {
                if (!cardset.isValidIndex(cardIndex)) return;
                super.setTextWindowText(cardset.getCardByIndex(cardIndex).getName(), 1);
                super.setTextWindowText(cardset.getCardByIndex(cardIndex).getDescription(), 2);
                super.setTextWindowText(cardset.getCardByIndex(cardIndex).getDetails(), 3);
            },
            onMarked: (cardIndex: number) => {
                if (!cardset.isValidIndex(cardIndex)) return;
                // console.log(cardset.getCardByIndex(cardIndex).getName());
            },
            onCompleted: (cardIndexes: number[]) => {
                cardset.highlightCardsByIndexes(cardIndexes);
                super.createCommandWindowBottom('Complete your choice?', [
                    {
                        description: 'Yes',
                        onSelect: () => {
                            console.log('Selected cards:', cardIndexes);
                        }
                    },
                    {
                        description: 'No',
                        onSelect: () => {
                            cardset.restoreSelectState();
                        }
                    },
                ]);
                super.openCommandWindow();
            },
            onLeave: () => {
                // cardset.resetCardsState();
                // cardset.closeAllCardsDominoMovement();
            },
        };
        const openConfig: TimelineConfig<CardUi> = {
            targets: this.getPlayerBattleCardset().getCardsUi(),
            onStart: ({ target: { card }, tween, index  }: TimelineEvent<CardUi>) => {
                tween!.pause();
                card.open({
                    delay: (index! * 100),
                    onComplete: () => {
                        tween!.resume();
                    }
                });
            },
            onAllComplete: () => {
                cardset.selectModeOne(events);
                super.openAllWindows();
                super.openPlayerBoard();
            }
        };
        this.scene.timeline(openConfig);
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

    update(): void {
        console.log("Updating Load Phase...");
    }

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
        this.scene.changePhase(new LoadPhase(this.scene, this.#powerSlots.getPowerSlots(), startPhase));
    }

    changeToTriggerPhase(origin: string): void {
        this.scene.changePhase(new TriggerPhase(this.scene, this.#powerSlots.getPowerSlots(), origin));
    }

    changeToSummonPhase(): void {
        this.closePlayerBoard(() => this.scene.changePhase(new SummonPhase(this.scene)));
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