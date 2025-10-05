import { OpponentData } from "@objects/OpponentData";
import { Phase } from "@scenes/CardBattle/phase/Phase";
import { StartPhase } from "@scenes/CardBattle/phase/StartPhase";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { CommandOption } from "@/game/ui/CommandWindow/CommandOption";

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
                        this.#createFoldersCommandWindow(await this.cardBattle.getFoldersOptions());
                        super.openCommandWindow();
                    }  
                });
                super.addTextWindow(`${name}\n${description}`);
                super.openAllWindows();
            }
        );
    }

    #createFoldersCommandWindow(options: CommandOption<string>[]): void {
        options = options.map(option => {
            const folderId = option.onSelect() as string;
            option.onSelect = async () => {
                await this.cardBattle.setFolder(this.scene.room.playerId, folderId);
                this.changeToStartPhase();
            }
            return option;
        });
        super.createCommandWindowCentered('Choose your folder', options);
    }

    changeToStartPhase(): void {
        this.scene.changePhase(new StartPhase(this.scene));
    }
}