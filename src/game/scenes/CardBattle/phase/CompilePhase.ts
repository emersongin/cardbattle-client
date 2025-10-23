import { Phase } from "@scenes/CardBattle/phase/Phase";
import { PowerPhase } from "./PowerPhase";
import { BattlePhase } from "./BattlePhase";
import { Card } from "@game/ui/Card/Card";
import { PowerCard } from "@game/ui/Card/PowerCard";
import { BattleCard } from "@game/ui/Card/BattleCard";

export class CompilePhase extends PowerPhase implements Phase {

    createPhaseWindows(): void {
        super.createTextWindowCentered('Compile Phase', { textAlign: 'center' });
        super.addTextWindow('Select and use a Power Card');
    }

    createBeginPhaseWindows(): void {
        super.createTextWindowCentered('Begin Compile Phase', { textAlign: 'center' });
    }

    async createHandZone(): Promise<void> {
        const cards: Card[] = await this.cardBattle.getCardsFromHand(this.scene.getPlayerId());
        const battleCards = cards.filter(card => card instanceof BattleCard);
        battleCards.forEach(card => {
            card.faceUp();
            card.disable();
        });
        const powerCards = cards.filter(card => card instanceof PowerCard);
        powerCards.forEach(card => {
            card.faceUp();
            card.enable();
        });
        super.createHandCardset([...powerCards, ...battleCards]);
    }

    changeTo(): void {
        this.scene.changePhase(new BattlePhase(this.scene));
    }

}
