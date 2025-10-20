import Phaser from "@mocks/phaser";
import { describe, beforeAll, beforeEach, afterEach, it, expect } from "vitest";
import { VueScene } from "@scenes/VueScene";
import { Cardset } from "@game/ui/Cardset/Cardset";
import { CardColorType } from "@game/types/CardColorType";
import { CardType } from "@game/types/CardType";
import { GREEN, RED } from "@game/constants/colors";
import { ADD_COLOR_POINTS, BATTLE, NONE, POWER } from "@game/constants/keys";
import { CardFactory } from "@game/ui/Card/CardFactory";
import { Card } from "@game/ui/Card/Card";
import { CardData } from "@game/objects/CardData";
import { CARD_WIDTH } from "@game/constants/default";

const cardDataMock = [
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
    },
    {
        id: 'B2',
        number: 2,
        name: 'Battle Card n° 2',
        description: 'This is another battle card description.',
        color: GREEN as CardColorType,
        image: 'card-picture',
        type: BATTLE as CardType,
        ap: 4,
        hp: 6,
        cost: 2,
        effectType: NONE,
        effectDescription: 'none',
    },
    {
        id: 'P1',
        number: 7,
        name: 'Add Color Points Power Card n° 1',
        description: 'This is a test power card description.',
        color: RED as CardColorType,
        image: 'card-picture',
        type: POWER as CardType,
        effectType: ADD_COLOR_POINTS,
        effectDescription: 'This card is used for testing power effects.',
        ap: 0,
        hp: 0,
        cost: 0,
    },
    {
        id: 'P2',
        number: 8,
        name: 'Add Color Points Power Card n° 2',
        description: 'This is another test power card description.',
        color: GREEN as CardColorType,
        image: 'card-picture',
        type: POWER as CardType,
        effectType: ADD_COLOR_POINTS,
        effectDescription: 'This card is used for testing power effects.',
        ap: 0,
        hp: 0,
        cost: 0,
    },
] as CardData[];

function getKeyboard(scene: Phaser.Scene): Phaser.Input.Keyboard.KeyboardPlugin {
    const keyboard = scene.input.keyboard;
    if (!keyboard) {
        throw new Error("Keyboard input is not available in the scene.");
    }
    return keyboard;
}

describe("Cardset.test", () => {
    let scene: VueScene;
    let cardsetMock: Cardset;

    beforeAll(() => {
        scene = new Phaser.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as VueScene;
    });

    beforeEach(() => {
        const cards = cardDataMock.map(card => CardFactory.createByType(scene, card)) as Card[];
        cardsetMock = Cardset.create(scene, cards);
    });

    afterEach(() => {
        const keyboard = getKeyboard(scene);
        keyboard.removeAllListeners();
    });

    it("should create a cardset with cards.", () => {
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
            },
        ] as CardData[];
        const cards = cardData.map(card => CardFactory.createByType(scene, card)) as Card[];
        const cardset = Cardset.create(scene, cards);
        expect(cardset.getCards().length).toBe(cards.length);
    });

    it("should enable select mode one and select one card.", () => {
        let cardId: string = '';
        const eventsMock = {
            onComplete: (cardIds: string[]) => {
                cardId = cardIds[0];
            }
        };
        cardsetMock.selectModeOne(eventsMock);
        expect(cardsetMock.isSelectModeEnabled()).toBe(true);
        const keyboard = getKeyboard(scene);
        keyboard.emit('keydown-ENTER');
        expect(cardId).toBe(cardDataMock[0].id);
    });

    it("should enable select mode many and select all cards.", () => {
        let card1Id: string = '';
        let card2Id: string = '';
        let card3Id: string = '';
        let card4Id: string = '';
        const eventsMock = {
            onComplete: (cardIds: string[]) => {
                card1Id = cardIds[0];
                card2Id = cardIds[1];
                card3Id = cardIds[2];
                card4Id = cardIds[3];
            }
        };
        cardsetMock.selectModeMany(eventsMock);
        expect(cardsetMock.isSelectModeEnabled()).toBe(true);
        const keyboard = getKeyboard(scene);
        keyboard.emit('keydown-ENTER');
        keyboard.emit('keydown-RIGHT');
        keyboard.emit('keydown-RIGHT');
        keyboard.emit('keydown-ENTER');
        keyboard.emit('keydown-LEFT');
        keyboard.emit('keydown-ENTER');
        keyboard.emit('keydown-RIGHT');
        keyboard.emit('keydown-RIGHT');
        keyboard.emit('keydown-ENTER');
        expect(card1Id).toBe(cardDataMock[0].id);
        expect(card2Id).toBe(cardDataMock[2].id);
        expect(card3Id).toBe(cardDataMock[1].id);
        expect(card4Id).toBe(cardDataMock[3].id);
    });

    it("should enable select mode many and select two cards and finish on press buttom SHIFT.", () => {
        let card1Id: string = '';
        let card2Id: string = '';
        const eventsMock = {
            onComplete: (cardIds: string[]) => {
                card1Id = cardIds[0];
                card2Id = cardIds[1];
            }
        };
        cardsetMock.selectModeMany(eventsMock);
        expect(cardsetMock.isSelectModeEnabled()).toBe(true);
        const keyboard = getKeyboard(scene);
        keyboard.emit('keydown-ENTER');
        keyboard.emit('keydown-RIGHT');
        keyboard.emit('keydown-RIGHT');
        keyboard.emit('keydown-RIGHT');
        keyboard.emit('keydown-ENTER');
        keyboard.emit('keydown-SHIFT');
        expect(card1Id).toBe(cardDataMock[0].id);
        expect(card2Id).toBe(cardDataMock[3].id);
    });

    it("should restore select mode at the last index position.", () => {
        const eventsMock = {
            onComplete: (_cardIds: string[]) => {}
        };
        cardsetMock.selectModeMany(eventsMock);
        expect(cardsetMock.isSelectModeEnabled()).toBe(true);
        const keyboard = getKeyboard(scene);
        keyboard.emit('keydown-ENTER');
        keyboard.emit('keydown-SHIFT');
        cardsetMock.restoreSelectMode();
        expect(cardsetMock.isSelectModeEnabled()).toBe(true);
    });

    it("should mark card with the player's marking.", () => {
        // cardsetMock.markCardWithPlayerById('P1');
        // expect(cardsetMock.isCardMarkedAsPlayerById('P1')).toBe(true);
    });

    it("should aling card at the position.", () => {
        const cards = cardsetMock.getCards();
        cards.forEach((card: Card) => {
            cardsetMock.setCardAtThePosition(cards.indexOf(card), 100, 100);
        });
        cards.forEach((card: Card) => {
            expect(card.getX()).toBe(100);
            expect(card.getY()).toBe(100);
        });
    });

    it("should aling card in line.", () => {
        const cards = cardsetMock.getCards();
        const numCards = cards.length;
        let padding = Math.max(0, Math.abs(cardsetMock.width / numCards));
        if (padding > CARD_WIDTH) padding = CARD_WIDTH;
        cardsetMock.setCardsInLinePosition(0, 0);
        cards.forEach((card: Card, index: number) => {
            expect(card.getX()).toBe(0 + (padding * index));
            expect(card.getY()).toBe(0);
        });
    });

    it("should get cards on slice deck by interval.", () => {
        const cards = cardsetMock.getCardsBySlice(1, 2);
        expect(cards.length).toBe(2);
        expect(() => cardsetMock.getCardsBySlice(-2, 2)).toThrowError(`Cardset: index ${-2} or ${2} is out of bounds.`);
        expect(() => cardsetMock.getCardsBySlice(0, 100)).toThrowError(`Cardset: index ${0} or ${100} is out of bounds.`);
        expect(() => cardsetMock.getCardsBySlice(2, 0)).toThrowError(`Cardset: start index ${2} cannot be greater than end index ${0}.`);
    });

    it("should get all cards", () => {
        const cards = cardsetMock.getCards();
        expect(cards.length).toBe(cardDataMock.length);
    });

    it("should get total cards number.", () => {
        const cards = cardsetMock.getCardsTotal();
        expect(cards).toBe(cardDataMock.length);
    });

    it("should get all ui cards", () => {
        const cards = cardsetMock.getCardsUi();
        expect(cards.length).toBe(cardDataMock.length);
    });

    it("should get card by index", () => {
        const cards = cardsetMock.getCardByIndex(0);
        expect(cards.getId()).toBe(cardDataMock[0].id);
        expect(() => cardsetMock.getCardByIndex(-1)).toThrowError(`Cardset: index ${-1} is out of bounds.`);
        expect(() => cardsetMock.getCardByIndex(100)).toThrowError(`Cardset: index ${100} is out of bounds.`);
    });

    it("should throw last index of the cards.", () => {
        const cards = cardsetMock.getCards();
        const lastIndex = cardsetMock.getCardsLastIndex();
        expect(lastIndex).toBe(cards.length - 1);
    });

    it("should get card by id", () => {
        const cards = cardsetMock.getCardById('P1');
        expect(cards.getId()).toBe('P1');
        const noCard = cardsetMock.getCardById('unknown');
        expect(noCard).toBeUndefined();
    });

    it("should disable card by id.", () => {
        const card = cardsetMock.getCardById('P1');
        expect(card.isDisabled()).toBe(false);
        cardsetMock.disableCardById('P1');
        expect(card.isDisabled()).toBe(true);
    });

    it("should enable card by id.", () => {
        const card = cardsetMock.getCardById('P1');
        cardsetMock.disableCardById('P1');
        expect(card.isDisabled()).toBe(true);
        cardsetMock.enableCardById('P1');
        expect(card.isDisabled()).toBe(false);
    });

    it("should select card by id.", () => {
        const card = cardsetMock.getCardById('P1');
        expect(card.isSelected()).toBe(false);
        cardsetMock.selectCardById('P1');
        expect(card.isSelected()).toBe(true);
    });

    it("should ban card by id.", () => {
        const card = cardsetMock.getCardById('P1');
        expect(card.isBanned()).toBe(false);
        cardsetMock.banCardById('P1');
        expect(card.isBanned()).toBe(true);
    });

    it("should mark card by id.", () => {
        const card = cardsetMock.getCardById('P1');
        expect(card.isMarked()).toBe(false);
        cardsetMock.markCardById('P1');
        expect(card.isMarked()).toBe(true);
    });

    it("should remove all selections card by id.", () => {
        const card = cardsetMock.getCardById('P1');
        cardsetMock.selectCardById('P1');
        cardsetMock.banCardById('P1');
        cardsetMock.removeAllSelectCardById('P1');
        expect(card.isSelected()).toBe(false);
    });

    it("should highlight cards by indexes.", () => {
        const cards = cardsetMock.getCards();
        cards.forEach(card => {
            expect(card.isHighlighted()).toBe(false);
        });
        const cardIds = cards.map(card => card.getId());
        cardIds.forEach(cardId => cardsetMock.highlightCardsById(cardId));
        cards.forEach(card => {
            expect(card.isHighlighted()).toBe(true);
        });
    });

    it("should remove all selections.", () => {
        const cards = cardsetMock.getCards();
        cards.forEach(card => {
            cardsetMock.selectCardById(card.getId());
            cardsetMock.banCardById(card.getId());
            cardsetMock.markCardById(card.getId());
            cardsetMock.highlightCardsById(card.getId());
        });
        cardsetMock.removeAllSelect();
        cards.forEach(card => {
            expect(card.isSelected()).toBe(false);
            expect(card.isBanned()).toBe(false);
            expect(card.isMarked()).toBe(false);
            expect(card.isHighlighted()).toBe(false);
        });
    });

    it("should show all cards.", () => {
        const cards = cardsetMock.getCards();
        cards.forEach(card => card.setClosed());
        cardsetMock.showCards();
        cards.forEach(card => {
            expect(card.isOpened()).toBe(true);
        });
    });
});
