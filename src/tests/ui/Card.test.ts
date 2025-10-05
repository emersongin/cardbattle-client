import PhaserMock from "@mocks/phaser";
import CardBattleMock from "@mocks/cardset";
import { describe, it, expect, beforeAll } from "vitest";
import { Cardset } from "@ui/Cardset/Cardset";
import { CardType } from "@game/types/CardType";
import { VueScene } from "@scenes/VueScene";
import { CardColorType } from "@game/types/CardColorType";
import { Card } from "@game/ui/Card/Card";
import { CardData } from "@game/objects/CardData";
import { BLUE } from "@game/constants/colors";
import { BATTLE, NONE } from "@game/constants/keys";

describe("Card.test", () => {
    let sceneMock: VueScene;
    let cardsetMock: Cardset;
    const cardData = {
        id: 'ID',
        number: 1,
        name: 'This is card name',
        description: 'This is card description.',
        color: BLUE as CardColorType,
        image: 'card-picture',
        type: BATTLE as CardType,
        ap: 0,
        hp: 0,
        cost: 0,
        effectType: NONE,
        effectDescription: 'none',
    } as CardData;

    beforeAll(() => {
        sceneMock = new PhaserMock.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as VueScene;
        cardsetMock = new CardBattleMock.Cardset(sceneMock, [], 0, 0);
    });

    it("should start the card data.", () => {
        const card = new Card(sceneMock, cardData);
        expect(card.getId()).toBe('ID');
        expect(card.getNumber()).toBe(1);
        expect(card.getName()).toBe('This is card name');
        expect(card.getDescription()).toBe('This is card description.');
        expect(card.getColor()).toBe(BLUE);
        expect(card.getImage()).toBe('card-picture');
        expect(card.getType()).toBe(BATTLE);
        expect(card.staticData).toEqual(cardData);
    });

    it("should start the card with these states.", () => {
        const card = new Card(sceneMock, cardData);
        expect(card.isFaceUp()).toBe(false);
        expect(card.isDisabled()).toBe(false);
        expect(card.isClosed()).toBe(false);
        expect(card.isSelected()).toBe(false);
        expect(card.isMarked()).toBe(false);
        expect(card.isHighlighted()).toBe(false);
        expect(card.isBanned()).toBe(false);
    });
});
