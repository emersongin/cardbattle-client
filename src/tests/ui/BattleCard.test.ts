import PhaserMock from "@mocks/phaser";
import { describe, it, expect, beforeAll } from "vitest";
import { CardType } from "@game/types/CardType";
import { VueScene } from "@scenes/VueScene";
import { CardColorType } from "@game/types/CardColorType";
import { CardData } from "@game/objects/CardData";
import { BLUE } from "@game/constants/colors";
import { BATTLE, NONE, POWER } from "@game/constants/keys";
import { BattleCard } from "@game/ui/Card/BattleCard";

describe("BattleCard.test", () => {
    let sceneMock: VueScene;
    const battleCardData = {
        id: 'ID',
        number: 1,
        name: 'This is card name',
        description: 'This is card description.',
        color: BLUE as CardColorType,
        image: 'card-picture',
        type: BATTLE as CardType,
        ap: 10,
        hp: 10,
        cost: 10,
        effectType: NONE,
        effectDescription: 'none.',
    } as CardData;

    beforeAll(() => {
        sceneMock = new PhaserMock.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as VueScene;
    });

    it("should throw error: invalid card type.", () => {
        const powerCardData = { ...battleCardData,
            type: POWER as CardType,
        } as CardData;
        expect(() => new BattleCard(sceneMock, powerCardData)).toThrowError("invalid card type!");
    });

    it("Battle cards should have this data.", () => {
        const card = new BattleCard(sceneMock, battleCardData);
        expect(card.getAp()).toBe(10);
        expect(card.getHp()).toBe(10);
        expect(card.getCost()).toBe(10);
    });
});
