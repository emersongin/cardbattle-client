import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { LoadPhase } from "./LoadPhase";
import { CardBattlePhase } from "./CardBattlePhase";
import { PowerActionData } from "@/game/objects/PowerActionData";
import { TRASH } from "@/game/constants/keys";
import { CardActionsBuilder } from "@/game/ui/Card/CardActionsBuilder";

export class TriggerPhase extends CardBattlePhase implements Phase {

    constructor(
        scene: CardBattleScene, 
        readonly originPhase: LoadPhase
    ) {
        super(scene);
    }

    async create(): Promise<void> {
        this.#loadPowerCardUpdates();
    }

    async #loadPowerCardUpdates(): Promise<void> {
        await this.cardBattle.listenNextPowerCard(
            this.scene.room.playerId,
            (powerAction: PowerActionData, belongToPlayer: boolean) => {
                const powerCardId = powerAction.powerCard.id;
                const powerCard = this.originPhase.getFieldCardById(powerCardId);
                CardActionsBuilder.create(powerCard)
                    .expand()
                    .flash()
                    .shrink()
                    .play({
                        onComplete: () => {
                            CardActionsBuilder
                                .create(powerCard)
                                .shrink({ onComplete: async () => {
                                    await this.cardBattle.setPowerActionCompleted(this.scene.room.playerId, powerCardId);
                                    this.originPhase.removeFieldCardById(powerCardId);
                                    if (belongToPlayer) {
                                        this.originPhase.addBoardZonePoints(TRASH, 1);
                                    } else {
                                        this.originPhase.addOpponentBoardZonePoints(TRASH, 1);
                                    }
                                    this.#next();
                                }})
                                .play();
                        }
                    });
            }
        );
    }

    async #next(): Promise<void> {
        if (await this.cardBattle.hasPowerCardUpdates(this.scene.room.playerId)) {
            this.#loadPowerCardUpdates();
            return;
        }
        if (await this.cardBattle.hasPowerCardsInField()) {
            this.#createOpponentPowerActionUpdatesWaitingWindow();
            this.originPhase.openAllWindows({
                onComplete: async () => {
                    await this.cardBattle.listenOpponentPowerActionUpdates(
                        this.scene.room.playerId,
                        (isEnd: boolean) => {
                            if (isEnd) {
                                this.originPhase.closeAllWindows({ 
                                    onComplete: async () => {
                                        this.#end();
                                    }
                                });
                            }
                        }
                    );
                }
            });
            return;
        }
        this.#end();
    }

    #createOpponentPowerActionUpdatesWaitingWindow(): void {
        this.originPhase.createWaitingWindow('Waiting for opponent updates...');
    }

    #end(): void {
        if (this.originPhase instanceof LoadPhase) {
            this.changeToLoadPhase();
            return;
        }
        throw new Error("Origin phase not recognized.");
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
        this.scene.changePhase(this.originPhase, true);
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
        console.log("Trigger Phase destroyed.");
    }
}