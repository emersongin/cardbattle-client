import { describe, it, beforeAll, beforeEach, expect, vi } from "vitest";
import PhaserMock from "@mocks/phaser";
import CardBattleMock from "@mocks/cardbattle";
import { LoadPhase } from "@game/scenes/CardBattle/phase/LoadPhase";
import { CardBattleScene } from "@game/scenes/CardBattle/CardBattleScene";

function getKeyboard(scene: Phaser.Scene): Phaser.Input.Keyboard.KeyboardPlugin {
    const keyboard = scene.input.keyboard;
    if (!keyboard) {
        throw new Error("Keyboard input is not available in the scene.");
    }
    return keyboard;
}

describe("LoadPhase.test", () => {
    let sceneMock: CardBattleScene;
    let cardBattleMock: CardBattleMock;

    beforeAll(() => {
        sceneMock = new PhaserMock.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as CardBattleScene;
        cardBattleMock = new CardBattleMock();
        sceneMock.setCardBattle(cardBattleMock);
    });

    beforeEach(() => {

    });

    it("should throw error: invalid card type.", () => {
        sceneMock.changePhase(new LoadPhase(sceneMock));
        const keyboard = getKeyboard(sceneMock);
        keyboard.emit('keydown-ENTER');
        keyboard.emit('keydown-ENTER');
        keyboard.emit('keydown-DOWN');
        keyboard.emit('keydown-ENTER');
        vi.mocked(cardBattleMock.listenOpponentPlay).mockReturnValue({ pass: true, powerAction: null });
        expect(sceneMock.isPhase('SummonPhase')).toBe(true);
    });

});
