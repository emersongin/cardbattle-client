import PhaserMock from "@mocks/phaser";
import { describe, it, expect, beforeAll } from "vitest";
import { CardType } from "@game/types/CardType";
import { VueScene } from "@scenes/VueScene";
import { CardColorType } from "@game/types/CardColorType";
import { CardData } from "@game/objects/CardData";
import { BLUE } from "@game/constants/colors";
import { ADD_COLOR_POINTS, BATTLE, POWER } from "@game/constants/keys";
import { PowerCard } from "@game/ui/Card/PowerCard";

describe("PowerCard.test", () => {
    let sceneMock: VueScene;
    const powerCardData = {
        id: 'ID',
        number: 1,
        name: 'This is card name',
        description: 'This is card description.',
        color: BLUE as CardColorType,
        image: 'card-picture',
        type: POWER as CardType,
        ap: 0,
        hp: 0,
        cost: 0,
        effectType: ADD_COLOR_POINTS,
        effectDescription: 'This is effect description.',
    } as CardData;

    beforeAll(() => {
        sceneMock = new PhaserMock.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as VueScene;
    });

    it("should throw error: invalid card type.", () => {
        const battleCardData = { ...powerCardData,
            type: BATTLE as CardType,
        } as CardData;
        expect(() => new PowerCard(sceneMock, battleCardData)).toThrowError("invalid card type!");
    });

    it("Power cards should have this data.", () => {
        const card = new PowerCard(sceneMock, powerCardData);
        expect(card.getEffectType()).toBe(ADD_COLOR_POINTS);
        expect(card.getEffectDescription()).toBe('This is effect description.');
    });
});
