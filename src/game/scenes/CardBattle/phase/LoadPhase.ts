import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@game/ui/TextWindow';
import { SummonPhase } from "./SummonPhase";
import { CommandWindow } from "@game/ui/CommandWindow";
import { TriggerPhase } from "./TriggerPhase";
import { PowerSlots } from "../abs/PowerSlots";

export class LoadPhase extends PowerSlots implements Phase {
    #textWindow: TextWindow;
    #noTextWindow: boolean = false;
    #commandWindow: CommandWindow;
    #zoneCommandWindow: CommandWindow;
    
    constructor(readonly scene: CardBattleScene, powerSlots: any[] = [], noTextWindow: boolean = false) {
        super(powerSlots);
        this.#noTextWindow = noTextWindow;
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
        this.scene.changePhase(new LoadPhase(this.scene, this.getPowerSlots()));
    }

    changeToTriggerPhase(origin: string): void {
        this.scene.changePhase(new TriggerPhase(this.scene, this.getPowerSlots(), origin));
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

    create(): void {
        this.createTextWindow('Load Phase started!');
        this.createCommandWindow('Select power card?');
        this.createZoneCommandWindow('Select your zone');
        if (this.#noTextWindow) {
            this.openCommandWindow();
            return;
        }
        this.openTextWindow();
    }

    private createTextWindow(title: string): void {
        this.#textWindow = TextWindow.createCentered(this.scene, title, {
            onClose: () => {
                this.openCommandWindow();
            }
        });
    }

    private createCommandWindow(title: string): void {
        this.#commandWindow = CommandWindow.createBottom(this.scene, title, [
            {
                description: 'Yes',
                onSelect: () => {
                    this.openZoneCommandWindow();
                }
            },
            {
                description: 'No',
                onSelect: () => {
                    if (this.hasPower()) {
                        const origin = 'LOAD';
                        this.changeToTriggerPhase(origin);
                        return;
                    }
                    this.changeToSummonPhase();
                }
            },
        ]);
    }

    private createZoneCommandWindow(title: string): void {
        this.#zoneCommandWindow = CommandWindow.createBottom(this.scene, title, [
            {
                description: 'Play Power card',
                onSelect: () => {
                    this.addPowerSlot({
                        action: 'POWER_1',
                        params: {
                            cardId: 'card_1',
                            zone: 'player'
                        } 
                    });
                    console.log(this.powerSlotsTotal());
                    if (this.isLimitReached()) {
                        const origin = 'LOAD';
                        this.changeToTriggerPhase(origin);
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
            },
        ]);
    }

    openTextWindow(): void {
        this.#textWindow.open();
    }

    openCommandWindow(): void {
        this.#commandWindow.open();
    }

    openZoneCommandWindow(): void {
        this.#zoneCommandWindow.open();
    }

    update(): void {
        console.log("Updating Load Phase...");
    }
    
    destroy(): void {
        if (this.#textWindow) this.#textWindow.destroy();
    }
}