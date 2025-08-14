import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { LoadPhase } from "./LoadPhase";
// import { CompilePhase } from "./CompilePhase";
import { SummonPhase } from "./SummonPhase";
import { COMPILE_PHASE, LOAD_PHASE } from "@/game/constants/keys";

export class TriggerPhase implements Phase {
    #origimPhase: string;

    constructor(readonly scene: CardBattleScene, origimPhase: string) {
        this.#origimPhase = origimPhase;
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
        const startPhase = false;
        this.scene.changePhase(new LoadPhase(this.scene, startPhase));
    }

    changeToTriggerPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToSummonPhase(): void {
        this.scene.changePhase(new SummonPhase(this.scene));
    }

    changeToCompilePhase(): void {
        // const startPhase = false;
        // this.scene.changePhase(new CompilePhase(this.scene, startPhase));
    }

    changeToBattlePhase(): void {
        throw new Error("Method not implemented.");
    }

    create(): void {
        console.log("Trigger Phase started!");
    }

    // update(): void {
    //     // if (this.#powerActions.length) {
    //     //     const action = this.#powerActions.shift();
    //     //     console.log("Executing action:", action);
    //     //     return;
    //     // }
    //     switch (this.#origimPhase) {
    //         case LOAD_PHASE:
    //             this.changeToLoadPhase();
    //             break;
    //         case COMPILE_PHASE:
    //             this.changeToCompilePhase();
    //             break;
    //         default:
    //             console.error("Unknown original phase:", this.#origimPhase);
    //             break;
    //     }
    // }

    destroy(): void {
        console.log("Trigger Phase destroyed.");
    }

}