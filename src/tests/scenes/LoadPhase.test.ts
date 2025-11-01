import { describe, beforeAll, beforeEach, expect, vi, test } from "vitest";
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
    let keyboard: Phaser.Input.Keyboard.KeyboardPlugin;
    let cardBattleMock: CardBattleMock;
    let playerPassed: boolean;
    let opponentPassed: boolean;
    let numOfPlayerPlays: number;
    let numOfOpponentPlays: number;
    let numOfPowerCards: number;
    let arePowercardsReadyForProcessing: boolean;

    const setPlayerPassed = async (isPlay: boolean = false) => {
        return new Promise<void>(async res => {
            if (isPlay) {
                numOfPowerCards++;
                opponentPassed = false
            };
            playerPassed = true;
            numOfPlayerPlays++;
            if (numOfPowerCards >= 3) {
                vi.mocked(cardBattleMock.isPowerfieldLimitReached).mockReturnValue(true);
                arePowercardsReadyForProcessing = true;
            }
            if (await cardBattleMock.allPass() && numOfPowerCards > 0) {
                arePowercardsReadyForProcessing = true;
            }
            res();
        });

    }

    const setOppenentPassed = (isPlay: boolean = false) => {
        return new Promise<void>(async res => {
            if (isPlay) {
                numOfPowerCards++;
                playerPassed = false
            };
            opponentPassed = true;
            numOfOpponentPlays++;
            if (numOfPowerCards >= 3) {
                vi.mocked(cardBattleMock.isPowerfieldLimitReached).mockReturnValue(true);
                arePowercardsReadyForProcessing = true;
            }
            if (await cardBattleMock.allPass() && numOfPowerCards > 0) {
                arePowercardsReadyForProcessing = true;
            }
            res();
        });
    }

    beforeAll(() => {
        sceneMock = new PhaserMock.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as CardBattleScene;
        keyboard = getKeyboard(sceneMock);
    });

    beforeEach(() => {
        numOfPowerCards = 0;
        arePowercardsReadyForProcessing = false;
        playerPassed = false;
        opponentPassed = false;
        numOfPlayerPlays = 0;
        numOfOpponentPlays = 0;
        cardBattleMock = new CardBattleMock();
        sceneMock.setCardBattle(cardBattleMock);
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
        vi.mocked(cardBattleMock.hasPowerCardsProcessed).mockImplementation(() => arePowercardsReadyForProcessing);
        vi.mocked(cardBattleMock.pass).mockImplementation(() => setPlayerPassed());
        vi.mocked(cardBattleMock.isOpponentPassed).mockImplementation(() => opponentPassed);
        vi.mocked(cardBattleMock.allPass).mockImplementation(() => playerPassed && opponentPassed);
    });

    test("P:pass, O:pass => Summon.", async () => {
        // given
        vi.mocked(cardBattleMock.isStartPlaying).mockReturnValue(true);
        vi.mocked(cardBattleMock.listenOpponentPlay).mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                await setOppenentPassed();
                callback({
                    pass: true,
                    powerAction: null,
                });
                return Promise.resolve();
            }
        );
        const phase = new LoadPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => {
                keyboard.emit('keydown-DOWN');
                keyboard.emit('keydown-ENTER');
            },
        });
        const changeToOriginal = phase.changeTo.bind(phase);

        // when
        await expectAsync<void>(res => {
            vi.spyOn(phase, 'changeTo').mockImplementation(() => {
                changeToOriginal();
                res();
            });
            sceneMock.changePhase(phase);
        });

        // then
        expect(sceneMock.isPhase("SummonPhase")).toBe(true);
        expect(numOfPlayerPlays).toBe(1);
        expect(numOfOpponentPlays).toBe(1);
    });

    test("P:pass, O:play, P:pass => Load.", async () => {
        // given
        const powerCards = powerDeck.slice(0, 1);
        vi.mocked(cardBattleMock.isStartPlaying).mockReturnValue(true);
        vi.mocked(cardBattleMock.listenOpponentPlay).mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                await setOppenentPassed(true);
                callback({
                    pass: false,
                    powerAction: {
                        playerId: 'P1',
                        powerCard: CardFactory.createByType(sceneMock, powerCards[0]) as PowerCard,
                        config: true
                    }
                });
                vi.mocked(cardBattleMock.getFieldPowerCards).mockReturnValue([] as PowerCard[]);
                return Promise.resolve();
            }
        );
        vi.mocked(cardBattleMock.getPowerActions).mockReturnValueOnce([{
            playerId: 'P1',
            powerCard: CardFactory.createByType(sceneMock, powerCards[0]) as PowerCard,
            config: true
        }]);
        const phase = new LoadPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => {
                keyboard.emit('keydown-DOWN');
                keyboard.emit('keydown-ENTER');
            },
        });
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => res());
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(numOfPlayerPlays).toBe(2);
        expect(numOfOpponentPlays).toBe(1);
        expect(numOfPowerCards).toBe(1);
    });

    test("P:pass, O:play, P:play, O:pass => Load.", async () => {
        // given
        const powerCards = powerDeck.slice(0, 1);
        vi.mocked(cardBattleMock.isStartPlaying).mockReturnValue(true);
        vi.mocked(cardBattleMock.listenOpponentPlay).mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                if (numOfOpponentPlays === 0) {
                    await setOppenentPassed(true);
                    callback({
                        pass: false,
                        powerAction: {
                            playerId: 'P1',
                            powerCard: CardFactory.createByType(sceneMock, powerCards[0]) as PowerCard,
                            config: true
                        }
                    });
                    return Promise.resolve();
                }
                await setOppenentPassed();
                callback({
                    pass: true,
                    powerAction: null,
                });
                return Promise.resolve();
            }
        );

        vi.mocked(cardBattleMock.getPowerActions).mockReturnValueOnce([{
            playerId: 'P1',
            powerCard: CardFactory.createByType(sceneMock, powerCards[0]) as PowerCard,
            config: true
        }]);
        vi.mocked(cardBattleMock.hasPowerCardInHand).mockReturnValue(true);
        vi.mocked(cardBattleMock.getCardsFromHand).mockImplementation(() => [CardFactory.createByType(sceneMock, powerCards[0])] as PowerCard[]);
        vi.mocked(cardBattleMock.getPowerCardById).mockImplementation(() => CardFactory.createByType(sceneMock, powerCards[0]) as PowerCard);
        vi.mocked(cardBattleMock.makePowerCardPlay).mockImplementation(() => setPlayerPassed(true));
        const phase = new LoadPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => {
                if (numOfPlayerPlays === 0) keyboard.emit('keydown-DOWN');
                keyboard.emit('keydown-ENTER');
            },
            onOpenHandZone: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardChoiceCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardCommandWindow: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => res());
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(numOfPlayerPlays).toBe(2);
        expect(numOfOpponentPlays).toBe(2);
        expect(numOfPowerCards).toBe(2);
    });

    test("P:pass, O:play, P:play, O:play => Load.", async () => {
        // given
        const powerCards = powerDeck.slice(0, 1);
        vi.mocked(cardBattleMock.isStartPlaying).mockReturnValue(true);
        vi.mocked(cardBattleMock.listenOpponentPlay).mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                await setOppenentPassed(true);
                callback({
                    pass: false,
                    powerAction: {
                        playerId: 'P1',
                        powerCard: CardFactory.createByType(sceneMock, powerCards[0]) as PowerCard,
                        config: true
                    }
                });
                return Promise.resolve();
            }
        );

        vi.mocked(cardBattleMock.getPowerActions).mockReturnValueOnce([{
            playerId: 'P1',
            powerCard: CardFactory.createByType(sceneMock, powerCards[0]) as PowerCard,
            config: true
        }]);
        vi.mocked(cardBattleMock.hasPowerCardInHand).mockReturnValue(true);
        vi.mocked(cardBattleMock.getCardsFromHand).mockImplementation(() => [CardFactory.createByType(sceneMock, powerCards[0])] as PowerCard[]);
        vi.mocked(cardBattleMock.getPowerCardById).mockImplementation(() => CardFactory.createByType(sceneMock, powerCards[0]) as PowerCard);
        vi.mocked(cardBattleMock.makePowerCardPlay).mockImplementation(() => setPlayerPassed(true));
        const phase = new LoadPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => {
                if (numOfPlayerPlays === 0) keyboard.emit('keydown-DOWN');
                keyboard.emit('keydown-ENTER');
            },
            onOpenHandZone: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardChoiceCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardCommandWindow: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => res());
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(numOfPlayerPlays).toBe(2);
        expect(numOfOpponentPlays).toBe(2);
        expect(numOfPowerCards).toBe(3);
    });

    test("P:play, O:pass => Load.", async () => {
        // given
        const powerCards = powerDeck.slice(0, 1);
        vi.mocked(cardBattleMock.isStartPlaying).mockReturnValue(true);
        vi.mocked(cardBattleMock.listenOpponentPlay).mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                await setOppenentPassed();
                callback({
                    pass: true,
                    powerAction: null,
                });
                return Promise.resolve();
            }
        );
        vi.mocked(cardBattleMock.getPowerActions).mockReturnValueOnce([{
            playerId: 'P1',
            powerCard: CardFactory.createByType(sceneMock, powerCards[0]) as PowerCard,
            config: true
        }]);
        vi.mocked(cardBattleMock.hasPowerCardInHand).mockReturnValue(true);
        vi.mocked(cardBattleMock.getCardsFromHand).mockImplementation(() => [CardFactory.createByType(sceneMock, powerCards[0])] as PowerCard[]);
        vi.mocked(cardBattleMock.getPowerCardById).mockImplementation(() => CardFactory.createByType(sceneMock, powerCards[0]) as PowerCard);
        vi.mocked(cardBattleMock.makePowerCardPlay).mockImplementation(() => setPlayerPassed(true));
        const phase = new LoadPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenHandZone: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardChoiceCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardCommandWindow: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => res());
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(numOfPlayerPlays).toBe(1);
        expect(numOfOpponentPlays).toBe(1);
        expect(numOfPowerCards).toBe(1);
    });

    test("P:play, O:play, P:pass => Load.", async () => {
        // given
        const powerCards = powerDeck.slice(0, 1);
        vi.mocked(cardBattleMock.isStartPlaying).mockReturnValue(true);
        vi.mocked(cardBattleMock.listenOpponentPlay).mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                if (numOfOpponentPlays === 0) {
                    await setOppenentPassed(true);
                    callback({
                        pass: false,
                        powerAction: {
                            playerId: 'P1',
                            powerCard: CardFactory.createByType(sceneMock, powerCards[0]) as PowerCard,
                            config: true
                        }
                    });
                    return Promise.resolve();
                }
                await setOppenentPassed();
                callback({
                    pass: true,
                    powerAction: null,
                });
                return Promise.resolve();
            }
        );
        vi.mocked(cardBattleMock.getPowerActions).mockReturnValueOnce([{
            playerId: 'P1',
            powerCard: CardFactory.createByType(sceneMock, powerCards[0]) as PowerCard,
            config: true
        }]);
        vi.mocked(cardBattleMock.hasPowerCardInHand).mockReturnValue(true);
        vi.mocked(cardBattleMock.getCardsFromHand).mockImplementation(() => [CardFactory.createByType(sceneMock, powerCards[0])] as PowerCard[]);
        vi.mocked(cardBattleMock.getPowerCardById).mockImplementation(() => CardFactory.createByType(sceneMock, powerCards[0]) as PowerCard);
        vi.mocked(cardBattleMock.makePowerCardPlay).mockImplementation(() => setPlayerPassed(true));
        const phase = new LoadPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => {
                if (numOfPlayerPlays === 1) keyboard.emit('keydown-DOWN');
                keyboard.emit('keydown-ENTER');
            },
            onOpenHandZone: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardChoiceCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardCommandWindow: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => res());
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(numOfPlayerPlays).toBe(2);
        expect(numOfOpponentPlays).toBe(1);
        expect(numOfPowerCards).toBe(2);
    });

    test("P:play, O:play, P:play => Load.", async () => {
        // given
        const powerCards = powerDeck.slice(0, 1);
        vi.mocked(cardBattleMock.isStartPlaying).mockReturnValue(true);
        vi.mocked(cardBattleMock.listenOpponentPlay).mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                await setOppenentPassed(true);
                console.log('listenOpponentPlay', {
                    playerPassed,
                    opponentPassed,
                    numOfPowerCards,
                    numOfOpponentPlays,
                    numOfPlayerPlays,
                    arePowercardsReadyForProcessing
                });
                callback({
                    pass: false,
                    powerAction: {
                        playerId: 'P1',
                        powerCard: CardFactory.createByType(sceneMock, powerCards[0]) as PowerCard,
                        config: true
                    }
                });
                return Promise.resolve();
            }
        );

        vi.mocked(cardBattleMock.getPowerActions).mockReturnValueOnce([{
            playerId: 'P1',
            powerCard: CardFactory.createByType(sceneMock, powerCards[0]) as PowerCard,
            config: true
        }]);
        vi.mocked(cardBattleMock.hasPowerCardInHand).mockReturnValue(true);
        vi.mocked(cardBattleMock.getCardsFromHand).mockImplementation(() => [CardFactory.createByType(sceneMock, powerCards[0])] as PowerCard[]);
        vi.mocked(cardBattleMock.getPowerCardById).mockImplementation(() => CardFactory.createByType(sceneMock, powerCards[0]) as PowerCard);
        vi.mocked(cardBattleMock.makePowerCardPlay).mockImplementation(async () => {
            await setPlayerPassed(true);
            console.log('makePowerCardPlay', {
                playerPassed,
                opponentPassed,
                numOfPowerCards,
                numOfOpponentPlays,
                numOfPlayerPlays,
                arePowercardsReadyForProcessing
            });
        });
        const phase = new LoadPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => {
                console.log('onOpenCommandWindow');
                keyboard.emit('keydown-ENTER');
            },
            onOpenHandZone: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardChoiceCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardCommandWindow: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => res());
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(numOfPlayerPlays).toBe(2);
        expect(numOfOpponentPlays).toBe(1);
        expect(numOfPowerCards).toBe(3);
    });
});