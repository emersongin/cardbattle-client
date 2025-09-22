import { OpponentData } from "@objects/OpponentData";
import { CardsFolderData } from "@objects/CardsFolderData";
import { Phase } from "@scenes/CardBattle/phase/Phase";
import { StartPhase } from "@scenes/CardBattle/phase/StartPhase";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";

export class ChallengePhase extends CardBattlePhase implements Phase {

    async create(): Promise<void> {
        if (await this.cardBattle.isOpponentJoined(this.scene.room.playerId)) {
            this.#loadChallengePhase();
            return;
        }
        super.createWaitingWindow('Waiting for opponent to join the room...');
        super.openAllWindows({
            onComplete: async () => {
                await this.cardBattle.listenOpponentJoined(this.scene.room.playerId, () => 
                    super.closeAllWindows({ onComplete: () => this.#loadChallengePhase() })
                );
            }
        });
    }

    async #loadChallengePhase(): Promise<void> {
        await this.cardBattle.getOpponentData(
            this.scene.room.playerId, 
            (opponent: OpponentData) => {
                const { name, description } = opponent;
                super.createTextWindowCentered('Challenge Phase', { 
                    textAlign: 'center', 
                    textColor: '#fff',
                    onClose: async () => {
                        this.#createFoldersCommandWindow(await this.cardBattle.getFolders());
                        super.openCommandWindow();
                    }  
                });
                super.addTextWindow(`${name}\n${description}`);
                super.openAllWindows();
            }
        );
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

    changeToStartPhase(): void {
        this.scene.changePhase(new StartPhase(this.scene));
    }
    
    changeToChallengePhase(): void {
        throw new Error("Method not implemented.");
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