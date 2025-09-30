import PhaserMock from "@mocks/phaser";
import CardBattleMock from "@mocks/cardset";
import { describe, it, expect, beforeAll } from "vitest";
import { Cardset } from "@ui/Cardset/Cardset";
import { Card } from "@ui/Card/Card";
import { GREEN } from "@constants/colors";
import { CardColorsType } from "@/game/types/CardColorsType";
import { BATTLE } from "@constants/keys";
import { CardType } from "@game/types/CardType";
import { VueScene } from "@/game/scenes/VueScene";

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

    it("should create a BattleCard/PowerCard.", () => {
        const card = new Card(sceneMock, cardsetMock, {
            id: 'ID',
            number: 1,
            name: 'Battle Card n° 2',
            description: 'This is another battle card description.',
            details: 'This card is used for battle purposes.',
            color: GREEN as CardColorsType,
            imageName: 'card-picture',
            hp: 6,
            ap: 4,
            typeId: BATTLE as CardType,
            powerId: 'none',
            cost: 2,
            disabled: false
        });
        expect(card).toBeDefined();
        expect(card.getId()).toBe('ID');
        expect(card.getNumber()).toBe(1);
        expect(card.getName()).toBe('Battle Card n° 2');
        expect(card.getDescription()).toBe('This is another battle card description.');
        expect(card.getDetails()).toBe('This card is used for battle purposes.');
        expect(card.getColor()).toBe(GREEN);
        expect(card.getImageName()).toBe('card-picture');
        expect(card.getAp()).toBe(4);
        expect(card.getHp()).toBe(6);
        expect(card.getTypeId()).toBe(BATTLE);
        expect(card.getPowerId()).toBe('none');
        expect(card.getCost()).toBe(2);
        expect(card.isBattleCard()).toBe(true);
        expect(card.isSelected()).toBe(false);
        expect(card.isMarked()).toBe(false);
        expect(card.isHighlighted()).toBe(false);
        expect(card.isBanned()).toBe(false);
        expect(card.isDisabled()).toBe(false);
    });
});
