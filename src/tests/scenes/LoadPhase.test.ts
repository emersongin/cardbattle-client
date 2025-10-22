import { describe, it, beforeAll, beforeEach, expect, vi } from "vitest";
import PhaserMock from "@mocks/phaser";
import CardBattleMock from "@mocks/cardbattle";
import { LoadPhase } from "@game/scenes/CardBattle/phase/LoadPhase";
import { CardBattleScene } from "@game/scenes/CardBattle/CardBattleScene";
import { AP, DECK, HAND, HP, PASS, TRASH, WINS } from "@game/constants/keys";
import { BLACK, BLUE, GREEN, RED, WHITE } from "@game/constants/colors";
import { BoardWindow } from "@game/ui/BoardWindow/BoardWindow";
import { PowerCard } from "@game/ui/Card/PowerCard";
import { BattleCard } from "@game/ui/Card/BattleCard";
import { TextWindow } from "@game/ui/TextWindows/TextWindow";
import { TweenConfig } from "@game/types/TweenConfig";

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
        vi.mocked(cardBattleMock.getBoard).mockReturnValue(BoardWindow.createBottom(sceneMock, {
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
            [PASS]: false,
        }, 0x3C64DE));
        vi.mocked(cardBattleMock.getOpponentBoard).mockReturnValue(BoardWindow.createTopReverse(sceneMock, {
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
            [PASS]: false,
        }, 0xDE3C5A));
        vi.mocked(cardBattleMock.getFieldPowerCards).mockReturnValue([] as PowerCard[]);
        vi.mocked(cardBattleMock.getBattleCards).mockReturnValue([] as BattleCard[]);
        vi.mocked(cardBattleMock.getOpponentBattleCards).mockReturnValue([] as BattleCard[]);

        vi.mocked(cardBattleMock.isStartPlaying).mockReturnValue(true);
    });

    it("should throw error: invalid card type.", () => {
        const keyboard = getKeyboard(sceneMock);
        const phase = new LoadPhase(sceneMock);

        const open = TextWindow.prototype.open;
        vi.spyOn(TextWindow.prototype, 'open').mockImplementation(function (this: TextWindow, ...args) {
            open.apply(this, [args]);
            console.log('TextWindow keydown-ENTER', args);
            // if (args?.onComplete) {
            //     keyboard.emit('keydown-ENTER');
            // }
        });

        sceneMock.changePhase(phase);

        // keyboard.emit('keydown-DOWN');
        // keyboard.emit('keydown-ENTER');
        // vi.mocked(cardBattleMock.listenOpponentPlay).mockReturnValue({ pass: true, powerAction: null });
        expect(sceneMock.isPhase('SummonPhase')).toBe(true);
    });

});
