import { Phase } from "./Phase";
import { CardBattleScene } from "../CardBattleScene";
import { CardBattlePhase } from "./CardBattlePhase";
import { SummonPhase } from "./SummonPhase";
import { TriggerPhase } from "./TriggerPhase";
import { PowerSlots } from "../abs/PowerSlots";
import { LOAD_PHASE } from "@/game/constants/Keys";

export class LoadPhase extends CardBattlePhase implements Phase {
    #powerSlots: PowerSlots;
    #isStartPhase: boolean;
    
    constructor(readonly scene: CardBattleScene, powerSlots: any[] = [], startPhase: boolean = true) {
        super(scene);
        this.#powerSlots = new PowerSlots(powerSlots);
        this.#isStartPhase = startPhase;
    }

    async create(): Promise<void> {
        await super.createPlayerBoard();
        await super.createOpponentBoard();
        this.#createCommandWindow();
        if (this.#isStartPhase === false) {
            super.openPlayerBoard(() =>  super.openCommandWindow());
            super.openOpponentBoard();
            return;
        }
        this.#createLoadPhaseWindow();
        super.openAllWindows();
    }

    #createLoadPhaseWindow(): void {
        super.createTextWindowCentered('Load Phase started!', {
            textAlign: 'center',
            onClose: () => {
                super.openPlayerBoard(() =>  super.openCommandWindow());
                super.openOpponentBoard();
            }
        });
        super.addTextWindow('Select and use a Power Card');
    }

    #createCommandWindow(): void {
        const options = [
            {
                description: 'Yes',
                onSelect: () => {
                    this.#createZoneCommandWindow();
                    super.openCommandWindow();
                }
            },
            {
                description: 'No',
                onSelect: () => {
                    if (this.#powerSlots.hasPower()) {
                        this.changeToTriggerPhase(LOAD_PHASE);
                        return;
                    }
                    this.changeToSummonPhase();
                }
            }
        ];
        super.createCommandWindowBottom('Use a Power Card?', options);
    }

    #createZoneCommandWindow(): void {
        const options = [
            {
                description: 'Play Power card',
                onSelect: () => {
                    this.#powerSlots.addPowerSlot({
                        action: 'POWER_1',
                        params: {
                            cardId: 'card_1',
                            zone: 'player'
                        } 
                    });
                    console.log(this.#powerSlots.powerSlotsTotal());
                    if (this.#powerSlots.isLimitReached()) {
                        this.changeToTriggerPhase(LOAD_PHASE);
                        return;
                    }
                    this.changeToLoadPhase();
                }
            },
            {
                description: 'Trash',
                onSelect: () => {
                    this.changeToLoadPhase();
                }
            },
            {
                description: 'Field',
                onSelect: () => {
                    this.changeToLoadPhase();
                }
            },
            {
                description: 'Hand',
                onSelect: () => {
                    this.changeToLoadPhase();
                }
            }
        ];
        super.createCommandWindowBottom('Select your zone', options);
    }

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
        this.scene.changePhase(new SummonPhase(this.scene));
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