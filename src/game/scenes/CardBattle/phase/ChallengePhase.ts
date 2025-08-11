import { Phase } from "./Phase";
import { StartPhase } from "./StartPhase";
import { CardsFolderData, OpponentData } from "@game/types";
import { CardBattlePhase } from "./CardBattlePhase";

export class ChallengePhase extends CardBattlePhase implements Phase {
    async create(): Promise<void> {
        if (await this.cardBattle.isOpponentJoined()) {
            await this.cardBattle.getOpponentData(
                (opponent: OpponentData) => this.#createAndOpenChallengeWindows(opponent));
            return;
        }
        super.createWaitingWindow();
        super.openAllWindows({
            onComplete: async () => {
                await this.cardBattle.listenWaitingForOpponent((opponent: OpponentData) => 
                    super.closeAllWindows({ onComplete: () => this.#createAndOpenChallengeWindows(opponent) })
                );
            }
        });
    }

    #createAndOpenChallengeWindows(opponent: OpponentData): void {
        this.#createChallengeWindows(opponent);
        super.openAllWindows({ onClose: () => this.#createAndOpenFoldersWindow() });
    }

    #createChallengeWindows(opponent: OpponentData) {
        super.createTextWindowCentered('CardBattle Challenge!', { textAlign: 'center', textColor: '#ff3c3c' });
        const { name, description } = opponent;
        super.addTextWindow(`${name}\n${description}`);
    }

    async #createAndOpenFoldersWindow(): Promise<void> {
        const folders: CardsFolderData[] = await this.cardBattle.getFolders();
        this.#createFoldersCommandWindow(folders);
        super.openCommandWindow();
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
        super.destroyAllTextWindows();
        super.destroyCommandWindow();
    }
}