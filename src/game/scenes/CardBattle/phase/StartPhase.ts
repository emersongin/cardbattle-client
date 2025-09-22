import { WHITE, BLACK } from "@constants/colors";
import { Phase } from "@scenes/CardBattle/phase/Phase";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { DrawPhase } from "@scenes/CardBattle/phase/DrawPhase";
import { ArrayUtil } from "@utils/ArrayUtil";

export class StartPhase extends CardBattlePhase implements Phase {

    async create(): Promise<void> {
        if (await this.cardBattle.isOpponentDeckSet(this.scene.room.playerId)) {
            this.#loadStartPhase();
            return;
        }
        super.createWaitingWindow('Waiting for opponent to set their deck...');
        super.openAllWindows({
            onComplete: async () => {
                await this.cardBattle.listenOpponentDeckSet(this.scene.room.playerId, () => {
                    super.closeAllWindows({ onComplete: () => this.#loadStartPhase() });
                });
            }
        });
    }

    async #loadStartPhase(): Promise<void> {
        if (await this.cardBattle.isPlayMiniGame(this.scene.room.playerId)) {
            super.createTextWindowCentered('Start Phase', { 
                textAlign: 'center', 
                onClose: () => {
                    this.#createMiniGameCommandWindow();
                    super.openCommandWindow();
                }
            });
            super.openAllWindows();
            return;
        }
        super.createTextWindowCentered('Start Phase', { 
            textAlign: 'center', 
            onClose: () => {
                super.createWaitingWindow('Waiting for opponent to finish the mini-game...');
                super.openAllWindows({
                    onComplete: async () => {
                        await this.cardBattle.listenOpponentEndMiniGame(
                            this.scene.room.playerId,
                            (choice: string) => 
                                super.closeAllWindows({ onComplete: () => this.#createResultWindow(choice)})
                        );                           
                    }
                });
            } 
        });
        super.addTextWindow('Draw white card to go first.');
        super.openAllWindows();
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

    changeToDrawPhase(): void {
        this.scene.changePhase(new DrawPhase(this.scene));
    }

    changeToChallengePhase(): void {
        throw new Error("Method not implemented.");
    }
    
    changeToStartPhase(): void {
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
        super.destroyAllTextWindows();
        super.destroyCommandWindow();
    }
}