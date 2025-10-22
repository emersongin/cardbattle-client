import { Phase } from "@scenes/CardBattle/phase/Phase";
import { SummonPhase } from "@scenes/CardBattle/phase/SummonPhase";
import { PowerPhase } from "./PowerPhase";
import { Card } from "@game/ui/Card/Card";
import { BattleCard } from "@game/ui/Card/BattleCard";
import { PowerCard } from "@game/ui/Card/PowerCard";

export class LoadPhase extends PowerPhase implements Phase {

    createPhaseWindows(): void {
        const onClose = async () => {
            await super.createGameBoard();
            await super.createTextWindowCentered('Begin Load Phase', { 
                textAlign: 'center', 
                onClose: () => {
                    super.resumePhase()}
            });
            await super.openGameBoard();
            super.openAllWindows();
        }
        super.createTextWindowCentered('Load Phase', { textAlign: 'center', onClose });
        super.addTextWindow('Select and use a Power Card');
    }

    async createHandZone(): Promise<void> {
        const cards: Card[] = await this.cardBattle.getCardsFromHand(this.scene.getPlayerId());
        const battleCards = cards.filter(card => card instanceof BattleCard) as BattleCard[];
        battleCards.forEach(card => {
            card.faceUp();
            card.disable();
        });
        const powerCards = cards.filter(card => card instanceof PowerCard) as PowerCard[];
        powerCards.forEach(card => {
            card.faceUp();
            card.enable();
        });
        super.createHandCardset([...powerCards, ...battleCards]);
    }

    changeTo(): void {
        this.scene.changePhase(new SummonPhase(this.scene))
    }

}
