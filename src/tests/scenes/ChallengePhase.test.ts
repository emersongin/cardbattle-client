import { describe, beforeAll, beforeEach, expect, vi, test } from "vitest";
import PhaserMock from "@mocks/phaser";
import CardBattleMemory from "@game/api/CardBattleMemory";
import { CardBattleScene } from "@game/scenes/CardBattle/CardBattleScene";
import { CardBattle } from "@game/api/CardBattle";
import { ChallengePhase } from "@game/scenes/CardBattle/phase/ChallengePhase";

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

describe("ChallengePhase.test", () => {
    let sceneMock: CardBattleScene;
    let keyboard: Phaser.Input.Keyboard.KeyboardPlugin;
    let cardBattleMock: CardBattle;
    let roomId: string;

    beforeAll(() => {
        sceneMock = new PhaserMock.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as CardBattleScene;
        keyboard = getKeyboard(sceneMock);
    });

    beforeEach(async () => {
        cardBattleMock = new CardBattleMemory(sceneMock);
        sceneMock.setCardBattle(cardBattleMock);

        // CREATE ROOM
        const playerRoom = await cardBattleMock.createRoom();
        roomId = playerRoom.roomId;
        sceneMock.room = playerRoom;
        // CHALLENGE PHASE
        await cardBattleMock.joinRoom(roomId);
    });

    //PLAYER

    test("Select first deck and complete phase.", async () => {
        // given
        const phase = new ChallengePhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToOriginal = phase.changeToStartPhase.bind(phase);
        let folderIdMock = '';
        const setFolderOriginal = cardBattleMock.setFolder;
        vi.spyOn(cardBattleMock, 'setFolder').mockImplementation(async (_playerId: string, folderId: string) => {
            folderIdMock = folderId;
            return setFolderOriginal.apply(cardBattleMock, [_playerId, folderId]);
        });

        // when
        await expectAsync<void>(res => {
            vi.spyOn(phase, 'changeToStartPhase').mockImplementation(() => {
                changeToOriginal();
                res();
            });
            sceneMock.changePhase(phase);
        });

        // then
        expect(folderIdMock).toBe('f1');
        expect(sceneMock.isPhase("StartPhase")).toBe(true);
    });

    test("Select the second deck.", async () => {
        // given
        const phase = new ChallengePhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => {
                keyboard.emit('keydown-DOWN');
                keyboard.emit('keydown-ENTER');
            },
        });
        let folderIdMock = '';

        // when
        await expectAsync<void>(res => {
            vi.spyOn(cardBattleMock, 'setFolder').mockImplementation(async (_playerId: string, folderId: string) => {
                folderIdMock = folderId;
                res();
                return true;
            });
            sceneMock.changePhase(phase);
        });

        // then
        expect(folderIdMock).toBe('f2');
    });

    test("Select the third deck.", async () => {
        // given
        const phase = new ChallengePhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => {
                keyboard.emit('keydown-DOWN');
                keyboard.emit('keydown-DOWN');
                keyboard.emit('keydown-ENTER');
            },
        });
        let folderIdMock = '';

        // when
        await expectAsync<void>(res => {
            vi.spyOn(cardBattleMock, 'setFolder').mockImplementation(async (_playerId: string, folderId: string) => {
                folderIdMock = folderId;
                res();
                return true;
            });
            sceneMock.changePhase(phase);
        });

        // then
        expect(folderIdMock).toBe('f3');
    });
    
});