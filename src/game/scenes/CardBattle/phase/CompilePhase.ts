import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@/game/ui/TextWindow';
import { BattlePhase } from "./BattlePhase";
import { CommandWindow } from "@/game/ui/CommandWindow";

export class CompilePhase implements Phase {
    private textWindow: TextWindow;
    private commandWindow: CommandWindow;
    private zoneCommandWindow: CommandWindow;
    constructor(readonly scene: CardBattleScene) {}

    create(): void {
        this.createTextWindow('Compile Phase started!');
        this.createCommandWindow('Select power card?');
        this.createZoneCommandWindow('Select your zone');
        this.openTextWindow();
    }

    private createTextWindow(title: string): void {
        this.textWindow = TextWindow.createCenteredWindow(this.scene, title, {
            onClose: () => {
                this.openCommandWindow();
            }
        });
    }

    private createCommandWindow(title: string): void {
        this.commandWindow = CommandWindow.createBottom(this.scene, title, [
            {
                description: 'Yes',
                onSelect: () => {
                    this.openZoneCommandWindow();
                }
            },
            {
                description: 'No',
                onSelect: () => {
                    this.scene.changePhase(new BattlePhase(this.scene));
                }
            },
        ]);
    }

    private createZoneCommandWindow(title: string): void {
        this.zoneCommandWindow = CommandWindow.createBottom(this.scene, title, [
            {
                description: 'Trash',
                onSelect: () => {
                    this.scene.changePhase(new CompilePhase(this.scene));
                }
            },
            {
                description: 'Field',
                onSelect: () => {
                    this.scene.changePhase(new CompilePhase(this.scene));
                }
            },
            {
                description: 'Hand',
                onSelect: () => {
                    this.scene.changePhase(new CompilePhase(this.scene));
                }
            },
        ]);
    }

    openTextWindow(): void {
        this.textWindow.open();
    }

    openCommandWindow(): void {
        this.commandWindow.open();
    }

    openZoneCommandWindow(): void {
        this.zoneCommandWindow.open();
    }

    update(): void {
        console.log("Updating Compile Phase...");
    }
    
    destroy(): void {
        if (this.textWindow) {
            this.textWindow.destroy();
        }
    }
}