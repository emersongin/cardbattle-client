import { CardData } from "@game/objects/CardData";
import { VueScene } from "@game/scenes/VueScene";
import { P, POWER } from "@game/constants/keys";
import { Card } from "@ui/Card/Card";

export class PowerCard extends Card {

    constructor(
        readonly scene: VueScene,
        readonly staticData: CardData,
        isStartFaceUp: boolean = false,
        isStartDisabled: boolean = false
    ) {
        super(scene, staticData, isStartFaceUp, isStartDisabled);
        if (this.staticData.type !== POWER) {
            throw new Error("invalid card type!");
        }
    }

    getEffectDescription(): string {
        return this.staticData.effectDescription;
    }

    getEffectType(): string {
        return this.staticData.effectType;
    }

    setDisplay(): void {
        super.setDisplay(P);
    }

}