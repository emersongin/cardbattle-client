import { describe, it, expect, beforeAll, vi } from "vitest";
import Phaser from "@mocks/phaser";
import { CardData } from "@ui/CardData";
import { Cardset } from "@ui/Cardset/Cardset";
import { CardColors, CardType, CARD_WIDTH, CARD_HEIGHT } from "@ui/Card/Card";
import { ColorsPoints } from "@/game/ui/ColorsPoints";

const cards = [
    {
        UUID: '123e4567-e89b-12d3-a456-426614174000',
        number: 1,
        name: 'Test Card',
        description: 'This is a test card description.',
        color: 'blue' as CardColors,
        imageName: 'card-picture',
        hp: 10,
        ap: 5,
        typeId: 'battle' as CardType,
        powerId: 'none',
        cost: 1
    },
    {
        UUID: '123e4567-e89b-12d3-a456-426614174444',
        number: 1,
        name: 'Test Power Card',
        description: 'This is a test power card description.',
        color: 'red' as CardColors,
        imageName: 'card-picture',
        hp: 0,
        ap: 0,
        typeId: 'power' as CardType,
        powerId: 'power-1',
        cost: 1
    },
];
const dimensions = { 
    x: 0, 
    y: 0, 
    width: (CARD_WIDTH * 6), 
    height: CARD_HEIGHT 
};
const eventsMock = {
    onChangeIndex: vi.fn(),
    onMarked: vi.fn(),
    onCompleted: vi.fn(),
    onLeave: vi.fn(),
};
const colorPoints: ColorsPoints = {
    red: 3,
    blue: 3,
    green: 0,
    black: 0,
    white: 0,
    orange: 0
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
    let scene: Phaser.Scene;
    let cardset: Cardset;

    beforeAll(() => {
        scene = new Phaser.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        });
        const cardsData: CardData[] = duplicate(cards, 3);
        cardset = new Cardset(scene, dimensions, cardsData);
    });

    // it("Deve criar um conjunto de cartas e seu estado ser em modo estático.", () => {
    //     expect(cardset).toBeDefined();
    //     expect(cardset.getCards().length).toBe(6);
    //     expect(cardset.isStaticMode()).toBe(true);
    // });

    // it("Deve criar um conjunto de cartas e seu estado ser em modo selecação.", () => {
    //     cardset.selectMode(eventsMock);
    //     expect(cardset).toBeDefined();
    //     expect(cardset.isSelectMode()).toBe(true);
    // });

    // it("Deve criar um conjunto de cartas e seu estado ser em modo selecação com pontos de cores.", () => {
    //     cardset.selectMode(eventsMock, colorPoints);
    //     expect(cardset).toBeDefined();
    //     expect(cardset.isSelectMode()).toBe(true);
    // });

    // it("Deve mover o index do cursor ao pressionar as teclas para esquerda ou direita respeitando os limites.", () => {
    //     let indexTest = 0;
    //     const events = {
    //         onChangeIndex: (cardIndex: number) => {
    //             indexTest = cardIndex;
    //         },
    //         onMarked: vi.fn(),
    //         onCompleted: vi.fn(),
    //         onLeave: vi.fn(),
    //     };
    //     const keyboard = getKeyboard(scene);
    //     cardset.selectMode(events);
    //     expect(indexTest).toBe(0);
    //     keyboard.emit('keydown-RIGHT', 3);
    //     expect(indexTest).toBe(3);
    //     keyboard.emit('keydown-RIGHT', 20);
    //     expect(indexTest).toBe(5);
    //     keyboard.emit('keydown-LEFT', 20);
    //     expect(indexTest).toBe(0);
    // });

    // it("Deve marcar o 2 e 5 cartão ao selecionar eles nos respectivos indices.", () => {
    //     let markedCards: number[] = [];
    //     const events = {
    //         onChangeIndex: vi.fn(),
    //         onMarked: vi.fn(),
    //         onCompleted: (cardIndexes: number[]) => {
    //             markedCards = cardIndexes;
    //         },
    //         onLeave: vi.fn(),
    //     };
    //     const keyboard = getKeyboard(scene);
    //     cardset.selectMode(events, colorPoints, 2);
    //     keyboard.emit('keydown-RIGHT', 2);
    //     keyboard.emit('keydown-ENTER');
    //     keyboard.emit('keydown-RIGHT', 3);
    //     keyboard.emit('keydown-ENTER');
    //     expect(markedCards).toEqual([2, 5]);
    // });

    it("Deve restaurar o estado de seleção do conjunto de cartões e retornar a ultima seleção.", () => {
        let markedCards: number[] = [];
        const events = {
            onChangeIndex: vi.fn(),
            onMarked: vi.fn(),
            onCompleted: (cardIndexes: number[]) => {
                markedCards = cardIndexes;
                // cardset.#highlightSelectedCards();
                cardset.restoreSelectState();
            },
            onLeave: vi.fn(),
        };
        const keyboard = getKeyboard(scene);
        cardset.selectMode(events, colorPoints, 2);
        keyboard.emit('keydown-ENTER');
        keyboard.emit('keydown-RIGHT');
        keyboard.emit('keydown-ENTER');
        expect(markedCards.length).toBe(2);
        const selectIndexes = cardset.getSelectIndexes();
        expect(selectIndexes.length).toBe(1);
    });
});
