import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { LoadPhase } from "./LoadPhase";
import { CardBattlePhase } from "./CardBattlePhase";
import { PowerAction } from "@/game/types/PowerAction";

export class TriggerPhase extends CardBattlePhase implements Phase {

    constructor(
        scene: CardBattleScene, 
        readonly originPhase: LoadPhase
    ) {
        super(scene);
    }

    async create(): Promise<void> {
        await this.cardBattle.listenNextPowerCard(
            this.scene.room.playerId,
            (powerAction: PowerAction) => {
                const powerCardId = powerAction.powerCard.id;
                const powerCard = this.originPhase.getFieldCardById(powerCardId);
                powerCard.shrink({ onComplete: async () => {
                    await this.cardBattle.setPowerActionCompleted(this.scene.room.playerId, powerCardId);
                    this.originPhase.removeFieldCardById(powerCardId);
                    this.#next();
                }});
                console.log("Power action completed:", powerCardId);
            }
        );
    }

    async #next(): Promise<void> {
        if (await this.cardBattle.hasPowerCardUpdates(this.scene.room.playerId)) {
            this.create();
            return;
        }
        this.#end();
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