import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@game/ui/TextWindow';
import { DrawPhase } from "./DrawPhase";
import { CommandWindow } from "@game/ui/CommandWindow";
import { CardBattle } from "@game/api/CardBattle";
import { WHITE, BLACK } from "@game/constants/Colors";

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
            this.#createWaitingWindow();
            this.#createResultWindow();
            this.#openWaitingWindow();
            await this.#cardBattle.listenOpponentChoice((choice) => {
                const onClose = () => {
                    this.#openResultWindow(choice);
                }
                this.#closeWaitingWindow(onClose);
            });
            return;
        }
        this.#createWindows();
        this.#createCommandWindow();
        this.#createResultWindow();
        this.#openWindows();
    }

    #createWaitingWindow(): void {
        this.#waitingWindow = TextWindow.createCentered(this.scene, 'Waiting for opponent...', {
            align: 'center',
        });
    }

    #openWaitingWindow(): void {
        this.#waitingWindow.open();
    }

    #closeWaitingWindow(onClose: () => void): void {
        this.#waitingWindow.setOnClose(onClose);
        this.#waitingWindow.close();
    }

    #createWindows(): void {
        this.#createTitleWindow();
        this.#createTextWindow();
    }

    #createTitleWindow(): void {
        this.#titleWindow = TextWindow.createCentered(this.scene, 'Start Phase', {
            align: 'center',
            onStartClose: () => {
                this.#closeTextWindow();
            },
            onClose: () => {
                this.#openCommandWindow();
            }
        });
    }

    #closeTextWindow(): void {
        this.#textWindow.close();
    }

    #createTextWindow(): void {
        this.#textWindow = TextWindow.createCentered(this.scene, 'Draw white card to go first.', {
            relativeParent: this.#titleWindow
        });
    }

    #createCommandWindow(): void {
        const options = [
            {
                description: WHITE,
                onSelect: async () => {
                    await this.#cardBattle.setOpponentChoice(WHITE);
                    this.#openResultWindow(WHITE);
                }
            },
            {
                description: BLACK,
                onSelect: async () => {
                    await this.#cardBattle.setOpponentChoice(BLACK);
                    this.#openResultWindow(BLACK);
                }
            },
        ];
        options.sort(() => Math.random() - 0.5);
        this.#commandWindow = CommandWindow.createCentered(this.scene, 'Select a card', options);
    }

    #createResultWindow(): void {
        this.#resultWindow = TextWindow.createCentered(this.scene, '', {
            align: 'center',
            onClose: () => {
                this.changeToDrawPhase();
            }
        });
    }

    #openWindows(): void {
        this.#openTitleWindow();
        this.#openTextWindow();
    }

    #openTitleWindow(): void {
        this.#titleWindow.open();
    }

    #openTextWindow(): void {
        this.#textWindow.open();
    }

    #openCommandWindow(): void {
        this.#commandWindow.open();
    }

    #openResultWindow(choice: string): void {
        this.#resultWindow.setText(choice === WHITE ? 'You go first!' : 'Opponent goes first!');
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
        if (this.#titleWindow) this.#titleWindow.destroy();
        if (this.#waitingWindow) this.#waitingWindow.destroy();
        if (this.#resultWindow) this.#resultWindow.destroy();
    }
    
}