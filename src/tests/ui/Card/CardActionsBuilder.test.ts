import PhaserMock from "@mocks/phaser";
import { describe, it, expect, beforeAll, vi, beforeEach } from "vitest";
import { VueScene } from "@scenes/VueScene";
import { CardActionsBuilder } from "@game/ui/Card/CardActionsBuilder";
import { CardColorType } from "@game/types/CardColorType";
import { BLUE } from "@game/constants/colors";
import { BATTLE, NONE } from "@game/constants/keys";
import { CardType } from "@game/types/CardType";
import { CardData } from "@game/objects/CardData";
import { Card } from "@game/ui/Card/Card";
import { FlashConfig } from "@/game/ui/Card/animations/types/FlashConfig";
import { ExpandConfig } from "@/game/ui/Card/animations/types/ExpandConfig";
import { PositionConfig } from "@/game/ui/Card/animations/types/PositionConfig";
import { ScaleConfig } from "@/game/ui/Card/animations/types/ScaleConfig";

describe("CardActionsBuilder.test", () => {
    let sceneMock: VueScene;
    const battleCardData = {
        id: 'ID',
        number: 1,
        name: 'This is card name',
        description: 'This is card description.',
        color: BLUE as CardColorType,
        image: 'card-picture',
        type: BATTLE as CardType,
        ap: 10,
        hp: 10,
        cost: 10,
        effectType: NONE,
        effectDescription: 'none.',
    } as CardData;
    let card: Card;

    beforeAll(() => {
        sceneMock = new PhaserMock.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        }) as VueScene;
    });

    beforeEach(() => {
        card = new Card(sceneMock, battleCardData);
    });

    it("should open the card.", () => {
        const cardOriginX = card.getX();
        card.setClosed();
        const builder = CardActionsBuilder.create(card);
        let scaleX = 0;
        let ease = '';
        let delay = 0;
        let duration = 0;
        sceneMock.tweens.add = vi.fn().mockImplementation((config: ScaleConfig) => {
            scaleX = config.scaleX as number;
            ease = config.ease as string;
            delay = config.delay as number;
            duration = config.duration as number;
            if (config?.onComplete) config.onComplete();
        });
        builder
            .open({ delay: 0, duration: 0 })
            .play();
        expect(card.getX()).toBe(cardOriginX);
        expect(card.isOpened()).toBe(true);
        expect(scaleX).toBe(1);
        expect(ease).toBe('Linear');
        expect(delay).toBe(0);
        expect(duration).toBe(100);
    });

    it("should close the card.", () => {
        const builder = CardActionsBuilder.create(card);
        const cardX = card.getX();
        const cardWidth = card.getWidth();
        let scaleX = 0;
        let ease = '';
        let delay = 0;
        let duration = 0;
        sceneMock.tweens.add = vi.fn().mockImplementation((config: ScaleConfig) => {
            scaleX = config.scaleX as number;
            ease = config.ease as string;
            delay = config.delay as number;
            duration = config.duration as number;
            if (config?.onComplete) config.onComplete();
        });
        builder
            .close({ delay: 0, duration: 0 })
            .play();
        expect(card.getX()).toBe(cardX + (cardWidth / 2));
        expect(card.isClosed()).toBe(true);
        expect(scaleX).toBe(0);
        expect(ease).toBe('Linear');
        expect(delay).toBe(0);
        expect(duration).toBe(100);
    });

    it("should turn the card to face up.", () => {
        const builder = CardActionsBuilder.create(card);
        builder
            .faceUp()
            .play();
        expect(card.isFaceUp()).toBe(true);
    });

    it("should move the card on the position.", () => {
        const builder = CardActionsBuilder.create(card);
        let fromX = 0;
        let fromY = 0;
        let toX = 0;
        let toY = 0;
        sceneMock.tweens.chain = vi.fn().mockImplementation((config: PositionConfig) => {
            const { tweens } = config;
            fromX = tweens[0].x as number;
            fromY = tweens[0].y as number;
            toX = tweens[1].x as number;
            toY = tweens[1].y as number;
            tweens[1].onComplete();
        });
        builder
            .move({
                fromX: card.getX(), 
                fromY: card.getY(),
                toX: card.getX() + 100, 
                toY: card.getY() + 100,
            })
            .play();
        expect(fromX).toBe(0);
        expect(fromY).toBe(0);
        expect(card.getX()).toBe(toX);
        expect(card.getY()).toBe(toY);
        expect(card.getOriginX()).toBe(toX);
        expect(card.getOriginY()).toBe(toY);
    });

    it("should expand the card.", () => {
        const builder = CardActionsBuilder.create(card);
        sceneMock.tweens.add = vi.fn().mockImplementation((config: ExpandConfig) => {
            if (config?.onComplete) config.onComplete();
        });
        builder
            .expand()
            .play();
        expect(card.getScaleX()).toBe(1.5);
        expect(card.getScaleY()).toBe(1.5);
        expect(card.getX()).toBe(card.getOriginX() - (card.getWidth() * 0.25));
        expect(card.getY()).toBe(card.getOriginY() - (card.getHeight() * 0.25));
    });

    it("should throw a color flash on the card.", () => {
        const builder = CardActionsBuilder.create(card);
        let visible = false;
        let color = 0;
        sceneMock.tweens.add = vi.fn().mockImplementation((config: FlashConfig) => {
            if (config?.onStart) config.onStart();
            visible = config.targets.visible;
            color = config.targets.fillColor;
        });
        builder
            .flash({ color: 0xff0000 })
            .play();
        expect(visible).toBe(true);
        expect(color).toBe(0xff0000);
    });

    it("should shrink the card.", () => {
        const builder = CardActionsBuilder.create(card);
        sceneMock.tweens.add = vi.fn().mockImplementation((config: ExpandConfig) => {
            if (config?.onComplete) config.onComplete();
        });
        builder
            .shrink()
            .play();
        expect(card.getScaleX()).toBe(0);
        expect(card.getScaleY()).toBe(0);
        expect(card.getX()).toBe(card.getOriginX() + (card.getWidth() / 2));
        expect(card.getY()).toBe(card.getOriginY() + (card.getHeight() / 2));
    });

    // should test play method
});
