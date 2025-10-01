import { Phase } from "@scenes/CardBattle/phase/Phase";
import { PowerPhase } from "./PowerPhase";
import { BattlePhase } from "./BattlePhase";
import { CardDataWithState } from "@/game/objects/CardDataWithState";
import { BATTLE, POWER } from "@/game/constants/keys";

export class CompilePhase extends PowerPhase implements Phase {

    createPhaseWindows(): void {
        const onClose = async () => {
            await super.createGameBoard();
            await super.openGameBoard();
            await super.createTextWindowCentered('Begin Compile Phase', { 
                textAlign: 'center', 
                onClose: () => super.resumePhase()
            });
            super.openAllWindows();
        }
        super.createTextWindowCentered('Compile Phase', { textAlign: 'center', onClose });
        super.addTextWindow('Select and use a Power Card');
    }

    async createHandZone(): Promise<void> {
        const cards: CardDataWithState[] = await this.cardBattle.getCardsFromHand(this.scene.room.playerId);
        const battleCards = cards.filter(card => card.typeId === BATTLE);
        const battleCardsDisabled = battleCards.map(card => ({ ...card, faceUp: true, disabled: true }));
        const powerCards = cards.filter(card => card.typeId === POWER);
        const powerCardsEnabled = powerCards.map(card => ({ ...card, faceUp: true, disabled: false }));
        super.createHandCardset([...powerCardsEnabled, ...battleCardsDisabled]);
    }

    changeTo(): void {
        this.changeToBattlePhase();
    }

    changeToBattlePhase(): void {
        super.closeBoard({ onComplete: () => this.scene.changePhase(new BattlePhase(this.scene)) });
        super.closeOpponentBoard();
    }

}
