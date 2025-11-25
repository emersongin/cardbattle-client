import { describe, beforeAll, beforeEach, expect, vi, test } from "vitest";
import PhaserMock from "@mocks/phaser";
import CardBattleMemory from "@game/api/CardBattleMemory";
import { CardBattleScene } from "@game/scenes/CardBattle/CardBattleScene";
import { CardBattle } from "@game/api/CardBattle";
import { StartPhase } from "@game/scenes/CardBattle/phase/StartPhase";

function getKeyboard(scene: Phaser.Scene): Phaser.Input.Keyboard.KeyboardPlugin {
    const keyboard = scene.input.keyboard;
    if (!keyboard) {
        throw new Error("Keyboard input is not available in the scene.");
    }
    return keyboard;
}

async function expectAsync<T>(
    fn: (resolve: (value: T) => void, reject: (reason?: any) => void) => void,
): Promise<T> {
    return await new Promise<T>((res, rej) => fn(res, rej));
}

describe("StartPhase.test", () => {
    let sceneMock: CardBattleScene;
    let keyboard: Phaser.Input.Keyboard.KeyboardPlugin;
    let cardBattleMock: CardBattle;
    let roomId: string;
    let playerId: string;
    let numOfPlayerPlays: number;
    let numOfOpponentPlays: number;

    beforeAll(() => {
        sceneMock = new PhaserMock.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as CardBattleScene;
        keyboard = getKeyboard(sceneMock);
    });

    beforeEach(async () => {
        numOfPlayerPlays = 0;
        numOfOpponentPlays = 0;
        cardBattleMock = new CardBattleMemory(sceneMock);
        sceneMock.setCardBattle(cardBattleMock);

        // CREATE ROOM
        const playerRoom = await cardBattleMock.createRoom();
        roomId = playerRoom.roomId;
        playerId = playerRoom.playerId;
        sceneMock.room = playerRoom;
        // CHALLENGE PHASE
        await cardBattleMock.joinRoom(roomId);
        // START PHASE
        await cardBattleMock.setFolder(playerId, 'f3');
    });

    //PLAYER

    test("Player should play the mini game.", async () => {
        // given
        vi.spyOn(cardBattleMock, 'isPlayMiniGame').mockResolvedValue(true);
        const phase = new StartPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenResultWindows: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToOriginal = phase.changeToDrawPhase.bind(phase);

        // when
        await expectAsync<void>(res => {
            vi.spyOn(phase, 'changeToDrawPhase').mockImplementation(() => {
                changeToOriginal();
                res();
            });
            sceneMock.changePhase(phase);
        });

        // then
        expect(sceneMock.isPhase("DrawPhase")).toBe(true);
    });

    test("Opponent should play the mini game.", async () => {
        // given
        vi.spyOn(cardBattleMock, 'isPlayMiniGame').mockResolvedValue(false);
        const phase = new StartPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenResultWindows: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToOriginal = phase.changeToDrawPhase.bind(phase);

        // when
        await expectAsync<void>(res => {
            vi.spyOn(phase, 'changeToDrawPhase').mockImplementation(() => {
                changeToOriginal();
                res();
            });
            sceneMock.changePhase(phase);
        });

        // then
        expect(sceneMock.isPhase("DrawPhase")).toBe(true);
    });
    
});