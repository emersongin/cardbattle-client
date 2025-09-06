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
        this.#createOpponentDeckSetWaitingWindow();
        super.openAllWindows({
            onComplete: async () => {
                await this.cardBattle.listenOpponentDeckSet(this.scene.room.playerId, () => {
                    super.closeAllWindows({ onComplete: () => this.#loadStartPhase() });
                });
            }
        });
    }

    #createOpponentDeckSetWaitingWindow(): void {
        super.createWaitingWindow('Waiting for opponent to set their deck...');
    }

    async #loadStartPhase(): Promise<void> {
        if (await this.cardBattle.isPlayMiniGame(this.scene.room.playerId)) {
            this.#createStartPhaseWindows({ onClose: () => {
                this.#createMiniGameCommandWindow();
                super.openCommandWindow();
            }});
            super.openAllWindows();
            return;
        }
        this.#createStartPhaseWindows({ onClose: () => {
            this.#createOpponentMiniGameEndWaitingWindow();
            super.openAllWindows({
                onComplete: async () => {
                    await this.cardBattle.listenOpponentEndMiniGame(
                        this.scene.room.playerId,
                        (choice: string) => super.closeAllWindows({ 
                            onComplete: () => {
                                this.#createResultWindow(choice)
                            } 
                        })
                    );
                }
            });
        }});
        super.openAllWindows();
    }

    #createStartPhaseWindows(config: { onClose: () => void }): void {
        super.createTextWindowCentered('Start Phase', { textAlign: 'center', onClose: config.onClose });
        super.addTextWindow('Draw white card to go first.');
    }

    #createOpponentMiniGameEndWaitingWindow(): void {
        super.createWaitingWindow('Waiting for opponent to finish the mini-game...');
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