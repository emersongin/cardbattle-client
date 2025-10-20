import PhaserMock from "@mocks/phaser";
import { describe, it, beforeAll } from "vitest";
import { VueScene } from "@scenes/VueScene";

describe("PowerPhase.test", () => {
    let sceneMock: VueScene;

    beforeAll(() => {
        sceneMock = new PhaserMock.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as VueScene;

    });

    it("should throw error: invalid card type.", () => {

    });

});
