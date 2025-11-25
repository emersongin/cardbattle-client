import { WHITE, BLACK } from "@constants/colors";
import { Phase } from "@scenes/CardBattle/phase/Phase";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { DrawPhase } from "@scenes/CardBattle/phase/DrawPhase";
import { ArrayUtil } from "@utils/ArrayUtil";
import { CardBattleScene } from "../CardBattleScene";

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
                    () => super.closeAllWindows({ 
                        onComplete: () => this.#loadStartPhase() 
                    })
                );
            }
        });
    }

    async #loadStartPhase(): Promise<void> {
        if (await this.cardBattle.isPlayMiniGame(this.scene.getPlayerId())) {
            this.#createPhaseWindows();
            super.openAllWindows({
                onComplete: () => {
                    this.#addKeyEnterOnOpenPhaseWindowsToMiniGame();
                    super.publishEvent('onOpenPhaseWindows');
                }
            });
            return;
        }
        this.#createPhaseWindows();
        super.openAllWindows({
            onComplete: () => {
                this.#addKeyEnterOnOpenPhaseWindowsToWaitingOppoenent();
                super.publishEvent('onOpenPhaseWindows');
            }
        });
    }

    #createPhaseWindows(): void {
        super.createTextWindowCentered('Start Phase', { textAlign: 'center' });
        super.addTextWindow('Draw white card to go first.');
    }

    #addKeyEnterOnOpenPhaseWindowsToMiniGame(): void {
        this.scene.addKeyEnterListeningOnce({
            onTrigger: () => 
                super.closeAllWindows({ 
                    onComplete: () => {
                        this.#createMiniGameCommandWindow();
                        super.openCommandWindow({
                            onComplete: () => {
                                super.startCommandWindowSelection();
                                super.publishEvent('onOpenCommandWindow');
                            }
                        });
                    }
                })
        });
    }

    #addKeyEnterOnOpenPhaseWindowsToWaitingOppoenent(): void {
        this.scene.addKeyEnterListeningOnce({ 
            onTrigger:  () => {
                super.closeAllWindows({ 
                    onComplete: () => this.#createOpponentWaitingWindow() 
                });
            }
        });
    }

    #createOpponentWaitingWindow(): void {
        super.createWaitingWindow('Waiting for opponent to finish the mini-game...');
        super.openAllWindows({
            onComplete: async () => {
                setTimeout(async () => {
                    super.closeAllWindows({ 
                        onComplete: () => console.log('Opponent finished mini-game.')
                    });
                }, 1000);
                // await this.cardBattle.listenOpponentEndMiniGame(
                //     this.scene.getPlayerId(),
                //     (choice: string) => {
                //         super.closeAllWindows({ 
                //             onComplete: () => this.#createResultWindow(choice)
                //         });
                        
                //     }
                // );                           
            }
        });
    }

    #createMiniGameCommandWindow(): void {
        const options = [
            {
                description: 'option: Draw white card',
                onSelect: async () => {
                    await this.cardBattle.setMiniGameChoice(this.scene.getPlayerId(), WHITE);
                    this.#createResultWindow(WHITE);
                },
                disabled: false,
            },
            {
                description: 'option: Draw black card',
                onSelect: async () => {
                    await this.cardBattle.setMiniGameChoice(this.scene.getPlayerId(), BLACK);
                    this.#createResultWindow(BLACK);
                },
                disabled: false,
            },
        ];
        ArrayUtil.shuffle(options);
        super.createCommandWindowCentered('Select a card', options);
    }

    #createResultWindow(choice: string): void {
        const resultMessage = choice === WHITE ? 'You go first!' : 'Opponent goes first!';
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

    changeToDrawPhase(): void {
        this.scene.changePhase(new DrawPhase(this.scene));
    }
}