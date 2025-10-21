import { BLACK, BLUE, GREEN, ORANGE, RED, WHITE } from "../constants/colors";
import { ADD_COLOR_POINTS, BATTLE, POWER } from "../constants/keys";
import { CardData } from "../objects/CardData";
import { CardColorType } from "../types/CardColorType";
import { CardType } from "../types/CardType";
import { MathUtil } from "../utils/MathUtil";

const battleCardsMock = [
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
        cost: 0,
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
        cost: 0,
    },
    {
        id: 'B3',
        number: 3,
        name: 'Battle Card n° 3',
        description: 'This is yet another battle card description.',
        color: BLUE as CardColorType,
        image: 'card-picture',
        type: BATTLE as CardType,
        hp: 4,
        ap: 6,
        cost: 0,
    },
    {
        id: 'B4',
        number: 4,
        name: 'Battle Card n° 4',
        description: 'This is a different battle card description.',
        color: BLACK as CardColorType,
        image: 'card-picture',
        type: BATTLE as CardType,
        hp: 7,
        ap: 3,
        cost: 0,
    },
    {
        id: 'B5',
        number: 5,
        name: 'Battle Card n° 5',
        description: 'This is a unique battle card description.',
        color: WHITE as CardColorType,
        image: 'card-picture',
        type: BATTLE as CardType,
        hp: 3,
        ap: 7,
        cost: 0,
    },
    {
        id: 'B6',
        number: 6,
        name: 'Battle Card n° 6',
        description: 'This is a special battle card description.',
        color: ORANGE as CardColorType,
        image: 'card-picture',
        type: BATTLE as CardType,
        ap: 2,
        hp: 8,
        cost: 0,
    }
];

const powerCardsMock = [
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
    },
    {
        id: 'P3',
        number: 9,
        name: 'Add Color Points Power Card n° 3',
        description: 'This is yet another test power card description.',
        color: BLUE as CardColorType,
        image: 'card-picture',
        type: POWER as CardType,
        effectType: ADD_COLOR_POINTS,
        effectDescription: 'This card is used for testing power effects.',
    },
    {
        id: 'P4',
        number: 10,
        name: 'Add Color Points Power Card n° 4',
        description: 'This is a different test power card description.',
        color: BLACK as CardColorType,
        image: 'card-picture',
        type: POWER as CardType,
        effectType: ADD_COLOR_POINTS,
        effectDescription: 'This card is used for testing power effects.',
    },
    {
        id: 'P5',
        number: 11,
        name: 'Add Color Points Power Card n° 5',
        description: 'This is a unique test power card description.',
        color: WHITE as CardColorType,
        image: 'card-picture',
        type: POWER as CardType,
        effectType: ADD_COLOR_POINTS,
        effectDescription: 'This card is used for testing power effects.',
    },
    {
        id: 'P6',
        number: 12,
        name: 'Add Color Points Power Card n° 6',
        description: 'This is a special test power card description.',
        color: ORANGE as CardColorType,
        image: 'card-picture',
        type: POWER as CardType,
        effectType: ADD_COLOR_POINTS,
        effectDescription: 'This card is used for testing power effects.',
    }
];

const cardsMock = [
    ...battleCardsMock, 
    ...powerCardsMock
] as CardData[];
const redDeck = createDeck(cardsMock, 40);
const greenDeck = createDeck(cardsMock, 40);
const blueDeck = createDeck(cardsMock, 40);

function createDeck(cards: CardData[], number: number) {
    const deck: CardData[] = [];
    for (let i = 0; i < number; i++) {
        const randomIndex = Math.floor(Math.random() * cards.length);
        const clone = { ...cards[randomIndex] };
        const randomNumber = MathUtil.randomInt(1, 1000);
        const cardId = `${clone.id}-${randomNumber}`;
        clone.id = cardId;
        deck.push(clone);
    }
    return deck;
}

const folders = [
    {
        id: 'f1',
        deck: redDeck
    },
    {
        id: 'f2',
        deck: greenDeck
    },
    {
        id: 'f3',
        deck: blueDeck
    }
] as { id: string; deck: CardData[] }[];

export { folders, redDeck, greenDeck, blueDeck };