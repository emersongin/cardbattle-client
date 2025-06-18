import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@/game/ui/TextWindow';
import { BattlePhase } from "./BattlePhase";
import { CommandWindow } from "@/game/ui/CommandWindow";
import { TriggerPhase } from "./TriggerPhase";

export class CompilePhase implements Phase {
    #textWindow: TextWindow;
    #noTextWindow: boolean = false;
    #commandWindow: CommandWindow;
    #zoneCommandWindow: CommandWindow;
    #powerSlots: any[] = [];
    constructor(readonly scene: CardBattleScene, powerSlots: any[] = [], noTextWindow: boolean = false) {
        this.#powerSlots = powerSlots;
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
        throw new Error("Method not implemented.");
    }

    changeToTriggerPhase(origin: string): void {
        this.scene.changePhase(new TriggerPhase(this.scene, this.#powerSlots, origin));
    }

    changeToSummonPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToCompilePhase(): void {
        this.scene.changePhase(new CompilePhase(this.scene, this.#powerSlots));
    }

    changeToBattlePhase(): void {
        this.scene.changePhase(new BattlePhase(this.scene));
    }

    create(): void {
        this.createTextWindow('Compile Phase started!');
        this.createCommandWindow('Select power card?');
        this.createZoneCommandWindow('Select your zone');
        if (this.#noTextWindow) {
            this.openCommandWindow();
            return;
        }
        this.openTextWindow();
    }

    private createTextWindow(title: string): void {
        this.#textWindow = TextWindow.createCenteredWindow(this.scene, title, {
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
                    if (this.#powerSlots.length) {
                        const origin = 'COMPILE';
                        this.changeToTriggerPhase(origin);
                        return;
                    }
                    this.changeToBattlePhase();
                }
            },
        ]);
    }

    private createZoneCommandWindow(title: string): void {
        this.#zoneCommandWindow = CommandWindow.createBottom(this.scene, title, [
            {
                description: 'Play Power card',
                onSelect: () => {
                    this.#powerSlots.push({
                        action: 'POWER_1',
                        params: {
                            cardId: 'card_1',
                            zone: 'player'
                        } 
                    });
                    console.log(this.#powerSlots.length);
                    if (this.#powerSlots.length >= 3) {
                        const origin = 'COMPILE';
                        this.changeToTriggerPhase(origin);
                        return;
                    }
                    this.changeToCompilePhase();
                }
            },
            {
                description: 'Trash',
                onSelect: () => {
                    this.changeToCompilePhase();
                }
            },
            {
                description: 'Field',
                onSelect: () => {
                    this.changeToCompilePhase();
                }
            },
            {
                description: 'Hand',
                onSelect: () => {
                    this.changeToCompilePhase();
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
        console.log("Updating Compile Phase...");
    }
    
    destroy(): void {
        if (this.#textWindow) this.#textWindow.destroy();
    }
}