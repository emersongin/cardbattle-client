import { Phase } from "@scenes/CardBattle/phase/Phase";
import { TriggerPhase } from "@scenes/CardBattle/phase/TriggerPhase";
import { PowerPhase } from "./PowerPhase";
import { CardData } from "@/game/objects/CardData";
import { HAND } from "@/game/constants/keys";
import { PowerCardPlayData } from "@/game/objects/PowerCardPlayData";
import { BattlePhase } from "./BattlePhase";

export class CompilePhase extends PowerPhase implements Phase {

    createPhase(): void {
        super.createTextWindowCentered('Compile Phase', {
            textAlign: 'center',
            onClose: () => 
                super.openGameBoard({
                    onComplete: () => {
                        super.createTextWindowCentered('Begin Compile Phase', { 
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
            this.changeToBattlePhase();
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
        throw new Error("Method not implemented.");
    }

    changeToCompilePhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToBattlePhase(): void {
        super.closeBoard({ onComplete: () => this.scene.changePhase(new BattlePhase(this.scene)) });
        super.closeOpponentBoard();
    }
    
    destroy(): void {
        super.destroyAllTextWindows();
    }
}
