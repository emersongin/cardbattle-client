import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { LoadPhase } from "./LoadPhase";
import { CompilePhase } from "./CompilePhase";
import { SummonPhase } from "./SummonPhase";

export class TriggerPhase implements Phase {
    #powerActions: any[] = [];
    #origimPhase: string;

    constructor(readonly scene: CardBattleScene, actions: any[], origimPhase: string) {
        this.#powerActions = actions;
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
        const noTextWindow = true;
        this.scene.changePhase(new LoadPhase(this.scene, this.#powerActions, noTextWindow));
    }

    changeToTriggerPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToSummonPhase(): void {
        this.scene.changePhase(new SummonPhase(this.scene));
    }

    changeToCompilePhase(): void {
        const noTextWindow = true;
        this.scene.changePhase(new CompilePhase(this.scene, this.#powerActions, noTextWindow));
    }

    changeToBattlePhase(): void {
        throw new Error("Method not implemented.");
    }

    create(): void {
        console.log("Trigger Phase started!");
    }

    update(): void {
        if (this.#powerActions.length) {
            const action = this.#powerActions.shift();
            console.log("Executing action:", action);
            return;
        }
        switch (this.#origimPhase) {
            case 'LOAD':
                this.changeToLoadPhase();
                break;
            case 'COMPILE':
                this.changeToCompilePhase();
                break;
            default:
                console.error("Unknown original phase:", this.#origimPhase);
                break;
        }
    }

    destroy(): void {
        console.log("Trigger Phase destroyed.");
    }

}