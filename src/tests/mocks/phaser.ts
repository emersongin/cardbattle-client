import { vi } from "vitest";
import Phaser from "phaser";

class MockGameObject {
    setOrigin = vi.fn();
    setPosition = vi.fn();
    setScale = vi.fn();
    setAlpha = vi.fn();
    setVisible = vi.fn();
    setInteractive = vi.fn();
    destroy = vi.fn();
    on = vi.fn();
    once = vi.fn();
    removeFromDisplayList = vi.fn();
    addedToScene = vi.fn();
    setTexture = vi.fn();
}

class MockText extends MockGameObject {
    setText = vi.fn();
    setStyle = vi.fn();
}

class MockGraphics extends MockGameObject {
    clear = vi.fn();
    fillStyle = vi.fn();
    fillRect = vi.fn();
    lineStyle = vi.fn();
    strokeRect = vi.fn();
}

class MockContainer extends MockGameObject {
    constructor(readonly scene: Phaser.Scene, readonly x: number = 0, readonly y: number = 0) {
        super();
    };
    add = vi.fn();
    remove = vi.fn();
    removeAll = vi.fn();
    bringToTop = vi.fn();
    sendToBack = vi.fn();
}

class MockTween {
    isPlaying = vi.fn().mockReturnValue(false);
    stop = vi.fn();
    getValue = vi.fn().mockReturnValue(0);
}

const PhaserMock = {
    GameObjects: {
        Container: MockContainer,
        Rectangle: MockGameObject,
        Image: MockGameObject,
        Text: MockText,
        Graphics: MockGraphics,
    },
    Tweens: {
        Tween: MockTween,
        TweenManager: class {
            add = vi.fn(() => new MockTween());
            addCounter = vi.fn(() => new MockTween());
        },
    },
    Scene: class {
        tweens: Phaser.Tweens.TweenManager;
        add = {
            image: vi.fn(() => new MockGameObject()),
            rectangle: vi.fn(() => new MockGameObject()),
            text: vi.fn(() => new MockText()),
            graphics: vi.fn(() => new MockGraphics()),
            container: Phaser.GameObjects.Container,
            existing: vi.fn((obj: any) => obj),
        };
        children = {
            bringToTop: vi.fn(),
            sendToBack: vi.fn(),
        };
        sys = {
            displayList: {
            add: vi.fn(),
            },
            updateList: {
            add: vi.fn(),
            },
            queueDepthSort: vi.fn(),
        };
    },
};

HTMLCanvasElement.prototype.getContext = function(_type: string | undefined) {
    return {
        fillRect: () => {},
        clearRect: () => {},
        getImageData: (x: number, y: number, w: number, h: number) => ({
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
