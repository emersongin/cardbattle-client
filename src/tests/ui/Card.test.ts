import PhaserMock from "@mocks/phaser";
import CardBattleMock from "@mocks/cardset";
import { describe, it, expect, beforeAll } from "vitest";
import { Cardset } from "@ui/Cardset/Cardset";
import { BLUE, GREEN } from "@constants/colors";
import { ADD_COLOR_POINTS, BATTLE, POWER, NONE } from "@constants/keys";
import { CardType } from "@game/types/CardType";
import { VueScene } from "@game/scenes/VueScene";
import { CardColorType } from "@game/types/CardColorType";
import { BattleCard } from "@game/ui/Card/BattleCard";
import { PowerCard } from "@game/ui/Card/PowerCard";

describe("Card", () => {
    let sceneMock: VueScene;
    let cardsetMock: Cardset;

    beforeAll(() => {
        sceneMock = new PhaserMock.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as VueScene;
        cardsetMock = new CardBattleMock.Cardset(sceneMock, [], 0, 0);
    });

    it("Should create a Battle Card.", () => {
        const card = new BattleCard(sceneMock, {
            number: 1,
            id: 'ID',
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
        });
        expect(card).toBeDefined();
        expect(card.getId()).toBe('ID');
        expect(card.getNumber()).toBe(1);
        expect(card.getName()).toBe('Battle Card n° 2');
        expect(card.getDescription()).toBe('This is another battle card description.');
        expect(card.getColor()).toBe(GREEN);
        expect(card.getImage()).toBe('card-picture');
        expect(card.getType()).toBe(BATTLE);
        expect(card.getAp()).toBe(4);
        expect(card.getHp()).toBe(6);
        expect(card.isSelected()).toBe(false);
        expect(card.isMarked()).toBe(false);
        expect(card.isHighlighted()).toBe(false);
        expect(card.isBanned()).toBe(false);
        expect(card.isDisabled()).toBe(false);
        expect(card.getCost()).toBe(2);
    });

    it("Should create a Power Card.", () => {
        const card = new PowerCard(sceneMock, {
            id: 'ID',
            number: 1,
            name: 'Power Card n° 3',
            description: 'This is another power card description.',
            color: BLUE as CardColorType,
            image: 'card-picture',
            type: POWER as CardType,
            effectType: ADD_COLOR_POINTS,
            effectDescription: 'Gain 2 points of a color of your choice.',
            ap: 0,
            hp: 0,
            cost: 0,
        });
        expect(card).toBeDefined();
        expect(card.getId()).toBe('ID');
        expect(card.getNumber()).toBe(1);
        expect(card.getName()).toBe('Power Card n° 3');
        expect(card.getDescription()).toBe('This is another power card description.');
        expect(card.getColor()).toBe(BLUE);
        expect(card.getImage()).toBe('card-picture');
        expect(card.getType()).toBe(POWER);
        expect(card.getEffectType()).toBe(ADD_COLOR_POINTS);
        expect(card.getEffectDescription()).toBe('Gain 2 points of a color of your choice.');
        expect(card.isSelected()).toBe(false);
        expect(card.isMarked()).toBe(false);
        expect(card.isHighlighted()).toBe(false);
        expect(card.isBanned()).toBe(false);
        expect(card.isDisabled()).toBe(false);
    });
});
