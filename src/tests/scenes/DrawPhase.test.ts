import { describe, beforeAll, beforeEach, expect, vi, it } from "vitest";
import PhaserMock from "@mocks/phaser";
import CardBattleMemory from "@game/api/CardBattleMemory";
import { CardBattleScene } from "@game/scenes/CardBattle/CardBattleScene";
import { CardBattle } from "@game/api/CardBattle";
import { DrawPhase } from "@/game/scenes/CardBattle/phase/DrawPhase";

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

describe("DrawPhase.test", () => {
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
    });

    //PLAYER

    it("Should go through the phase.", async () => {
        // given
        const phase = new DrawPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToOriginal = phase.changeToStartPhase.bind(phase);

        // when
        await expectAsync<void>(res => {
            vi.spyOn(phase, 'changeToStartPhase').mockImplementation(() => {
                changeToOriginal();
                res();
            });
            sceneMock.changePhase(phase);
        });

        // then
        expect(sceneMock.isPhase("StartPhase")).toBe(true);
    });
    
});