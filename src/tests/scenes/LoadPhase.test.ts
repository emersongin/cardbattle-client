import PhaserMock, { cardBattleMock } from "@mocks/phaser";
import { describe, it, beforeAll, beforeEach, expect, vi } from "vitest";
import { LoadPhase } from "@game/scenes/CardBattle/phase/LoadPhase";
import { CardBattleScene } from "@game/scenes/CardBattle/CardBattleScene";
import { RoomData } from "@game/objects/RoomData";
import { WHITE } from "@game/constants/colors";

function getKeyboard(scene: Phaser.Scene): Phaser.Input.Keyboard.KeyboardPlugin {
    const keyboard = scene.input.keyboard;
    if (!keyboard) {
        throw new Error("Keyboard input is not available in the scene.");
    }
    return keyboard;
}

describe("LoadPhase.test", () => {
    let sceneMock: CardBattleScene;
    let cardBattle: cardBattleMock;

    beforeAll(() => {
        sceneMock = new PhaserMock.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as CardBattleScene;
        cardBattle = new cardBattleMock();
        sceneMock.setCardBattle(cardBattle);
    });

    beforeEach(() => {
        // CREATE ROOM
        const room = cardBattle.createRoom();
        const { roomId, playerId } = room;
        // CHALLENGE PHASE
        const { playerId: opponentId }: RoomData = cardBattle.joinRoom(roomId);
        // START PHASE
        cardBattle.setFolder(playerId, 'f3');
        // DRAW PHASE
        cardBattle.setMiniGameChoice(playerId, WHITE);
        // LOAD PHASE
        cardBattle.setReadyDrawCards(opponentId);
        cardBattle.setReadyDrawCards(playerId);
    });

    it("should throw error: invalid card type.", () => {
        sceneMock.changePhase(new LoadPhase(sceneMock));
        const keyboard = getKeyboard(sceneMock);
        keyboard.emit('keydown-ENTER');
        keyboard.emit('keydown-ENTER');
        keyboard.emit('keydown-DOWN');
        keyboard.emit('keydown-ENTER');
        vi.mocked(cardBattle.listenOpponentPlay).mockReturnValue({ pass: true, powerAction: null });
        expect(sceneMock.isPhase('SummonPhase')).toBe(true);
    });

});
