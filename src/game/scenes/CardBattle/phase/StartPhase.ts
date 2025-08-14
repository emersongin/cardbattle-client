import { CardBattlePhase } from "./CardBattlePhase";
import { Phase } from "./Phase";
import { WHITE, BLACK } from "@/game/constants/colors";
import { DrawPhase } from "./DrawPhase";
import { ArrayUtil } from "@/game/utils/ArrayUtil";

export class StartPhase extends CardBattlePhase implements Phase {

    async create(): Promise<void> {
        if (await this.cardBattle.isStartMiniGame(this.scene.room.playerId)) {
            this.#createMiniGameWindows();
            this.#createMiniGameCommandWindow();
            super.openAllWindows();
            return;
        }
        super.createWaitingWindow();
        super.openAllWindows({
            onComplete: async () => {
                await this.cardBattle.listenOpponentMiniGame(
                    (choice) => super.closeAllWindows({ onComplete: () => this.#createResultWindow(choice) })
                );
            }
        });
    }

    #createMiniGameWindows(): void {
        super.createTextWindowCentered('Start Phase', {
            textAlign: 'center',
            onClose: () => this.openCommandWindow()
        });
        super.addTextWindow('Draw white card to go first.');
    }

    #createMiniGameCommandWindow(): void {
        const options = [
            {
                description: 'option: Draw white card',
                onSelect: async () => {
                    await this.cardBattle.setMiniGameChoice(this.scene.room.playerId, WHITE);
                    this.#createResultWindow(WHITE);
                }
            },
            {
                description: 'option: Draw black card',
                onSelect: async () => {
                    await this.cardBattle.setMiniGameChoice(this.scene.room.playerId, BLACK);
                    this.#createResultWindow(BLACK);
                }
            },
        ];
        ArrayUtil.shuffle(options);
        super.createCommandWindowCentered('Select a card', options);
    }

    #createResultWindow(choice: string): void {
        super.createTextWindowCentered(choice === WHITE ? 'You go first!' : 'Opponent goes first!', {
            textAlign: 'center',
            onClose: () => this.changeToDrawPhase()
        });
        super.openAllWindows();
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