import { Phase } from "@scenes/CardBattle/phase/Phase";
import { SummonPhase } from "@scenes/CardBattle/phase/SummonPhase";
import { TriggerPhase } from "@scenes/CardBattle/phase/TriggerPhase";
import { PowerPhase } from "./PowerPhase";
import { CardData } from "@/game/objects/CardData";
import { HAND } from "@/game/constants/keys";
import { PowerCardPlayData } from "@/game/objects/PowerCardPlayData";
import { TweenConfig } from "@/game/types/TweenConfig";

export class LoadPhase extends PowerPhase implements Phase {

    createPhaseWindows(): void {
        super.createTextWindowCentered('Load Phase', {
            textAlign: 'center',
            onClose: () => super.loadPhase()
        });
        super.addTextWindow('Select and use a Power Card');
    }

    async createGameBoard(): Promise<void> {
        const board = await this.cardBattle.getBoard(this.scene.room.playerId);
        const opponentBoard = await this.cardBattle.getOpponentBoard(this.scene.room.playerId);
        const powerCards: CardData[] = await this.cardBattle.getFieldPowerCards();
        super.createOpponentBoard(opponentBoard);
        super.createBoard(board);
        super.createFieldCardset({ cards: powerCards });
    }

    openGameBoard(config?: TweenConfig): void {
        this.scene.timeline({
            targets: [
                (t?: TweenConfig) => super.openOpponentBoard(t),
                (t?: TweenConfig) => super.openBoard(t),
                (t?: TweenConfig) => super.openFieldCardset({ faceUp: true, ...t })
            ],
            onAllComplete: () => {
                if (config?.onComplete) config.onComplete();
            },
        });
    }

    async nextPlay(): Promise<void> {
        if (await this.cardBattle.isPowerfieldLimitReached()) {
            this.changeToTriggerPhase();
            return;
        }
        if (await this.cardBattle.allPass()) {
            if (await this.cardBattle.hasPowerCardsInField()) {
                this.changeToTriggerPhase();
                return;
            }
            this.changeToSummonPhase();
            return;
        }
        if (await this.cardBattle.isOpponentPassed(this.scene.room.playerId)) {
            this.goPlay();
            return;
        }
        this.#createOpponentPlayingWaitingWindow();
        super.openAllWindows({
            onComplete: async () => {
                await this.cardBattle.listenOpponentPlay(
                    this.scene.room.playerId, 
                    (opponentPlay: PowerCardPlayData) => this.#loadOpponentPlay(
                            opponentPlay.pass, 
                            opponentPlay.powerAction?.powerCard
                        )
                );
            }
        });
    }

    async #loadOpponentPlay(pass: boolean, powerCard?: CardData): Promise<void> {
        super.closeAllWindows({ onComplete: async () => {
            super.addOpponentBoardPass();
            if (pass) {
                this.nextPlay();
                return;
            }
            if (!await this.cardBattle.isPowerfieldLimitReached()) {
                await super.resetPlay();
            }
            if (!pass && powerCard) {
                this.playPowerCard(powerCard, () => {
                    this.removeOpponentBoardZonePoints(HAND, 1);
                    this.loadPlayAndMovePowerCardToField();
                });
            }
        }})
    }

    #createOpponentPlayingWaitingWindow(): void {
        super.createWaitingWindow('Waiting for opponent to play...');
    }

    changeToChallengePhase(): void {
        throw new Error("Method not implemented.");
    }
    
    changeToStartPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToDrawPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToLoadPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToTriggerPhase(): void {
        this.scene.changePhase(new TriggerPhase(this.scene, this));
    }

    changeToSummonPhase(): void {
        this.closeBoard({ onComplete: () => this.scene.changePhase(new SummonPhase(this.scene)) });
        this.closeOpponentBoard();
    }

    changeToCompilePhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToBattlePhase(): void {
        throw new Error("Method not implemented.");
    }
    
    destroy(): void {
        super.destroyAllTextWindows();
    }
}
