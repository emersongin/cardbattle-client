import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@/game/ui/TextWindow';
import { StartPhase } from "./StartPhase";
import { CommandWindow } from "@/game/ui/CommandWindow";

export class ChallengePhase implements Phase {
    private textWindow: TextWindow;
    private commandWindow: CommandWindow;
    constructor(readonly scene: CardBattleScene) {}

    create(): void {
        this.createTextWindow('Challenge Phase started!');
        this.createCommandWindow('Choose your folder');
        this.openTextWindow();
    }

    private createTextWindow(title: string): void {
        this.textWindow = TextWindow.createCenteredWindow(this.scene, title, {
            onClose: () => {
                this.openCommandWindow();
            }
        });
    }

    openCommandWindow(): void {
        this.commandWindow.open();
    }

    private createCommandWindow(title: string): void {
        this.commandWindow = CommandWindow.createBottom(this.scene, title, [
            {
                description: 'Folder 1',
                onSelect: () => {
                    this.scene.changePhase(new StartPhase(this.scene));
                }
            },
            {
                description: 'Folder 2',
                onSelect: () => {
                    this.scene.changePhase(new StartPhase(this.scene));
                }
            },
            {
                description: 'Folder 3',
                onSelect: () => {
                    this.scene.changePhase(new StartPhase(this.scene));
                }
            },
        ]);
    }

    openTextWindow(): void {
        this.textWindow.open();
    }

    update(): void {
        console.log("Updating Challenge Phase...");
    }

    destroy(): void {
        if (this.textWindow) {
            this.textWindow.destroy();
        }
    }
}