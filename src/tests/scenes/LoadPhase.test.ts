import PhaserMock from "@mocks/phaser";
import { describe, it, beforeAll } from "vitest";
import { LoadPhase } from "@game/scenes/CardBattle/phase/LoadPhase";
import { CardBattleScene } from "@game/scenes/CardBattle/CardBattleScene";

describe("LoadPhase.test", () => {
    let sceneMock: CardBattleScene;

    beforeAll(() => {
        sceneMock = new PhaserMock.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as CardBattleScene;
    });

    it("should throw error: invalid card type.", () => {
        const phase = new LoadPhase(sceneMock);
    });

});
