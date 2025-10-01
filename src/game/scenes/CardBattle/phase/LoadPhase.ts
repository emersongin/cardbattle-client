import { Phase } from "@scenes/CardBattle/phase/Phase";
import { SummonPhase } from "@scenes/CardBattle/phase/SummonPhase";
import { PowerPhase } from "./PowerPhase";
import { CardDataWithState } from "@/game/objects/CardDataWithState";
import { BATTLE, POWER } from "@/game/constants/keys";

export class LoadPhase extends PowerPhase implements Phase {

    createPhaseWindows(): void {
        const onClose = async () => {
            await super.createGameBoard();
            await super.createTextWindowCentered('Begin Load Phase', { 
                textAlign: 'center', 
                onClose: () => super.resumePhase()
            });
            await super.openGameBoard();
            super.openAllWindows();
        }
        super.createTextWindowCentered('Load Phase', { textAlign: 'center', onClose });
        super.addTextWindow('Select and use a Power Card');
    }

    async createHandZone(): Promise<void> {
        const cards: CardDataWithState[] = await this.cardBattle.getCardsFromHand(this.scene.room.playerId);
        const battleCards = cards.filter(card => card.type === BATTLE);
        const battleCardsDisabled = battleCards.map(card => ({ ...card, faceUp: true, disabled: true }));
        const powerCards = cards.filter(card => card.type === POWER);
        const powerCardsEnabled = powerCards.map(card => ({ ...card, faceUp: true, disabled: false }));
        super.createHandCardset([...powerCardsEnabled, ...battleCardsDisabled]);
    }

    changeTo(): void {
        this.changeToSummonPhase();
    }

    changeToSummonPhase(): void {
        this.closeBoard({ onComplete: () => this.scene.changePhase(new SummonPhase(this.scene)) });
        this.closeOpponentBoard();
    }

}
