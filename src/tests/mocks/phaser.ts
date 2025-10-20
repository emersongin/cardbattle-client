import Phaser from "phaser";
import { vi } from "vitest";
import { VueScene } from "@game/scenes/VueScene";
import { Phase } from "@game/scenes/CardBattle/phase/Phase";
import { CardBattleMock } from "./cardbattle";

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
    setName = vi.fn();
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

const PhaserMock = {
    VERSION: '3.90.0',
    Class: {
        mixin: vi.fn(),
    },
    Display: {
        Color: class {},
        Canvas: {
            CanvasPool: {
                create: () => ({
                    getContext: () => ({
                        measureText: () => ({ 
                            width: 0
                        }),
                        fillRect: vi.fn(),
                        fillText: vi.fn(),
                        getImageData: vi.fn(),
                    }),
                }),
                remove: vi.fn(),
            }
        },
        Align: {

        }
    },
    Sound: {
        BaseSound: class {},
    },
    Math: {
        Angle: {
            Between: vi.fn(),
        },
        Snap: {
            To: vi.fn(),
        },
        Easing: {
            Expo: {
                In: vi.fn(),
            }
        },
        DegToRad: vi.fn(),
        RadToDeg: vi.fn(),
        Clamp: vi.fn(),
        Between: vi.fn(),
        Distance: {
            BetweenPointsSquared: vi.fn(),
        },
        Interpolation: {
            Linear: vi.fn(),
        },
        Vector3: class {},
        Matrix4: class {},
    },
    Events: {
        EventEmitter: class {},
    },
    Geom: {
        Polygon: {
            Earcut: (..._args: any[]) => [],
        },
        Rectangle: class {},
        Intersects: {
            RectangleToRectangle: vi.fn(),
        },
        Mesh: {
            GenerateGridVerts: vi.fn(),
        }
    },
    Textures: {
        TextureManager: class {},
    },
    Animations: {
        AnimationManager: class {},
    },
    Cameras: {
        Scene2D: {
            BaseCamera: class {},
        }
    },
    GameObjects: {
        Container: MockContainer,
        Graphics: MockGraphics,
        Image: MockGameObject,
        Rectangle: RectangleMock,
        Text: MockText,
        RenderTexture: class {},
        GameObject: MockGameObject,
        Components: {
            TransformMatrix: class {}
        },
        Shape: class {},
        Zone: class {
            setOrigin = vi.fn();
            setName = vi.fn();
            emit = vi.fn();
        },
        DOMElement: class {},
        BitmapText: class {},
        NineSlice: class {},
        Mesh: class {},
    },
    Renderer: {
        Canvas: {},
        WebGL: {
            Utils: {},
            Pipelines: {
                PostFXPipeline: class {},
            }
        },
    },
    Utils: {
        Objects: {
            IsPlainObject: vi.fn(),
            GetValue: vi.fn(),
            GetAdvancedValue: vi.fn(),
        },
        Array: {
            Remove: vi.fn(),
            Add: vi.fn(),
        },
        String: {
            UUID: vi.fn(),
        },
    },
    Structs: {
        List: class {},
    },
    Tweens: {
        Builders: {
            GetEaseFunction: vi.fn(),
        },
        Tween: MockTween,
        TweenManager: class {
            add = vi.fn(() => new MockTween());
            addCounter = vi.fn(() => new MockTween());
            chain = vi.fn();
        },
    },
    DOM: {
        AddToDOM: vi.fn(),
    },
    Input: {
        Keyboard: {
            KeyCodes: {},
        },
    },
    Scene: class {
        private phase: Phase;
        private cardBattle: CardBattleMock;
        tweens = {
            add: vi.fn(() => new MockTween()),
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
        cameras = {
            main: {
                centerX: 400,
                centerY: 300,
            },
        };
        rexUI = {
            add: {
                roundRectangle: vi.fn((...args: any[]) => new RectangleMock(...args)),
            }
        };
        constructor () {
            this.cardBattle = new CardBattleMock(this as unknown as VueScene);
        }
        getCardBattle(): CardBattleMock {
            return this.cardBattle;
        }
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
        changePhase(phase: Phase, ...params: any[]): void {
            this.phase = phase;
            this.phase.create(...(params || []));
        }
    } as unknown as typeof VueScene,
};

HTMLCanvasElement.prototype.getContext = function(_type: string | undefined) {
    return {
        fillRect: () => {},
        clearRect: () => {},
        getImageData: (_x: number, _y: number, w: number, h: number) => ({
            data: [w * h * 4],
            remove: () => {},
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
