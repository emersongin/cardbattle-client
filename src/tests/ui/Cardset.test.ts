import { describe, it, expect, beforeAll } from "vitest";
import { CardColors } from "@ui/CardColors";
import { CardType } from "@ui/CardType";
import Phaser from "@mocks/phaser";
import { CardData } from "@ui/CardData";
import { Cardset } from "@ui/Cardset/Cardset";
import { ColorsPoints } from "@ui/ColorsPoints";

const CARD_WIDTH = 100;
const CARD_HEIGHT = 150;

describe("MockScene", () => {
    let scene: Phaser.Scene;

    beforeAll(() => {
        scene = new Phaser.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        });
    });

    it("deve criar uma cena mock com tweens", () => {
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
                cost: 2
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
        const cardsData: CardData[] = duplicate(cards, 4);
        const dimensions = { 
            x: 0, 
            y: 0, 
            width: (CARD_WIDTH * 6), 
            height: CARD_HEIGHT 
        };
        const cardset = new Cardset(scene, dimensions, cardsData);
        const events = {
            onChangeIndex: (cardIndex: number) => {
                if (!cardset.isValidIndex(cardIndex)) return;
                // console.log(cardset.getCardByIndex(cardIndex).getName());
            },
            onMarked: (cardIndex: number) => {
                if (!cardset.isValidIndex(cardIndex)) return;
                // console.log(cardset.getCardByIndex(cardIndex).getName());
            },
            onCompleted: (_cardIndexes: number[]) => {
                // console.log('Selected card indexes:', cardIndexes);
            },
            onLeave: () => {
                // console.log('Cardset left');
            },
        };
        const colorPoints: ColorsPoints = {
            red: cardsData.filter(card => card.color === 'red').length,
            blue: cardsData.filter(card => card.color === 'blue').length,
            green: 0,
            black: 0,
            white: 0,
            orange: 0
        };
        cardset.selectMode(events, colorPoints);
        expect(cardset).toBeDefined();
    });
});

function duplicate(cards: CardData[], number: number) {
    const duplicatedCards: CardData[] = [];
    for (let i = 0; i < number; i++) {
        duplicatedCards.push(...cards);
    }
    return duplicatedCards;
}
