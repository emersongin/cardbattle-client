import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@/game/ui/TextWindow';
import { StartPhase } from "./StartPhase";
import { CommandWindow } from "@/game/ui/CommandWindow";
import { CardsFolder, Challenging } from "@/game/types";
import { CardBattle } from "@/game/api/CardBattle";

export class ChallengePhase implements Phase {
    #cardBattle: CardBattle;
    #titleWindow: TextWindow;
    #textWindow: TextWindow;
    #commandWindow: CommandWindow;

    constructor(readonly scene: CardBattleScene) {
        this.#cardBattle = scene.getCardBattle();
    }

    async create(): Promise<void> {
        const challenging: Challenging = await this.#cardBattle.getChallenging();
        const folders: CardsFolder[] = await this.#cardBattle.getFolders();
        this.createChallengeWindows(challenging);
        this.createCommandWindow(folders);
        this.openChallengeWindows();
    }

    private createChallengeWindows(challenging: Challenging): void {
        this.createTitleWindow();
        const { name, description } = challenging;
        this.createTextWindow(name, description);
    }

    private createTitleWindow(): void {
        this.#titleWindow = TextWindow.createCenteredWindow(this.scene, 'CardBattle Challenge!', {
            align: 'center',
            color: '#ff3c3c',
            onClose: () => {
                this.openCommandWindow();
            }
        });
    }

    openCommandWindow(): void {
        this.#commandWindow.open();
    }

    private createTextWindow(name: string, description: string): void {
        this.#textWindow = TextWindow.createCenteredWindow(this.scene, `${name}\n${description}`, {
            relativeParent: this.#titleWindow
        });
    }

    private createCommandWindow(folders: CardsFolder[]): void {
        const [folder1, folder2, folder3] = folders;
        const padValue = 16;
        this.#commandWindow = CommandWindow.createBottom(this.scene, 'Choose your folder', [
            {
                description: `${folder1.name.padEnd(padValue)} ${Object.entries(folder1.colors).map(([color, points]) => `${color}: ${points.toString().padStart(2, "0")}`).join(', ')}`,
                onSelect: async () => {
                    await this.#cardBattle.setFolder(folder1.id);
                    this.changeToStartPhase();
                }
            },
            {
                description: `${folder2.name.padEnd(padValue)} ${Object.entries(folder2.colors).map(([color, points]) => `${color}: ${points.toString().padStart(2, "0")}`).join(', ')}`,
                onSelect: async () => {
                    await this.#cardBattle.setFolder(folder2.id);
                    this.changeToStartPhase();
                }
            },
            {
                description: `${folder3.name.padEnd(padValue)} ${Object.entries(folder3.colors).map(([color, points]) => `${color}: ${points.toString().padStart(2, "0")}`).join(', ')}`,
                onSelect: async () => {
                    await this.#cardBattle.setFolder(folder3.id);
                    this.changeToStartPhase();
                }
            },
        ]);
    }

    private openChallengeWindows(): void {
        this.openTitleWindow();
        this.openTextWindow();
    }

    openTitleWindow(): void {
        this.#titleWindow.open();
    }

    openTextWindow(): void {
        this.#textWindow.open();
    }

    update(): void {
        console.log("Updating Challenge Phase...");
    }

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

    destroy(): void {
        if (this.#textWindow) this.#textWindow.destroy();
    }
}