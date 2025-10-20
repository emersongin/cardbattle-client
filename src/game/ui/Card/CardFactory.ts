import { CardData } from "@game/objects/CardData";
import { VueScene } from "@game/scenes/VueScene";
import { Card } from "@ui/Card/Card";
import { BATTLE, POWER } from "@game/constants/keys";
import { PowerCard } from "@ui/Card/PowerCard";
import { BattleCard } from "@ui/Card/BattleCard";

export class CardFactory {

    static createByType(scene: VueScene, card: CardData): Card {
        if (card.type === POWER) {
            return new PowerCard(scene, card);
        }
        if (card.type === BATTLE) {
            return new BattleCard(scene, card);
        }
        throw new Error('Card type not recognized');
    }

}