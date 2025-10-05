import PhaserMock from "@mocks/phaser";
import CardBattleMock from "@mocks/cardset";
import { describe, it, expect, beforeAll } from "vitest";
import { Cardset } from "@ui/Cardset/Cardset";
import { BLUE, GREEN } from "@constants/colors";
import { ADD_COLOR_POINTS, BATTLE, POWER, NONE } from "@constants/keys";
import { CardType } from "@game/types/CardType";
import { VueScene } from "@scenes/VueScene";
import { CardColorType } from "@game/types/CardColorType";
import { BattleCard } from "@ui/Card/BattleCard";
import { PowerCard } from "@ui/Card/PowerCard";

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
});
