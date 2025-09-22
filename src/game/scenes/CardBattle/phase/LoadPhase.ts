import { Phase } from "@scenes/CardBattle/phase/Phase";
import { SummonPhase } from "@scenes/CardBattle/phase/SummonPhase";
import { TriggerPhase } from "@scenes/CardBattle/phase/TriggerPhase";
import { PowerPhase } from "./PowerPhase";
import { CardData } from "@/game/objects/CardData";
import { HAND } from "@/game/constants/keys";
import { PowerCardPlayData } from "@/game/objects/PowerCardPlayData";

export class LoadPhase extends PowerPhase implements Phase {

    createPhase(): void {
        super.createTextWindowCentered('Load Phase', {
            textAlign: 'center',
            onClose: () => 
                super.openGameBoard({
                    onComplete: () => {
                        super.createTextWindowCentered('Begin Load Phase', { 
                            textAlign: 'center', 
                            onClose: () => super.start()
                        });
                        super.openAllWindows();
                    }
                })
        });
        super.addTextWindow('Select and use a Power Card');
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
        super.createOpponentPlayingWaitingWindow();
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
