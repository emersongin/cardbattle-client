import { describe, beforeAll, beforeEach, expect, vi, test } from "vitest";
import PhaserMock from "@mocks/phaser";
import CardBattleMemory from "@game/api/CardBattleMemory";
import { LoadPhase } from "@game/scenes/CardBattle/phase/LoadPhase";
import { CardBattleScene } from "@game/scenes/CardBattle/CardBattleScene";
import { WHITE } from "@game/constants/colors";
import { PowerCard } from "@game/ui/Card/PowerCard";
import { PowerCardPlay } from "@/game/objects/PowerCardPlay";
import { powerDeck } from "@game/data/decks";
import { CardFactory } from "@game/ui/Card/CardFactory";
import { CardData } from "@game/objects/CardData";
import { CardBattle } from "@game/api/CardBattle";
import { RoomData } from "@/game/objects/RoomData";

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
    let cardBattleMock: CardBattle;
    let roomId: string;
    let playerId: string;
    let opponentId: string;
    let numOfPlayerPlays: number;
    let numOfOpponentPlays: number;

    const opponentPass = (callback: (play: PowerCardPlay) => void) => {
        return new Promise<void>(async res => {
            await cardBattleMock.pass(opponentId);
            callback({
                pass: true,
                powerAction: null
            });
            res();
        });
    }

    const opponentPlay = (callback: (play: PowerCardPlay) => void, powerCard: CardData) => {
        return new Promise<void>(async res => {
            const powerAction = {
                playerId: opponentId,
                powerCard,
                config: true
            };
            await cardBattleMock.makePowerCardPlay(opponentId, powerAction);
            callback({
                pass: true,
                powerAction: {
                    playerId: 'P1',
                    powerCard: CardFactory.createByType(sceneMock, powerCard) as PowerCard,
                    config: true
                }
            });
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
        const opponentRoom: RoomData = await cardBattleMock.joinRoom(roomId);
        opponentId = opponentRoom.playerId;
        // START PHASE
        await cardBattleMock.setFolder(playerId, 'f3');
        // DRAW PHASE
        await cardBattleMock.setMiniGameChoice(playerId, WHITE);
        // LOAD PHASE
        await cardBattleMock.setReadyDrawCards(opponentId);
        await cardBattleMock.setReadyDrawCards(playerId);
    });

    //PLAYER

    test("P:pass, O:pass => Summon.", async () => {
        // given
        const passSpy = vi.spyOn(cardBattleMock, 'pass');
        const listenOpponentPlaySpy = vi.spyOn(cardBattleMock, 'listenOpponentPlay').mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                return await opponentPass(callback);
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
        expect(listenOpponentPlaySpy).toHaveBeenCalledTimes(1);
        expect(passSpy).toHaveBeenCalledTimes(2);
    });

    test("P:pass, O:play, P:pass => Load.", async () => {
        // given
        const passSpy = vi.spyOn(cardBattleMock, 'pass');
        const listenOpponentPlaySpy = vi.spyOn(cardBattleMock, 'listenOpponentPlay').mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                return await opponentPlay(callback, powerDeck[0]);
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
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => res());
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(listenOpponentPlaySpy).toHaveBeenCalledTimes(1);
        expect(passSpy).toHaveBeenCalledTimes(3);
        expect(await cardBattleMock.hasPowerCardsProcessed()).toBe(true);
        expect(await cardBattleMock.getPowerActions()).toHaveLength(1);
    });

    test("P:pass, O:play, P:play, O:pass => Load.", async () => {
        // given
        const passSpy = vi.spyOn(cardBattleMock, 'pass');
        const listenOpponentPlaySpy = vi.spyOn(cardBattleMock, 'listenOpponentPlay').mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                if (numOfOpponentPlays === 0) {
                    numOfOpponentPlays++;
                    return await opponentPlay(callback, powerDeck[0]);
                }
                numOfOpponentPlays++;
                return await opponentPass(callback);
            }
        );        
        const phase = new LoadPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => {
                if (numOfPlayerPlays === 0) keyboard.emit('keydown-DOWN');
                numOfPlayerPlays++;
                keyboard.emit('keydown-ENTER');
            },
            onSelectModeHandZoneCardset: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardSelectionCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardActivationCommandWindow: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => {
                console.log('Changing to Trigger Phase...');
                res();
            });
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(listenOpponentPlaySpy).toHaveBeenCalledTimes(2);
        expect(passSpy).toHaveBeenCalledTimes(4);
        expect(await cardBattleMock.hasPowerCardsProcessed()).toBe(true);
        expect(await cardBattleMock.getPowerActions()).toHaveLength(2);
    }, 6000);

    test("P:pass, O:play, P:play, O:play => Load.", async () => {
        // given
        const passSpy = vi.spyOn(cardBattleMock, 'pass');
        vi.spyOn(cardBattleMock, "isStartPlaying").mockResolvedValue(true);
        const listenOpponentPlaySpy = vi.spyOn(cardBattleMock, "listenOpponentPlay").mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                return await opponentPlay(callback, powerDeck[0]);
            }
        );
        const phase = new LoadPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => {
                if (numOfPlayerPlays === 0) keyboard.emit('keydown-DOWN');
                numOfPlayerPlays++;
                keyboard.emit('keydown-ENTER');
            },
            onSelectModeHandZoneCardset: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardSelectionCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardActivationCommandWindow: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => res());
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(listenOpponentPlaySpy).toHaveBeenCalledTimes(2);
        expect(passSpy).toHaveBeenCalledTimes(4);
        expect(await cardBattleMock.hasPowerCardsProcessed()).toBe(true);
        expect(await cardBattleMock.getPowerActions()).toHaveLength(3);
    }, 6000);

    test("P:play, O:pass => Load.", async () => {
        // given
        const passSpy = vi.spyOn(cardBattleMock, 'pass');
        vi.spyOn(cardBattleMock, "isStartPlaying").mockResolvedValue(true);
        const listenOpponentPlaySpy = vi.spyOn(cardBattleMock, "listenOpponentPlay").mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                return await opponentPass(callback);
            }
        );
        const phase = new LoadPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onSelectModeHandZoneCardset: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardSelectionCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardActivationCommandWindow: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => res());
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(passSpy).toHaveBeenCalledTimes(2);
        expect(listenOpponentPlaySpy).toHaveBeenCalledTimes(1);
        expect(await cardBattleMock.hasPowerCardsProcessed()).toBe(true);
        expect(await cardBattleMock.getPowerActions()).toHaveLength(1);
    });

    test("P:play, O:play, P:pass => Load.", async () => {
        // given
        const passSpy = vi.spyOn(cardBattleMock, 'pass');
        vi.spyOn(cardBattleMock, "isStartPlaying").mockResolvedValue(true);
        const listenOpponentPlaySpy = vi.spyOn(cardBattleMock, "listenOpponentPlay").mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                if (numOfOpponentPlays === 0) {
                    numOfOpponentPlays++;
                    return await opponentPlay(callback, powerDeck[0]);
                }
                numOfOpponentPlays++;
                return await opponentPass(callback);
            }
        );
        const phase = new LoadPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => {
                if (numOfPlayerPlays === 1) keyboard.emit('keydown-DOWN');
                numOfPlayerPlays++;
                keyboard.emit('keydown-ENTER');
            },
            onSelectModeHandZoneCardset: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardSelectionCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardActivationCommandWindow: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => res());
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(passSpy).toHaveBeenCalledTimes(3);
        expect(listenOpponentPlaySpy).toHaveBeenCalledTimes(1);
        expect(await cardBattleMock.hasPowerCardsProcessed()).toBe(true);
        expect(await cardBattleMock.getPowerActions()).toHaveLength(2);
    }, 6000);

    test("P:play, O:play, P:play => Load.", async () => {
        // given
        const passSpy = vi.spyOn(cardBattleMock, 'pass');
        vi.spyOn(cardBattleMock, "isStartPlaying").mockResolvedValue(true);
        const listenOpponentPlaySpy = vi.spyOn(cardBattleMock, "listenOpponentPlay").mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                return await opponentPlay(callback, powerDeck[0]);
            }
        );
        const phase = new LoadPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onSelectModeHandZoneCardset: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardSelectionCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardActivationCommandWindow: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => res());
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(passSpy).toHaveBeenCalledTimes(3);
        expect(listenOpponentPlaySpy).toHaveBeenCalledTimes(1);
        expect(await cardBattleMock.hasPowerCardsProcessed()).toBe(true);
        expect(await cardBattleMock.getPowerActions()).toHaveLength(3);
    }, 6000);

    // OPPONENT

    test("O:pass, P:pass => Summon.", async () => {
        // given
        const passSpy = vi.spyOn(cardBattleMock, 'pass');
        vi.spyOn(cardBattleMock, "isStartPlaying").mockResolvedValue(false);
        const listenOpponentPlaySpy = vi.spyOn(cardBattleMock, "listenOpponentPlay").mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                return await opponentPass(callback);
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
        expect(passSpy).toHaveBeenCalledTimes(2);
        expect(listenOpponentPlaySpy).toHaveBeenCalledTimes(1);
        expect(await cardBattleMock.hasPowerCardsProcessed()).toBe(false);
        expect(await cardBattleMock.getPowerActions()).toHaveLength(0);
    });

    test("O:pass, P:play, O:pass => Load.", async () => {
        // given
        const passSpy = vi.spyOn(cardBattleMock, 'pass');
        vi.spyOn(cardBattleMock, "isStartPlaying").mockResolvedValue(false);
        const listenOpponentPlaySpy = vi.spyOn(cardBattleMock, "listenOpponentPlay").mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                return await opponentPass(callback);
            }
        );
        const phase = new LoadPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => {
                keyboard.emit('keydown-ENTER');
            },
            onSelectModeHandZoneCardset: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardSelectionCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardActivationCommandWindow: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => res());
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(passSpy).toHaveBeenCalledTimes(3);
        expect(listenOpponentPlaySpy).toHaveBeenCalledTimes(2);
        expect(await cardBattleMock.hasPowerCardsProcessed()).toBe(true);
        expect(await cardBattleMock.getPowerActions()).toHaveLength(1);
    });

    test("O:pass, P:play, O:play, P:pass => Load.", async () => {
        // given
        const passSpy = vi.spyOn(cardBattleMock, 'pass');
        vi.spyOn(cardBattleMock, "isStartPlaying").mockResolvedValue(false);
        const listenOpponentPlaySpy = vi.spyOn(cardBattleMock, "listenOpponentPlay").mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                if (numOfOpponentPlays === 0) {
                    numOfOpponentPlays++;
                    return await opponentPass(callback);
                }
                numOfOpponentPlays++;
                return await opponentPlay(callback, powerDeck[0]);
            }
        );

        const phase = new LoadPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => {
                if (numOfPlayerPlays !== 0) keyboard.emit('keydown-DOWN');
                numOfPlayerPlays ++;
                keyboard.emit('keydown-ENTER');
            },
            onSelectModeHandZoneCardset: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardSelectionCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardActivationCommandWindow: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => res());
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(passSpy).toHaveBeenCalledTimes(4);
        expect(listenOpponentPlaySpy).toHaveBeenCalledTimes(2);
        expect(await cardBattleMock.hasPowerCardsProcessed()).toBe(true);
        expect(await cardBattleMock.getPowerActions()).toHaveLength(2);
    }, 6000);

    test("O:pass, P:play, O:play, P:play => Load.", async () => {
        // given
        const passSpy = vi.spyOn(cardBattleMock, 'pass');
        vi.spyOn(cardBattleMock, "isStartPlaying").mockResolvedValue(false);
        const listenOpponentPlaySpy = vi.spyOn(cardBattleMock, "listenOpponentPlay").mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                if (numOfOpponentPlays === 0) {
                    numOfOpponentPlays++;
                    return await opponentPass(callback);
                }
                numOfOpponentPlays++;
                return await opponentPlay(callback, powerDeck[0]);
            }
        );
        const phase = new LoadPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onSelectModeHandZoneCardset: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardSelectionCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardActivationCommandWindow: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => res());
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(passSpy).toHaveBeenCalledTimes(4);
        expect(listenOpponentPlaySpy).toHaveBeenCalledTimes(2);
        expect(await cardBattleMock.hasPowerCardsProcessed()).toBe(true);
        expect(await cardBattleMock.getPowerActions()).toHaveLength(3);
    }, 6000);

    test("O:play, P:pass => Load.", async () => {
        // given
        const passSpy = vi.spyOn(cardBattleMock, 'pass');
        vi.spyOn(cardBattleMock, "isStartPlaying").mockResolvedValue(false);
        const listenOpponentPlaySpy = vi.spyOn(cardBattleMock, "listenOpponentPlay").mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                return await opponentPlay(callback, powerDeck[0]);
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
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => res());
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(passSpy).toHaveBeenCalledTimes(2);
        expect(listenOpponentPlaySpy).toHaveBeenCalledTimes(1);
        expect(await cardBattleMock.hasPowerCardsProcessed()).toBe(true);
        expect(await cardBattleMock.getPowerActions()).toHaveLength(1);
    });

    test("O:play, P:play, O:pass => Load.", async () => {
        // given
        const passSpy = vi.spyOn(cardBattleMock, 'pass');
        vi.spyOn(cardBattleMock, "isStartPlaying").mockResolvedValue(false);
        const listenOpponentPlaySpy = vi.spyOn(cardBattleMock, "listenOpponentPlay").mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                if (numOfOpponentPlays === 0) {
                    numOfOpponentPlays++;
                    return await opponentPlay(callback, powerDeck[0]);
                }
                numOfOpponentPlays++;
                return await opponentPass(callback);
            }
        );
        const phase = new LoadPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onSelectModeHandZoneCardset: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardSelectionCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardActivationCommandWindow: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => res());
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(passSpy).toHaveBeenCalledTimes(3);
        expect(listenOpponentPlaySpy).toHaveBeenCalledTimes(2);
        expect(await cardBattleMock.hasPowerCardsProcessed()).toBe(true);
        expect(await cardBattleMock.getPowerActions()).toHaveLength(2);
    });

    test("O:play, P:play, O:play => Load.", async () => {
        // given
        const passSpy = vi.spyOn(cardBattleMock, 'pass');
        vi.spyOn(cardBattleMock, "isStartPlaying").mockResolvedValue(false);
        const listenOpponentPlaySpy = vi.spyOn(cardBattleMock, "listenOpponentPlay").mockImplementation(
            async (_playerId: string, callback: (play: PowerCardPlay) => void) => {
                return await opponentPlay(callback, powerDeck[0]);
            }
        );
        const phase = new LoadPhase(sceneMock, {
            onOpenPhaseWindows: () => keyboard.emit('keydown-ENTER'),
            onOpenBeginPhaseWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onSelectModeHandZoneCardset: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardSelectionCommandWindow: () => keyboard.emit('keydown-ENTER'),
            onOpenPowerCardActivationCommandWindow: () => keyboard.emit('keydown-ENTER'),
        });
        const changeToTriggerPhaseSpy = vi.spyOn(phase, 'changeToTriggerPhase');

        // when
        await expectAsync<void>(res => {
            changeToTriggerPhaseSpy.mockImplementation(() => res());
            sceneMock.changePhase(phase);
        });

        // then
        expect(changeToTriggerPhaseSpy).toHaveBeenCalled();
        expect(passSpy).toHaveBeenCalledTimes(3);
        expect(listenOpponentPlaySpy).toHaveBeenCalledTimes(2);
        expect(await cardBattleMock.hasPowerCardsProcessed()).toBe(true);
        expect(await cardBattleMock.getPowerActions()).toHaveLength(3);
    });
    
});