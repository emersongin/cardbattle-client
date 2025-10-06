import PhaserMock from "@mocks/phaser";
import CardBattleMock from "@mocks/cardset";
import { describe, it, expect, beforeAll, vi } from "vitest";
import { Cardset } from "@ui/Cardset/Cardset";
import { VueScene } from "@scenes/VueScene";
import { CardActionsBuilder } from "@game/ui/Card/CardActionsBuilder";
import { CardColorType } from "@game/types/CardColorType";
import { BLUE } from "@game/constants/colors";
import { BATTLE, NONE } from "@game/constants/keys";
import { CardType } from "@game/types/CardType";
import { CardData } from "@game/objects/CardData";
import { BattleCard } from "@game/ui/Card/BattleCard";
import { ScaleAnimation } from "@game/ui/Card/animations/ScaleAnimation";

describe("CardActionsBuilder.test", () => {
    let sceneMock: VueScene;
    let cardsetMock: Cardset;
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
        cardsetMock = new CardBattleMock.Cardset(sceneMock, [], 0, 0);
    });

    it("should close the card.", () => {
        const card = new BattleCard(sceneMock, battleCardData);
        const builder = CardActionsBuilder.create(card);
        const closeCardMock = () => card.setClosed();
        sceneMock.tweens.add = vi.fn().mockImplementationOnce(closeCardMock);
        builder
            .close({ delay: 0, duration: 0 })
            .play();
        expect(card.isClosed()).toBe(true);
    });
});
