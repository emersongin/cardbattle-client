import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@/game/ui/TextWindow';
import { DrawPhase } from "./DrawPhase";
import { CommandWindow } from "@/game/ui/CommandWindow";
import { CardBattle } from "@/game/api/CardBattle";
import { COLORS } from "@/game/constants/Colors";

export class StartPhase implements Phase {
    #cardBattle: CardBattle;
    #waitingWindow: TextWindow;
    #titleWindow: TextWindow;
    #textWindow: TextWindow;
    #commandWindow: CommandWindow;
    #resultWindow: TextWindow;

    constructor(readonly scene: CardBattleScene) {
        this.#cardBattle = scene.getCardBattle();
    }

    async create(): Promise<void> {
        const iGo = await this.#cardBattle.iGo();
        if (!iGo) {
            this.createWaitingWindow();
            this.createResultWindow();
            this.openWaitingWindow();
            await this.#cardBattle.listenOpponentChoice((choice) => {
                const onClose = () => {
                    this.openResultWindow(choice);
                }
                this.closeWaitingWindow(onClose);
            });
            return;
        }
        this.createChallengeWindows();
        this.createCommandWindow();
        this.createResultWindow();
        this.openChallengeWindows();
    }

    private createWaitingWindow(): void {
        this.#waitingWindow = TextWindow.createCenteredWindow(this.scene, 'Waiting for opponent...', {
            align: 'center',
        });
    }

    private openWaitingWindow(): void {
        this.#waitingWindow.open();
    }

    private closeWaitingWindow(onClose: () => void): void {
        this.#waitingWindow.setOnClose(onClose);
        this.#waitingWindow.close();
    }

    private createChallengeWindows(): void {
        this.createTitleWindow();
        this.createTextWindow();
    }

    private createTitleWindow(): void {
        this.#titleWindow = TextWindow.createCenteredWindow(this.scene, 'Start Phase', {
            align: 'center',
            color: '#ff3c3c',
            onStartClose: () => {
                this.#textWindow.close();
            },
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
                description: COLORS.WHITE,
                onSelect: async () => {
                    await this.#cardBattle.setOpponentChoice(COLORS.WHITE);
                    this.openResultWindow(COLORS.WHITE);
                }
            },
            {
                description: COLORS.BLACK,
                onSelect: async () => {
                    await this.#cardBattle.setOpponentChoice(COLORS.BLACK);
                    this.openResultWindow(COLORS.BLACK);
                }
            },
        ];
        options.sort(() => Math.random() - 0.5);
        this.#commandWindow = CommandWindow.createBottom(this.scene, 'Select a card', options);
    }

    private createResultWindow(): void {
        this.#resultWindow = TextWindow.createCenteredWindow(this.scene, '', {
            align: 'center',
            onClose: () => {
                this.changeToDrawPhase();
            }
        });
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

    openResultWindow(choice: string): void {
        this.#resultWindow.setText(choice === COLORS.WHITE ? 'You go first!' : 'Opponent goes first!');
        this.#resultWindow.open();
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