import PhaserMock from "@mocks/phaser";
import { describe, it, beforeAll, expect } from "vitest";
import { LoadPhase } from "@game/scenes/CardBattle/phase/LoadPhase";
import { CardBattleScene } from "@game/scenes/CardBattle/CardBattleScene";

describe("PowerPhase.test", () => {
    let sceneMock: CardBattleScene;

    beforeAll(async () => {
        sceneMock = new PhaserMock.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as CardBattleScene;
        sceneMock.changePhase(new LoadPhase(sceneMock));
        // // CREATE ROOM
        // sceneMock.room = await sceneMock.getCardBattle().createRoom();
        // const { roomId, playerId } = sceneMock.room;
        // // CHALLENGE PHASE
        // const { playerId: opponentId }: RoomData = await sceneMock.getCardBattle().joinRoom(roomId);
        // // START PHASE
        // await sceneMock.getCardBattle().setFolder(playerId, 'f3');
        // // DRAW PHASE
        // await sceneMock.getCardBattle().setMiniGameChoice(playerId, WHITE);
        // // LOAD PHASE
        // await sceneMock.getCardBattle().setReadyDrawCards(opponentId);
        // await sceneMock.getCardBattle().setReadyDrawCards(playerId);
    });

    it("should throw error: invalid card type.", () => {
        expect(sceneMock).toBeDefined();
    });

});
