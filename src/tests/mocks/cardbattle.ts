import { VueScene } from "@game/scenes/VueScene";
import { CardBattle } from "@game/api/CardBattle";

class CardBattleMock {
    constructor(readonly scene: VueScene) {}
}

export default CardBattleMock as unknown as CardBattle;
export { CardBattleMock };