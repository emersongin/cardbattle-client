import { AP, HP } from "@constants/keys";
import { BattlePoints } from "@game/objects/BattlePoints";
import { Card } from "@ui/Card/Card";

export class BattleCard extends Card {

    setStartData(): void {
        super.setStartData();
        this.setAp(this.staticData.ap);
        this.setHp(this.staticData.hp);
    }

    getAllData(): BattlePoints {
        return { 
            [AP]: this.data.get(AP), 
            [HP]: this.data.get(HP),
        };
    }

    getAp(): number {
        return this.data.get(AP);
    }

    getHp(): number {
        return this.data.get(HP);
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
        this.data.set(AP, ap);
    }

    setHp(hp: number): void {
        this.data.set(HP, hp);
    }

}