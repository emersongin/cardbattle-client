import { CardData } from "@/game/objects/CardData";
import { VueScene } from "@/game/scenes/VueScene";
import { Card } from "./Card";
import { BATTLE, POWER } from "@/game/constants/keys";
import { PowerCard } from "./PowerCard";
import { BattleCard } from "./BattleCard";

export class CardFactory {

    static createByType(card: CardData, scene: VueScene): Card {
        if (card.type === POWER) {
            return new PowerCard(scene, card);
        }
        if (card.type === BATTLE) {
            return new BattleCard(scene, card);
        }
        throw new Error('Card type not recognized');
    }

}