import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@/game/ui/TextWindow';
import { StartPhase } from "./StartPhase";
import { CommandWindow } from "@/game/ui/CommandWindow";

export class ChallengePhase implements Phase {
    #textWindow: TextWindow;
    #commandWindow: CommandWindow;
    constructor(readonly scene: CardBattleScene) {}

    changeToChallengePhase(): void {
        throw new Error("Method not implemented.");
    }
    
    changeToStartPhase(): void {
        this.scene.changePhase(new StartPhase(this.scene));
    }

    changeToDrawPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToLoadPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToTriggerPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToSummonPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToCompilePhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToBattlePhase(): void {
        throw new Error("Method not implemented.");
    }

    create(): void {
        this.createTextWindow('Challenge Phase started!');
        this.createCommandWindow('Choose your folder');
        this.openTextWindow();
    }

    private createTextWindow(title: string): void {
        this.#textWindow = TextWindow.createCenteredWindow(this.scene, title, {
            onClose: () => {
                this.openCommandWindow();
            }
        });
    }

    openCommandWindow(): void {
        this.#commandWindow.open();
    }

    private createCommandWindow(title: string): void {
        this.#commandWindow = CommandWindow.createBottom(this.scene, title, [
            {
                description: 'Folder 1',
                onSelect: () => {
                    this.changeToStartPhase();
                }
            },
            {
                description: 'Folder 2',
                onSelect: () => {
                    this.changeToStartPhase();
                }
            },
            {
                description: 'Folder 3',
                onSelect: () => {
                    this.changeToStartPhase();
                }
            },
        ]);
    }

    

    openTextWindow(): void {
        this.#textWindow.open();
    }

    update(): void {
        console.log("Updating Challenge Phase...");
    }

    destroy(): void {
        if (this.#textWindow) this.#textWindow.destroy();
    }
}