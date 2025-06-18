import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@/game/ui/TextWindow';
import { BattlePhase } from "./BattlePhase";
import { CommandWindow } from "@/game/ui/CommandWindow";

export class CompilePhase implements Phase {
    #textWindow: TextWindow;
    #commandWindow: CommandWindow;
    #zoneCommandWindow: CommandWindow;
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
        throw new Error("Method not implemented.");
    }

    changeToSummonPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToCompilePhase(): void {
        this.scene.changePhase(new CompilePhase(this.scene));
    }

    changeToBattlePhase(): void {
        this.scene.changePhase(new BattlePhase(this.scene));
    }

    create(): void {
        this.createTextWindow('Compile Phase started!');
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
                    this.changeToBattlePhase();
                }
            },
        ]);
    }

    private createZoneCommandWindow(title: string): void {
        this.#zoneCommandWindow = CommandWindow.createBottom(this.scene, title, [
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