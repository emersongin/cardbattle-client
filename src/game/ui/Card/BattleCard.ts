import { CardData } from "@game/objects/CardData";
import { VueScene } from "@game/scenes/VueScene";
import { AP, BATTLE, HP } from "@constants/keys";
import { BattlePoints } from "@game/objects/BattlePoints";
import { Card } from "@ui/Card/Card";

export class BattleCard extends Card {

    constructor(
        readonly scene: VueScene,
        readonly staticData: CardData,
        isStartFaceUp: boolean = false,
        isStartDisabled: boolean = false
    ) {
        super(scene, staticData, isStartFaceUp, isStartDisabled);
        if (this.staticData.type !== BATTLE) {
            throw new Error("invalid card type!");
        }
    }

    setStartData(): void {
        super.setStartData();
        this.setAp(this.staticData.ap);
        this.setHp(this.staticData.hp);
    }

    getAllData(): BattlePoints {
        return { 
            [AP]: this.getData(AP), 
            [HP]: this.getData(HP),
        };
    }

    getAp(): number {
        return this.getData(AP);
    }

    getHp(): number {
        return this.getData(HP);
    }

    getCost(): number {
        return this.staticData.cost;
    }

    setDisplay(): void {
        this.setDisplayPoints(this.getAp(), this.getHp());
    }

    setDisplayPoints(ap: number = 0, hp: number = 0): void {
        const apText = ap.toString().padStart(2, "0"); 
        const hpText = hp.toString().padStart(2, "0");
        super.setDisplay(`${apText}/${hpText}`);
    }

    setAp(ap: number): void {
        this.setData(AP, ap);
    }

    setHp(hp: number): void {
        this.setData(HP, hp);
    }

}