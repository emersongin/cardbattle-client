import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@ui/TextWindow';
import { DrawPhase } from "./DrawPhase";
import { CommandWindow } from "@ui/CommandWindow";

export class StartPhase implements Phase {
    private textWindow: TextWindow;
    private commandWindow: CommandWindow;
    constructor(readonly scene: CardBattleScene) {}

    create(): void {
        this.createTextWindow('Start Phase completed, transitioning to Start Phase!');
        this.createCommandWindow('Start Phase Options');
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
        this.commandWindow = CommandWindow.createCentered(this.scene, title, [
            {
                description: 'option 1',
                onSelect: () => {
                    this.scene.changePhase(new DrawPhase(this.scene));
                }
            },
            {
                description: 'option 2',
                onSelect: () => {
                    this.scene.changePhase(new DrawPhase(this.scene));
                }
            }
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
    
}