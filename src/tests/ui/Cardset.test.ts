import Phaser from "@mocks/phaser";
import { describe, beforeAll, beforeEach, afterEach, it, expect } from "vitest";
import { VueScene } from "@scenes/VueScene";
import { Cardset } from "@game/ui/Cardset/Cardset";
import { CardColorType } from "@game/types/CardColorType";
import { CardType } from "@game/types/CardType";
import { RED } from "@game/constants/colors";
import { BATTLE, NONE } from "@game/constants/keys";
import { CardFactory } from "@game/ui/Card/CardFactory";
import { Card } from "@game/ui/Card/Card";
import { CardData } from "@game/objects/CardData";

const cardData = [
    {
        id: 'B1',
        number: 1,
        name: 'Battle Card n° 1',
        description: 'This is a battle card description.',
        color: RED as CardColorType,
        image: 'card-picture',
        type: BATTLE as CardType,
        ap: 5,
        hp: 5,
        cost: 2,
        effectType: NONE,
        effectDescription: 'none',
    }
] as CardData[];

// const eventsMock = {
//     onChangeIndex: vi.fn(),
//     onMarked: vi.fn(),
//     onComplete: vi.fn(),
//     onLeave: vi.fn(),
// };
// const colorPointsMock: ColorsPointsData = {
//     [RED]: 3,
//     [BLUE]: 3,
//     [GREEN]: 0,
//     [BLACK]: 0,
//     [WHITE]: 0,
//     [ORANGE]: 0
// };

// function duplicate(cards: CardData[], number: number) {
//     const duplicatedCards: CardData[] = [];
//     for (let i = 0; i < number; i++) {
//         duplicatedCards.push(...cards);
//     }
//     return duplicatedCards;
// }

// function getKeyboard(scene: Phaser.Scene): Phaser.Input.Keyboard.KeyboardPlugin {
//     const keyboard = scene.input.keyboard;
//     if (!keyboard) {
//         throw new Error("Keyboard input is not available in the scene.");
//     }
//     return keyboard;
// }

describe("Cardset.test", () => {
    let scene: VueScene;
    // let cardset: Cardset;

    beforeAll(() => {
        scene = new Phaser.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as VueScene;
    });

    beforeEach(() => {
        // const cardsData: CardData[] = duplicate(cardsDummy, 3);
        // const cards = cardsData.map(card => CardFactory.createByType(scene, card));
        // cardset = new Cardset(scene, cards);
    });

    afterEach(() => {
        // const keyboard = getKeyboard(scene);
        // keyboard.removeAllListeners();
    });

    it("should create a cardset with cards.", () => {
        const cards = cardData.map(card => CardFactory.createByType(scene, card)) as Card[];
        const cardset = new Cardset(scene, cards);
        expect(cardset.getCards().length).toBe(cards.length);
    });
});
