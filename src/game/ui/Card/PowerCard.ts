import { P } from "@game/constants/keys";
import { Card } from "./Card";

export class PowerCard extends Card {

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