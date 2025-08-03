import { CardBattlePhase } from "./CardBattlePhase";
import { Phase } from "./Phase";
import { WHITE, BLACK } from "@/game/constants/colors";
import { DrawPhase } from "./DrawPhase";

export class StartPhase extends CardBattlePhase implements Phase {

    async create(): Promise<void> {
        const iGo = await this.cardBattle.iGo();
        if (!iGo) {
            super.createWaitingWindow();
            super.openAllWindows();
            await this.cardBattle.listenOpponentStartPhase((choice) => {
                const onClose = () => this.#createResultWindow(choice);
                super.closeAllWindows(onClose);
            });
            return;
        }
        this.#createMiniGameWindows();
        this.#createMiniGameCommandWindow();
        super.openAllWindows();
    }

    #createMiniGameWindows(): void {
        super.createTextWindowCentered('Start Phase', {
            textAlign: 'center',
            onClose: () => {
                this.openCommandWindow();
            }
        });
        super.addTextWindow('Draw white card to go first.');
    }

    #createMiniGameCommandWindow(): void {
        const options = [
            {
                description: 'option: Draw white card',
                onSelect: async () => {
                    await this.cardBattle.setPlayerChoice(WHITE);
                    this.#createResultWindow(WHITE);
                }
            },
            {
                description: 'option: Draw black card',
                onSelect: async () => {
                    await this.cardBattle.setPlayerChoice(BLACK);
                    this.#createResultWindow(BLACK);
                }
            },
        ];
        options.sort(() => Math.random() - 0.5);
        super.createCommandWindowCentered('Select a card', options);
    }

    #createResultWindow(choice: string): void {
        super.createTextWindowCentered(choice === WHITE ? 'You go first!' : 'Opponent goes first!', {
            textAlign: 'center',
            onClose: () => {
                this.changeToDrawPhase();
            }
        });
        super.openAllWindows();
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
        super.destroyAllTextWindows();
        super.destroyCommandWindow();
    }

}