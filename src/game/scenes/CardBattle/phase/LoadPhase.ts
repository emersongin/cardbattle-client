import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@/game/ui/TextWindow';
import { SummonPhase } from "./SummonPhase";
import { CommandWindow } from "@/game/ui/CommandWindow";

export class LoadPhase implements Phase {
    #textWindow: TextWindow;
    #commandWindow: CommandWindow;
    #zoneCommandWindow: CommandWindow;
    // #powerCardSlots: PowerCard[] = [];
    constructor(readonly scene: CardBattleScene) {}

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
        this.scene.changePhase(new LoadPhase(this.scene));
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
                    this.changeToSummonPhase();
                }
            },
        ]);
    }

    private createZoneCommandWindow(title: string): void {
        this.#zoneCommandWindow = CommandWindow.createBottom(this.scene, title, [
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