import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@/game/ui/TextWindow';
import { DrawPhase } from "./DrawPhase";
import { CommandWindow } from "@/game/ui/CommandWindow";

export class StartPhase implements Phase {
    private textWindow: TextWindow;
    private commandWindow: CommandWindow;
    constructor(readonly scene: CardBattleScene) {}

    create(): void {
        this.createTextWindow('Start Phase started!');
        this.createCommandWindow('Select Card Color');
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
                description: 'Black',
                onSelect: () => {
                    this.scene.changePhase(new DrawPhase(this.scene));
                }
            },
            {
                description: 'White',
                onSelect: () => {
                    this.scene.changePhase(new DrawPhase(this.scene));
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

    update(): void {
        console.log("Updating Start Phase...");
    }

    destroy(): void {
        if (this.textWindow) {
            this.textWindow.destroy();
        }
        if (this.commandWindow) {
            this.commandWindow.destroy();
        }
    }
    
}