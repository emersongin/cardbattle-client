import { Phase } from "@scenes/CardBattle/phase/Phase";
import { CardBattlePhase } from './CardBattlePhase';

export class BattlePhase extends CardBattlePhase implements Phase {
    
    create(): void {
        const onClose = async () => {
            await super.createGameBoard();
            await super.openGameBoard();
            await super.createTextWindowCentered('Card Battle', { 
                textAlign: 'center', 
                onClose: () => this.#startBattle()
            });
            super.openAllWindows();
        }
        super.createTextWindowCentered('Battle Phase', { textAlign: 'center', onClose });
        super.addTextWindow('Start Battle!');
        super.openAllWindows();
    }

    #startBattle(): void {
        
    }
}