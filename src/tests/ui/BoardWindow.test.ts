import PhaserMock from "@mocks/phaser";
import { describe, it, beforeAll } from "vitest";
import { VueScene } from "@scenes/VueScene";
import { BoardWindow } from "@game/ui/BoardWindow/BoardWindow";
import { AP, DECK, HAND, HP, PASS, TRASH, WINS } from "@game/constants/keys";
import { BLACK, BLUE, GREEN, RED, WHITE } from "@game/constants/colors";

describe("BoardWindow.test", () => {
    let sceneMock: VueScene;

    beforeAll(() => {
        sceneMock = new PhaserMock.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as VueScene;
    });

    it("should throw error: invalid card type.", () => {
        const boardWindow = BoardWindow.createBottom(
            sceneMock,
            {
                [AP]: 0,
                [HP]: 0,
                [RED]: 0,
                [GREEN]: 0,
                [BLUE]: 0,
                [BLACK]: 0,
                [WHITE]: 0,
                [HAND]: 0,
                [DECK]: 0,
                [TRASH]: 0,
                [WINS]: 0,
                [PASS]: false
            },
            0xffffff
        );
    });

});
