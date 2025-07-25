import { CardBattlePhase, TextWindowConfig } from "./CardBattlePhase";
import { Phase } from "./Phase";
import { WHITE, BLACK } from "@game/constants/Colors";
import { DrawPhase } from "./DrawPhase";

export class StartPhase extends CardBattlePhase implements Phase {

    async create(): Promise<void> {
        const iGo = await this.cardBattle.iGo();
        if (!iGo) {
            this.#createAndOpenWaitingWindow();
            await this.cardBattle.listenOpponentChoice((choice) => {
                const onClose = () => {
                    this.#openResultWindow(choice);
                }
                super.onCloseTitleWindow(onClose);
                super.closeTitleWindow();
            });
            return;
        }
        this.#createWindows();
        this.#createCommandWindow();
        this.#openWindows();
    }

    #createAndOpenWaitingWindow(): void {
        super.createTitleWindow('Waiting for opponent...', {
            align: 'center',
        });
        super.openTitleWindow();
    }

    #createWindows(): void {
        this.#createTitleWindow();
        this.#createTextWindow();
    }

    #createTitleWindow(): void {
        super.createTitleWindow('Start Phase', {
            align: 'center',
            onStartClose: () => {
                this.closeTextWindow();
            },
            onClose: () => {
                this.openCommandWindow();
            }
        });
    }

    #createTextWindow(): void {
        super.createTextWindow('Draw white card to go first.', {
            relativeParent: this.getTitleWindow(),
        });
    }

    #createCommandWindow(): void {
        const options = [
            {
                description: WHITE,
                onSelect: async () => {
                    await this.cardBattle.setOpponentChoice(WHITE);
                    this.#openResultWindow(WHITE);
                }
            },
            {
                description: BLACK,
                onSelect: async () => {
                    await this.cardBattle.setOpponentChoice(BLACK);
                    this.#openResultWindow(BLACK);
                }
            },
        ];
        options.sort(() => Math.random() - 0.5);
        super.createCommandWindow('Select a card', options);
    }

    #openWindows(): void {
        this.openTitleWindow();
        this.openTextWindow();
    }

    #openResultWindow(choice: string): void {
        this.#createResultWindow(choice === WHITE ? 'You go first!' : 'Opponent goes first!', {
            align: 'center',
            onClose: () => {
                this.changeToDrawPhase();
            }
        });
        super.openTitleWindow();
    }

    #createResultWindow(text: string, config: TextWindowConfig): void {
        super.createTitleWindow(text, config);
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
        this.destroyTitleWindow();
        this.destroyTextWindow();
        this.destroyCommandWindow();
    }
    
}