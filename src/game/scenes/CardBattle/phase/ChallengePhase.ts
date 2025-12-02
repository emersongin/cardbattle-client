import { OpponentData } from "@objects/OpponentData";
import { Phase } from "@scenes/CardBattle/phase/Phase";
import { StartPhase } from "@scenes/CardBattle/phase/StartPhase";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { CommandOption } from "@game/ui/CommandWindow/CommandOption";
import { CardBattleScene } from "../CardBattleScene";

export type ChallengePhaseEvents = {
    onOpenPhaseWindows?: () => void;
    onOpenCommandWindow?: () => void;
}

export class ChallengePhase extends CardBattlePhase implements Phase {

    constructor(scene: CardBattleScene, events?: ChallengePhaseEvents) {
        super(scene);
        if (events?.onOpenPhaseWindows) {
            super.addListener('onOpenPhaseWindows', events.onOpenPhaseWindows);
        }
        if (events?.onOpenCommandWindow) {
            super.addListener('onOpenCommandWindow', events.onOpenCommandWindow);
        }
    }

    async create(): Promise<void> {
        if (await this.cardBattle.isOpponentJoined(this.scene.getPlayerId())) {
            this.#loadChallengePhase();
            return;
        }
        super.createWaitingWindow('Waiting for opponent to join the room...');
        super.openAllWindows({
            onComplete: async () => {
                await this.cardBattle.listenOpponentJoined(this.scene.getPlayerId(), () => 
                    super.closeAllWindows({ onComplete: () => this.#loadChallengePhase() })
                );
            }
        });
    }

    async #loadChallengePhase(): Promise<void> {
        await this.cardBattle.getOpponentData(
            this.scene.getPlayerId(), 
            (opponent: OpponentData) => {
                const { name, description } = opponent;
                super.createTextWindowCentered('Challenge Phase', { 
                    textAlign: 'center', 
                    textColor: '#fff',
                });
                super.addTextWindow(`${name}\n${description}`);
                super.openAllWindows({ 
                    onComplete: () => {
                        this.#addKeyEnterOnOpenPhaseWindows();
                        super.publishEvent('onOpenPhaseWindows');
                    } 
                });
            }
        );
    }

    #addKeyEnterOnOpenPhaseWindows(): void {
        this.scene.addKeyEnterListeningOnce({ 
            onTrigger:  () => 
                super.closeAllWindows({ 
                    onComplete: async () => this.#createAndOpenCommandWindow() 
                })
            }
        );
    }

    async #createAndOpenCommandWindow(): Promise<void> {
        const options = await this.cardBattle.getFoldersOptions(this.scene.getPlayerId());
        this.#createFoldersCommandWindow(options);
        super.openCommandWindow({ 
            onComplete: () => {
                super.startCommandWindowSelection(() => this.changeToStartPhase());
                super.publishEvent('onOpenCommandWindow');
            } 
        });
    }

    #createFoldersCommandWindow(options: CommandOption[]): void {
        super.createCommandWindowCentered('Choose your folder', options);
    }

    changeToStartPhase(): void {
        this.scene.changePhase(new StartPhase(this.scene));
    }
}