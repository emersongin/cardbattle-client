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
import { PowerCardPlay } from "@/game/objects/PowerCardPlay";
import { powerDeck } from "@game/data/decks";
import { CardFactory } from "@game/ui/Card/CardFactory";

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

    // it("should change the Summon Phase when players passed.", async () => {
    //     await expectAsync<void>(res => {
    //         vi.mocked(cardBattleMock.hasPowerCardsInField).mockReturnValue(false);
    //         vi.mocked(cardBattleMock.listenOpponentPlay).mockImplementation(
    //             (_playerId: string, callback: (play: PowerCardPlay) => void) => {
    //                 cardBattleMock.opponentStep = PASS;
    //                 callback({
    //                     pass: true,
    //                     powerAction: null,
    //                 });
    //                 return Promise.resolve();
    //             }
    //         );
    //         const keyboard = getKeyboard(sceneMock);
    //         const phase = new LoadPhase(sceneMock, {
    //         onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
    //         onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
    //         onOpenCommandWindow: () => {
    //                 keyboard.emit('keydown-DOWN');
    //                 keyboard.emit('keydown-ENTER');
    //             },
    //         });
    //         const changeToOriginal = phase.changeTo.bind(phase);
    //         phase.changeTo = () => {
    //             changeToOriginal();
    //             res();
    //         };

    //         sceneMock.changePhase(phase);
    //     });
    //     expect(sceneMock.isPhase("SummonPhase")).toBe(true);
    // });

    it("should change the Trigger Phase when player make a play.", async () => {
        await expectAsync<void>(res => {
            const powerCards = powerDeck.slice(0, 1);
            vi.mocked(cardBattleMock.isStartPlaying).mockReturnValue(false);
            vi.mocked(cardBattleMock.isOpponentPassed).mockReturnValue(true);
            vi.mocked(cardBattleMock.hasPowerCardInHand).mockReturnValue(true);
            vi.mocked(cardBattleMock.listenOpponentPlay).mockImplementation(
                (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                    cardBattleMock.opponentStep = PASS;
                    callback({
                        pass: true,
                        powerAction: null,
                    });
                    return Promise.resolve();
                }
            );
            vi.mocked(cardBattleMock.getCardsFromHand).mockReturnValue([CardFactory.createByType(sceneMock, powerCards[0])] as PowerCard[]);
            vi.mocked(cardBattleMock.getPowerCardById).mockReturnValue(CardFactory.createByType(sceneMock, powerCards[0]) as PowerCard);
            vi.mocked(cardBattleMock.isPowerfieldLimitReached).mockReturnValue(false);
            vi.mocked(cardBattleMock.makePowerCardPlay).mockImplementation(() => {
                vi.mocked(cardBattleMock.hasPowerCardsInField).mockReturnValue(true);
            });
            vi.mocked(cardBattleMock.getPowerActions).mockReturnValue([]);
            const keyboard = getKeyboard(sceneMock);
            const phase = new LoadPhase(sceneMock, {
                onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
                onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
                onOpenCommandWindow: () => keyboard.emit('keydown-ENTER'),
                onOpenHandZone: () => keyboard.emit('keydown-ENTER'),
                onOpenPowerCardChoiceCommandWindow: () => keyboard.emit('keydown-ENTER'),
                onOpenPowerCardCommandWindow: () => keyboard.emit('keydown-ENTER'),
                onChangeToTriggerPhase: () => res(),
            });
            
            sceneMock.changePhase(phase);
        });
        console.log('Asserting TriggerPhase');
        expect(sceneMock.isPhase("TriggerPhase")).toBe(true);
    });

});