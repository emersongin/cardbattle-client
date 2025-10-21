import Phaser from "phaser";
import { vi } from "vitest";
import { VueScene } from "@game/scenes/VueScene";
import { PowerActionData } from "@game/objects/PowerActionData";
import { BATTLE, NONE, POWER } from "@game/constants/keys";
import { CardBattle } from "@game/api/CardBattle";
import { folders, redDeck } from "@game/data/decks";
import { ArrayUtil } from "@game/utils/ArrayUtil";
import { CardData } from "@game/objects/CardData";
import { Phase } from "@game/scenes/CardBattle/phase/Phase";

class MockGameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    visible: boolean;
    constructor(x?: number, y?: number, width?: number, height?: number, visible?: boolean) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.visible = visible || false;
    };
    setOrigin = vi.fn();
    setPosition = vi.fn();
    setScale = vi.fn();
    setAlpha = vi.fn();
    setVisible = vi.fn((visible: boolean) => { this.visible = visible; });
    getVisible = vi.fn(() => this.visible);
    getWidth = vi.fn(() => 100);
    setInteractive = vi.fn();
    destroy = vi.fn();
    on = vi.fn();
    once = vi.fn();
    removeFromDisplayList = vi.fn();
    addedToScene = vi.fn();
    setTexture = vi.fn();
}

class RectangleMock extends MockGameObject {
    fillColor: number;
    alpha: number;
    constructor(x?: number, y?: number, width?: number, height?: number, fillColor?: number, fillAlpha?: number) {
        super(x, y, width, height);
        this.fillColor = fillColor ?? 0xffffff;
        this.alpha = fillAlpha ?? 1;
    };
}
class MockText extends MockGameObject {
    setText = vi.fn();
    setStyle = vi.fn();
}

class MockGraphics extends MockGameObject {
    defaultStrokeColor = 0xffffff;
    thickness = 0;
    clear = vi.fn();
    fillStyle = vi.fn();
    fillRect = vi.fn();
    lineStyle = vi.fn((thickness: number, color: number) => {
        this.defaultStrokeColor = color;
        this.thickness = thickness;
    })
    strokeRect = vi.fn();
}

class MockContainer extends MockGameObject {
    visible: boolean = false;
    list: any[] = [] as Phaser.GameObjects.Graphics[];
    constructor(readonly scene: any, readonly x: number = 0, readonly y: number = 0) {
        super(x, y);
    };
    add = vi.fn((obj: any) => { this.list.push(obj); return obj; });
    remove = vi.fn();
    removeAll = vi.fn();
    bringToTop = vi.fn();
    sendToBack = vi.fn();
    setVisible = vi.fn((visible: boolean) => { this.visible = visible; });
}

class MockTween {
    isPlaying = vi.fn().mockReturnValue(false);
    stop = vi.fn();
    getValue = vi.fn().mockReturnValue(0);
}

export type KeyboardPluginMock = {
    list: any[];
    addKey: (keyCode: string) => void;
    createCursorKeys: () => any;
    on: (keyCode: string, fn: any) => void;
    once: (keyCode: string, fn: any) => void;
    emit: (eventName: string, ...args: any[]) => void;
    removeAllListeners: () => void;
};

class cardBattleMock implements CardBattle {
    roomId: string = 'ROOM';
    firstPlayer: string = 'P1';
    powerActions = [] as PowerActionData[];
    powerActionsProcessed = [] as PowerActionData[];
    // player is the room creator
    playerId: string = 'P1';
    playerStep = NONE;
    playerDeck: CardData[] = ArrayUtil.clone(folders[2].deck || []);
    playerHand: CardData[] = [];
    // opponent is the one who joins the room
    opponentId: string = 'CPU';
    opponentStep = NONE;
    opponentDeck: CardData[] = redDeck;
    opponentHand: CardData[] = [];
    createRoom = vi.fn().mockReturnValue({ roomId: this.roomId, playerId: this.playerId });
    isOpponentJoined = vi.fn();
    listenOpponentJoined = vi.fn();
    joinRoom = vi.fn().mockReturnValue({ roomId: this.roomId, playerId: this.opponentId });
    getOpponentData = vi.fn();
    getFoldersOptions = vi.fn();
    setFolder = vi.fn();
    isOpponentDeckSet = vi.fn();
    listenOpponentDeckSet = vi.fn();
    isPlayMiniGame = vi.fn();
    setMiniGameChoice = vi.fn();
    listenOpponentEndMiniGame = vi.fn();
    isOpponentReadyDrawCards = vi.fn();
    setReadyDrawCards = vi.fn((playerId: string) => {
        if (this.playerId === playerId) {
            const powerCards = this.playerDeck.filter(card => card.type === POWER).slice(0, 4);
            const battleCards = this.playerDeck.filter(card => card.type === BATTLE).slice(0, (6 - powerCards.length));
            const drawnCards = [...powerCards, ...battleCards];
            this.playerDeck = this.playerDeck.filter(card => !drawnCards.includes(card));
            this.playerHand = drawnCards;
        }
        if (this.opponentId === playerId) {
            const powerCards = this.opponentDeck.filter(card => card.type === POWER).slice(0, 4);
            const battleCards = this.opponentDeck.filter(card => card.type === BATTLE).slice(0, (6 - powerCards.length));
            const drawnCards = [...powerCards, ...battleCards];
            this.opponentDeck = this.opponentDeck.filter(card => !drawnCards.includes(card));
            this.opponentHand = drawnCards;
        }
        return Promise.resolve();
    });
    listenOpponentDrawCards = vi.fn();
    getBoard = vi.fn();
    getOpponentBoard = vi.fn();
    getCardsFromHand = vi.fn();
    getOpponentCardsFromHand = vi.fn();
    isStartPlaying = vi.fn();
    setPlaying = vi.fn();
    pass = vi.fn();
    getPowerCardById = vi.fn();
    getFieldPowerCards = vi.fn();
    makePowerCardPlay = vi.fn();
    isPowerfieldLimitReached = vi.fn();
    hasPowerCardsInField = vi.fn();
    allPass = vi.fn();
    isOpponentPassed = vi.fn();
    listenOpponentPlay = vi.fn();
    hasPowerCardInHand = vi.fn();
    getPowerActions = vi.fn();
    setBattleCards = vi.fn();
    isOpponentBattleCardsSet = vi.fn();
    listenOpponentBattleCardsSet = vi.fn();
    getBattleCards = vi.fn();
    getOpponentBattleCards = vi.fn();
    getBattlePointsFromBoard = vi.fn();
    getOpponentBattlePointsFromBoard = vi.fn();
}

const PhaserMock = {
    GameObjects: {
        Container: MockContainer,
        Graphics: MockGraphics,
        Image: MockGameObject,
        Rectangle: RectangleMock,
        Text: MockText,
    },
    Tweens: {
        Tween: MockTween,
        TweenManager: class {
            add = vi.fn(() => new MockTween());
            addCounter = vi.fn(() => new MockTween());
            chain = vi.fn();
        },
    },
    Scene: class {
        #cardBattleMock: cardBattleMock;
        #phase: Phase;
        setCardBattle = (cardBattle: CardBattle) => {
            this.#cardBattleMock = cardBattle as cardBattleMock;
        }
        getCardBattle = () => this.#cardBattleMock;
        changePhase = (phase: Phase, ...params: any[]) => {
            this.#phase = phase;
            this.#phase.create(...(params || []));
        }
        isPhase = (phaseName: string) => {
            return this.#phase.constructor.name === phaseName;
        }
        cameras = {
            main: {
                centerX: 400,
                centerY: 300,
            }
        };
        rexUI = {
            add: {
                roundRectangle: () => RectangleMock,
                label: () => MockGameObject,
            },
        };
        scale = {
            width: 800,
            height: 600,
        };
        tweens = {
            add: vi.fn((config) => { 
                if (config.onComplete) config.onComplete();
                return new MockTween();
            }),
            chain: vi.fn(),
        };
        add = {
            container: vi.fn((...args) => new MockContainer(this, ...args)),
            existing: vi.fn((obj: any) => obj),
            graphics: vi.fn(() => new MockGraphics()),
            image: vi.fn(() => new MockGameObject()),
            rectangle: vi.fn((...args) => new RectangleMock(...args)),
            text: vi.fn(() => new MockText()),
        };
        children = {
            bringToTop: vi.fn(),
            sendToBack: vi.fn(),
        };
        sys = {
            displayList: {
                add: vi.fn(),
                exists: vi.fn(),
            },
            updateList: {
                add: vi.fn(),
            },
            queueDepthSort: vi.fn(),
        };
        input: {
            keyboard: KeyboardPluginMock
        } = {
            keyboard: {
                list: [],
                addKey: vi.fn(),
                createCursorKeys: vi.fn().mockReturnValue({}),
                on: (keyCode: string, fn: any) => {
                    this.input.keyboard.list.push({ keyCode, fn, once: false });
                },
                once: (keyCode: string, fn: any) => {
                    this.input.keyboard.list.push({ keyCode, fn, once: true });
                },
                emit: (eventName: string, times: number = 1) => {
                    console.log(this.input.keyboard.list);
                    this.input.keyboard.list.forEach((key: any) => {
                        if (key.keyCode === eventName) {
                            for (let i = 0; i < times; i++) {
                                key.fn();
                            }
                            if (key.once) {
                                this.input.keyboard.list = this.input.keyboard.list.filter((k: any) => k !== key);
                            }
                        }
                    });
                },
                removeAllListeners: () => {
                    this.input.keyboard.list = [];
                },
            },
        };
        addKeyEnterListening = (config: { onTrigger: () => void }) => {
            this.input.keyboard.on('keydown-ENTER', config.onTrigger);
        }
        addKeyEnterListeningOnce = (config: { onTrigger: () => void }) => {
            this.input.keyboard.once('keydown-ENTER', config.onTrigger);
        }
        addKeyEscListeningOnce = vi.fn();
        addKeyRightListening = (config: { onTrigger: () => void }) => {
            this.input.keyboard.on('keydown-RIGHT', config.onTrigger);
        };
        addKeyLeftListening = (config: { onTrigger: () => void }) => {
            this.input.keyboard.on('keydown-LEFT', config.onTrigger);
        };
        removeAllKeyListening = () => {
            this.input.keyboard.removeAllListeners();
        };
        addKeyShiftListeningOnce = (config: { onTrigger: () => void }) => {
            this.input.keyboard.once('keydown-SHIFT', config.onTrigger);
        };
        timeline = vi.fn();
    } as unknown as typeof VueScene,
};

HTMLCanvasElement.prototype.getContext = function(_type: string | undefined) {
    return {
        fillRect: () => {},
        clearRect: () => {},
        getImageData: (_x: number, _y: number, w: number, h: number) => ({
            data: new Array(w * h * 4),
        }),
        putImageData: () => {},
        createImageData: () => [],
        setTransform: () => {},
        drawImage: () => {},
        save: () => {},
        fillText: () => {},
        restore: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        closePath: () => {},
        stroke: () => {},
        translate: () => {},
        scale: () => {},
        rotate: () => {},
        arc: () => {},
        fill: () => {},
        measureText: () => ({ width: 0 }),
        transform: () => {},
        resetTransform: () => {},
    };
} as any;

export default PhaserMock as unknown as typeof Phaser;
export { cardBattleMock };