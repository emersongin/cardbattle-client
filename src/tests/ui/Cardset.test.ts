import Phaser from "@mocks/phaser";
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from "vitest";
import { Cardset } from "@ui/Cardset/Cardset";
import { ColorsPoints } from "@game/types/ColorsPoints";
import { VueScene } from "@game/scenes/VueScene";
import { BLACK, BLUE, GREEN, ORANGE, RED, WHITE } from "@game/constants/colors";
import { CardColors } from "@/game/types/CardColors";
import { CardType } from "@/game/types/CardType";
import { BATTLE, POWER } from "@game/constants/keys";
import { CardData } from "@/game/types/CardData";

const cards = [
    {
        id: '123e4567-e89b-12d3-a456-426614174000',
        number: 1,
        name: 'Test Card',
        description: 'This is a test card description.',
        details: 'This is a test card details.',
        color: BLUE as CardColors,
        imageName: 'card-picture',
        hp: 10,
        ap: 5,
        typeId: BATTLE as CardType,
        powerId: 'none',
        cost: 1
    },
    {
        id: '123e4567-e89b-12d3-a456-426614174444',
        number: 1,
        name: 'Test Power Card',
        description: 'This is a test power card description.',
        details: 'This is a test power card details.',
        color: RED as CardColors,
        imageName: 'card-picture',
        hp: 0,
        ap: 0,
        typeId: POWER as CardType,
        powerId: 'power-1',
        cost: 1
    },
];
const eventsMock = {
    onChangeIndex: vi.fn(),
    onMarked: vi.fn(),
    onComplete: vi.fn(),
    onLeave: vi.fn(),
};
const colorPoints: ColorsPoints = {
    [RED]: 3,
    [BLUE]: 3,
    [GREEN]: 0,
    [BLACK]: 0,
    [WHITE]: 0,
    [ORANGE]: 0
};

function duplicate(cards: CardData[], number: number) {
    const duplicatedCards: CardData[] = [];
    for (let i = 0; i < number; i++) {
        duplicatedCards.push(...cards);
    }
    return duplicatedCards;
}

function getKeyboard(scene: Phaser.Scene): Phaser.Input.Keyboard.KeyboardPlugin {
    const keyboard = scene.input.keyboard;
    if (!keyboard) {
        throw new Error("Keyboard input is not available in the scene.");
    }
    return keyboard;
}

describe("MockScene", () => {
    let scene: VueScene;
    let cardset: Cardset;

    beforeAll(() => {
        scene = new Phaser.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as VueScene;
    });

    beforeEach(() => {
        const cardsData: CardData[] = duplicate(cards, 3);
        cardset = new Cardset(scene, cardsData);
    });

    afterEach(() => {
        const keyboard = getKeyboard(scene);
        keyboard.removeAllListeners();
    });

    it("Deve criar um conjunto de cartões estático.", () => {
        expect(cardset).toBeDefined();
        expect(cardset.getCards().length).toBe(6);
        expect(cardset.isSelectModeDisabled()).toBe(true);
    });

    it("Deve criar um conjunto de cartões em modo seleção única.", () => {
        cardset.selectModeOne(eventsMock);
        expect(cardset).toBeDefined();
        expect(cardset.isSelectModeEnabled()).toBe(true);
    });

    it("Deve criar um conjunto de cartões em modo seleção multipla com gerênciamento de pontos de cores.", () => {
        cardset.selectModeMany(eventsMock, colorPoints);
        expect(cardset).toBeDefined();
        expect(cardset.isSelectModeEnabled()).toBe(true);
    });

    it("Deve mover o indice do cursor ao pressionar as teclas para esquerda ou direita respeitando os limites em modo seleção.", () => {
        let indexTest = 0;
        const events = {
            onChangeIndex: (cardIndex: number) => {
                indexTest = cardIndex;
            },
            onMarked: vi.fn(),
            onComplete: vi.fn(),
            onLeave: vi.fn(),
        };
        const keyboard = getKeyboard(scene);
        cardset.selectModeOne(events);
        expect(indexTest).toBe(0);
        keyboard.emit('keydown-RIGHT', 3);
        expect(indexTest).toBe(3);
        keyboard.emit('keydown-RIGHT', 20);
        expect(indexTest).toBe(5);
        keyboard.emit('keydown-LEFT', 20);
        expect(indexTest).toBe(0);
    });

    it("Deve marcar apenas dois cartões e finalizar seleção.", () => {
        let markedCards: number[] = [];
        const events = {
            onChangeIndex: vi.fn(),
            onMarked: vi.fn(),
            onComplete: (cardIndexes: number[]) => {
                markedCards = cardIndexes;
            },
            onLeave: vi.fn(),
        };
        const keyboard = getKeyboard(scene);
        cardset.selectModeMany(events, colorPoints);
        keyboard.emit('keydown-RIGHT', 2);
        keyboard.emit('keydown-ENTER');
        keyboard.emit('keydown-RIGHT', 3);
        keyboard.emit('keydown-ENTER');
        keyboard.emit('keydown-ESC');
        expect(markedCards).toEqual([2, 5]);
    });

    it("Deve restaurar o estado de seleção do conjunto de cartões e retornar a ultima seleção.", () => {
        let markedCards: number[] = [];
        const events = {
            onChangeIndex: vi.fn(),
            onMarked: vi.fn(),
            onComplete: (cardIndexes: number[]) => {
                markedCards = cardIndexes;
                // cardset.#highlightSelectedCards();
                cardset.restoreSelectMode();
            },
            onLeave: vi.fn(),
        };
        const keyboard = getKeyboard(scene);
        cardset.selectModeMany(events, colorPoints);
        keyboard.emit('keydown-ENTER');
        keyboard.emit('keydown-ESC');
        expect(markedCards.length).toBe(1);
        const selectIndexes = cardset.getSelectIndexes();
        expect(selectIndexes.length).toBe(0);
    });
});
