import PhaserMock, { cardBattleMock } from "@mocks/phaser";
import { describe, it, beforeAll, beforeEach } from "vitest";
import { LoadPhase } from "@game/scenes/CardBattle/phase/LoadPhase";
import { CardBattleScene } from "@game/scenes/CardBattle/CardBattleScene";
import { RoomData } from "@game/objects/RoomData";
import { WHITE } from "@game/constants/colors";

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
    });

});
