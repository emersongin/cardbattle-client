import { BLUE } from "@game/constants/colors";
import { BATTLE, NONE, POWER } from "@game/constants/keys";
import { CardData } from "@game/objects/CardData";
import { VueScene } from "@game/scenes/VueScene";
import { CardColorType } from "@game/types/CardColorType";
import { CardType } from "@game/types/CardType";
import { CardFactory } from "@game/ui/Card/CardFactory";
import PhaserMock from "../mocks/phaser";
import { beforeAll, describe, expect, it } from "vitest";
import { BattleCard } from "@game/ui/Card/BattleCard";
import { PowerCard } from "@game/ui/Card/PowerCard";

describe("CardFactory.test", () => {
    let sceneMock: VueScene;

    beforeAll(() => {
        sceneMock = new PhaserMock.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as VueScene;
    });

    it("Should create a Battle Card with these data.", () => {
        const battleCardData = {
            id: 'B1',
            number: 1,
            name: 'Battle Card n° 1',
            description: 'This is a battle card description.',
            color: BLUE as CardColorType,
            image: 'card-picture',
            type: BATTLE as CardType,
            ap: 5,
            hp: 5,
            cost: 2,
            effectType: NONE,
            effectDescription: 'none',
        } as CardData;
        const battleCard = CardFactory.createByType(sceneMock, battleCardData) as BattleCard;
        expect(battleCard instanceof BattleCard).toBe(true);
        expect(battleCard.getAp()).toBe(5);
        expect(battleCard.getHp()).toBe(5);
        expect(battleCard.getCost()).toBe(2);
    });

    it("Should create a Power Card with these data.", () => {
        const battleCardData = {
            id: 'B1',
            number: 1,
            name: 'Battle Card n° 1',
            description: 'This is a battle card description.',
            color: BLUE as CardColorType,
            image: 'card-picture',
            type: POWER as CardType,
            ap: 0,
            hp: 0,
            cost: 0,
            effectType: NONE,
            effectDescription: 'none',
        } as CardData;
        const powerCard = CardFactory.createByType(sceneMock, battleCardData) as PowerCard;
        expect(powerCard instanceof PowerCard).toBe(true);
        expect(powerCard.getEffectType()).toBe(NONE);
        expect(powerCard.getEffectDescription()).toBe('none');
    });
});
