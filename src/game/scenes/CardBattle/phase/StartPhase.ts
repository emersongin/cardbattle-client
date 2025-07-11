import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@/game/ui/TextWindow';
import { DrawPhase } from "./DrawPhase";
import { CommandWindow } from "@/game/ui/CommandWindow";
import { Api } from "../../VueScene";

export class StartPhase implements Phase {
    #api: Api;
    #waitingWindow: TextWindow;
    #titleWindow: TextWindow;
    #textWindow: TextWindow;
    #commandWindow: CommandWindow;

    constructor(readonly scene: CardBattleScene) {
        this.#api = scene.getApi();
    }

    async create(): Promise<void> {
        const iGo = await this.#api.iGo();
        if (!iGo) {
            this.createWaitingWindow();
            this.openWaitingWindow();
            return;
        }
        this.createChallengeWindows();
        this.createCommandWindow();
        this.openChallengeWindows();
    }

    private createWaitingWindow(): void {
        this.#waitingWindow = TextWindow.createCenteredWindow(this.scene, 'Waiting for opponent...', {
            align: 'center',
        });
    }

    openWaitingWindow(): void {
        this.#waitingWindow.open();
    }

    private createChallengeWindows(): void {
        this.createTitleWindow();
        this.createTextWindow();
    }

    private createTitleWindow(): void {
        this.#titleWindow = TextWindow.createCenteredWindow(this.scene, 'Start Phase', {
            align: 'center',
            color: '#ff3c3c',
            onClose: () => {
                this.openCommandWindow();
            }
        });
    }

    private createTextWindow(): void {
        this.#textWindow = TextWindow.createCenteredWindow(this.scene, 'Draw white card to go first.', {
            relativeParent: this.#titleWindow
        });
    }

    private createCommandWindow(): void {
        const options = [
            {
                description: 'White',
                onSelect: async () => {
                    this.changeToDrawPhase();
                }
            },
            {
                description: 'Black',
                onSelect: async () => {
                    this.changeToDrawPhase();
                }
            },
        ];
        options.sort(() => Math.random() - 0.5);
        this.#commandWindow = CommandWindow.createBottom(this.scene, 'Select a card', options);
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

    openCommandWindow(): void {
        this.#commandWindow.open();
    }

    update(): void {
        console.log("Updating Start Phase...");
    }

    changeToChallengePhase(): void {
        throw new Error("Method not implemented.");
    }
    
    changeToStartPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToDrawPhase(): void {
        this.scene.changePhase(new DrawPhase(this.scene));
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
        if (this.#commandWindow) this.#commandWindow.destroy();
    }
    
}