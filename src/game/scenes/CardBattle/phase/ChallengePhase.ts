import { Phase } from "./Phase";
import { StartPhase } from "./StartPhase";
import { CardsFolderData, OpponentData } from "@game/types";
import { CardBattlePhase } from "./CardBattlePhase";

export class ChallengePhase extends CardBattlePhase implements Phase {

    async create(): Promise<void> {
        if (await this.cardBattle.isOpponentJoined(this.scene.room.playerId)) {
            this.#loadChallengePhase();
            return;
        }
        this.#createOpponentWaitingWindow();
        super.openAllWindows({
            onComplete: async () => {
                await this.cardBattle.listenOpponentJoined(this.scene.room.playerId, () => 
                    super.closeAllWindows({ onComplete: () => this.#loadChallengePhase() })
                );
            }
        });
    }

    #createOpponentWaitingWindow(): void {
        super.createWaitingWindow('Waiting for opponent to join the room...');
    }

    async #loadChallengePhase(): Promise<void> {
        await this.cardBattle.getOpponentData(
            this.scene.room.playerId, 
            (opponent: OpponentData) => {
                this.#createChallengePhaseWindows(opponent);
                super.openAllWindows({ 
                    onClose: async () => {
                        this.#createFoldersCommandWindow(await this.cardBattle.getFolders());
                        super.openCommandWindow();
                    } 
                });
            }
        );
    }

    #createChallengePhaseWindows(opponent: OpponentData) {
        super.createTextWindowCentered('Challenge Phase!', { textAlign: 'center', textColor: '#ff3c3c' });
        const { name, description } = opponent;
        super.addTextWindow(`${name}\n${description}`);
    }

    #createFoldersCommandWindow(folders: CardsFolderData[]): void {
        const padValue = 16;
        const folderDescriptions = folders.map(folder => {
            return {
                id: folder.id,
                name: folder.name.padEnd(padValue),
                description: `${Object.entries(folder.colorsPoints).map(([color, points]) => `${color}: ${points.toString().padStart(2, "0")}`).join(', ')}`
            };
        });
        const options = folderDescriptions.map(folder => ({
            description: `${folder.name} ${folder.description}`,
            onSelect: async () => {
                await this.cardBattle.setFolder(this.scene.room.playerId, folder.id);
                this.changeToStartPhase();
            }
        }));
        super.createCommandWindowCentered('Choose your folder', options);
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
        super.destroyAllTextWindows();
        super.destroyCommandWindow();
    }
}