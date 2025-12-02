
import { Phase } from "@scenes/CardBattle/phase/Phase";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { DrawPhase } from "@scenes/CardBattle/phase/DrawPhase";
import { CardBattleScene } from "../CardBattleScene";
import { TweenConfig } from "@game/types/TweenConfig";
import { WHITE } from "@game/constants/colors";
import { CommandOption } from "@game/ui/CommandWindow/CommandOption";

export type StartPhaseEvents = {
    onOpenPhaseWindows?: () => void;
    onOpenCommandWindow?: () => void;
    onOpenResultWindows?: () => void;
}

export class StartPhase extends CardBattlePhase implements Phase {

    constructor(scene: CardBattleScene, events?: StartPhaseEvents) {
        super(scene);
        if (events?.onOpenPhaseWindows) {
            super.addListener('onOpenPhaseWindows', events.onOpenPhaseWindows);
        }
        if (events?.onOpenCommandWindow) {
            super.addListener('onOpenCommandWindow', events.onOpenCommandWindow);
        }
        if (events?.onOpenResultWindows) {
            super.addListener('onOpenResultWindows', events.onOpenResultWindows);
        }
    }

    async create(): Promise<void> {
        if (await this.cardBattle.isOpponentDeckSet(this.scene.getPlayerId())) {
            this.#loadStartPhase();
            return;
        }
        super.createWaitingWindow('Waiting for opponent to set their deck...');
        super.openAllWindows({
            onComplete: async () => {
                await this.cardBattle.listenOpponentDeckSet(
                    this.scene.getPlayerId(), 
                    () => super.closeAllWindows({ onComplete: () => this.#loadStartPhase() })
                );
            }
        });
    }

    async #loadStartPhase(): Promise<void> {
        this.#createPhaseWindows();
        if (await this.cardBattle.isPlayMiniGame(this.scene.getPlayerId())) {
            super.openAllWindows({
                onComplete: () => {
                    this.#addKeyEnterOnOpenPhaseWindows({
                        onComplete: () => this.#createAndOpenMiniGameCommandWindow()
                    });
                    super.publishEvent('onOpenPhaseWindows');
                }
            });
            return;
        }
        super.openAllWindows({
            onComplete: () => {
                this.#addKeyEnterOnOpenPhaseWindows({
                    onComplete: () => this.#createOpponentWaitingWindow()
                });
                super.publishEvent('onOpenPhaseWindows');
            }
        });
    }

    #createPhaseWindows(): void {
        super.createTextWindowCentered('Start Phase', { textAlign: 'center' });
        super.addTextWindow('Draw white card to go first.');
    }

    #addKeyEnterOnOpenPhaseWindows(config?: TweenConfig): void {
        this.scene.addKeyEnterListeningOnce({
            onTrigger: () => super.closeAllWindows(config)
        });
    }

    async #createAndOpenMiniGameCommandWindow(): Promise<void> {
        const options = await this.cardBattle.getMiniGameOptions(this.scene.getPlayerId());
        this.#createMiniGameCommandWindow(options);
        super.openCommandWindow({
            onComplete: () => {
                super.startCommandWindowSelection((choice) => this.#createResultWindow(choice === WHITE));
                super.publishEvent('onOpenCommandWindow');
            }
        });
    }

    #createMiniGameCommandWindow(options: CommandOption[]): void {
        super.createCommandWindowCentered('Select a card', options);
    }

    #createResultWindow(wins: boolean): void {
        const resultMessage = wins ? 'You go first!' : 'Opponent goes first!';
        super.createTextWindowCentered(resultMessage, { textAlign: 'center' });
        super.openAllWindows({
            onComplete: () => {
                this.#addKeyEnterOnOpenResultWindows();
                super.publishEvent('onOpenResultWindows');
            },
        });
    }

    #addKeyEnterOnOpenResultWindows(): void {
        this.scene.addKeyEnterListeningOnce({ 
            onTrigger:  () => 
                super.closeAllWindows({ 
                    onComplete: () => this.changeToDrawPhase() 
                })
        });
    }

    #createOpponentWaitingWindow(): void {
        super.createWaitingWindow('Waiting for opponent to finish the mini-game...');
        super.openAllWindows({
            onComplete: async () => {
                await this.cardBattle.listenOpponentEndMiniGame(
                    this.scene.getPlayerId(),
                    (choice: string) => {
                        super.closeAllWindows({ onComplete: () => this.#createResultWindow(choice === WHITE) });
                    }
                );                           
            }
        });
    }

    changeToDrawPhase(): void {
        this.scene.changePhase(new DrawPhase(this.scene));
    }
}