import PhaserMock from "@mocks/phaser";
import { describe, it, expect, beforeAll } from "vitest";
import { CardType } from "@game/types/CardType";
import { VueScene } from "@scenes/VueScene";
import { CardColorType } from "@game/types/CardColorType";
import { Card } from "@game/ui/Card/Card";
import { CardData } from "@game/objects/CardData";
import { BLUE } from "@game/constants/colors";
import { BATTLE, NONE } from "@game/constants/keys";
import { CardUi } from "@game/ui/Card/CardUi";

describe("Card.test", () => {
    let sceneMock: VueScene;
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
        expect(card.getX()).toBe(0);
        expect(card.getY()).toBe(0);
        expect(card.getOriginX()).toBe(0);
        expect(card.getOriginY()).toBe(0);
        expect(card.getUi()).toBeInstanceOf(CardUi);
        expect(card.getWidth()).toBe(card.getUi().width);
        expect(card.getHeight()).toBe(card.getUi().height);
        expect(card.getScaleX()).toBe(1);
        expect(card.getScaleY()).toBe(1);
    });

    it("should start the card with these states.", () => {
        const card = new Card(sceneMock, cardData);
        expect(card.isOpened()).toBe(true);
        expect(card.isEnabled()).toBe(true);
        expect(card.isFaceDown()).toBe(true);
        expect(card.isSelected()).toBe(false);
        expect(card.isMarked()).toBe(false);
        expect(card.isHighlighted()).toBe(false);
        expect(card.isBanned()).toBe(false);
    });

    it("should flip the card face up.", () => {
        const card = new Card(sceneMock, cardData);
        card.faceUp();
        expect(card.isFaceUp()).toBe(true);
    });

    it("should disable the card.", () => {
        const card = new Card(sceneMock, cardData);
        card.disable();
        expect(card.isDisabled()).toBe(true);
    });

    it("should set position and update origin of the card.", () => {
        const card = new Card(sceneMock, cardData);
        expect(card.getX()).toBe(0);
        expect(card.getY()).toBe(0);
        expect(card.getOriginX()).toBe(0);
        expect(card.getOriginY()).toBe(0);
        card.setPosition(100, 200);
        expect(card.getX()).toBe(100);
        expect(card.getY()).toBe(200);
        expect(card.getOriginX()).toBe(100);
        expect(card.getOriginY()).toBe(200);
    });

    it("should set the card as closed.", () => {
        const card = new Card(sceneMock, cardData);
        const x = card.getOriginX() + (card.getWidth() / 2);
        card.setClosed();
        expect(card.getX()).toBe(x);
        expect(card.isClosed()).toBe(true);
        expect(card.getScaleX()).toBe(0);
    });

    it("should set the card as opened.", () => {
        const card = new Card(sceneMock, cardData);
        const originX = card.getOriginX();
        card.setClosed();
        card.setOpened();
        expect(card.getX()).toBe(originX);
        expect(card.isOpened()).toBe(true);
        expect(card.getScaleX()).toBe(1);
    });

    it("should set the card as disabled.", () => {
        const card = new Card(sceneMock, cardData);
        card.disable();
        expect(card.isDisabled()).toBe(true);
        expect(card.isDisabledLayerVisible()).toBe(true);
    });

    it("should set the card as enabled.", () => {
        const card = new Card(sceneMock, cardData);
        card.disable();
        card.enable();
        expect(card.isEnabled()).toBe(true);
        expect(card.isDisabledLayerVisible()).toBe(false);
    });

    it("should select the card.", () => {
        const card = new Card(sceneMock, cardData);
        card.select();
        expect(card.isSelected()).toBe(true);
        expect(card.getSelectedLayerColor()).toBe(0xffff00);
        expect(card.isSelectedLayerVisible()).toBe(true);
    });

    it("should deselect the card.", () => {
        const card = new Card(sceneMock, cardData);
        card.select();
        card.deselect();
        expect(card.isSelected()).toBe(false);
        expect(card.isSelectedLayerVisible()).toBe(false);
    });

    it("should ban the card.", () => {
        const card = new Card(sceneMock, cardData);
        card.ban();
        expect(card.isBanned()).toBe(true);
        expect(card.getSelectedLayerColor()).toBe(0xff0000);
        expect(card.isSelectedLayerVisible()).toBe(true);
    });

    it("should unban the card.", () => {
        const card = new Card(sceneMock, cardData);
        card.ban();
        card.unban();
        expect(card.isBanned()).toBe(false);
        expect(card.isSelectedLayerVisible()).toBe(false);
    });

    it("should mark the card.", () => {
        const card = new Card(sceneMock, cardData);
        card.mark();
        expect(card.isMarked()).toBe(true);
        expect(card.getSelectedLayerColor()).toBe(0x00ff00);
        expect(card.isSelectedLayerVisible()).toBe(true);
    });

    it("should unmark the card.", () => {
        const card = new Card(sceneMock, cardData);
        card.mark();
        card.unmark();
        expect(card.isMarked()).toBe(false);
        expect(card.isSelectedLayerVisible()).toBe(false);
    });

    it("should highlight the card.", () => {
        const card = new Card(sceneMock, cardData);
        card.highlight();
        expect(card.isHighlighted()).toBe(true);
        expect(card.getSelectedLayerColor()).toBe(0xff00ff);
        expect(card.isSelectedLayerVisible()).toBe(true);
    });

    it("should unhighlight the card.", () => {
        const card = new Card(sceneMock, cardData);
        card.highlight();
        card.unhighlight();
        expect(card.isHighlighted()).toBe(false);
        expect(card.isSelectedLayerVisible()).toBe(false);
    });

});
