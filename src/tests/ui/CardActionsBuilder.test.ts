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

    it("should close the card.", () => {
        const builder = CardActionsBuilder.create(card);
        const cardX = card.getX();
        const cardWidth = card.getWidth();
        let scaleX = 0;
        let ease = '';
        let delay = 0;
        let duration = 0;
        sceneMock.tweens.add = vi.fn().mockImplementation((config) => {
            scaleX = config.scaleX as number;
            ease = config.ease as string;
            delay = config.delay as number;
            duration = config.duration as number;
            config?.onComplete();
        });
        builder
            .close()
            .play();
        expect(card.getX()).toBe(cardX + (cardWidth / 2));
        expect(card.isClosed()).toBe(true);
        expect(scaleX).toBe(0);
        expect(ease).toBe('Linear');
        expect(delay).toBe(0);
        expect(duration).toBe(100);
    });

    it("should open the card.", () => {
        const cardOriginX = card.getX();
        card.setClosed();
        const builder = CardActionsBuilder.create(card);
        let scaleX = 0;
        let ease = '';
        let delay = 0;
        let duration = 0;
        sceneMock.tweens.add = vi.fn().mockImplementation((config) => {
            console.log(config.onComplete);
            scaleX = config.scaleX as number;
            ease = config.ease as string;
            delay = config.delay as number;
            duration = config.duration as number;
            config.onComplete();
        });
        builder
            .open()
            .play();
        expect(card.getX()).toBe(cardOriginX);
        expect(card.isOpened()).toBe(true);
        expect(scaleX).toBe(1);
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
        sceneMock.tweens.chain = vi.fn().mockImplementation((config) => {
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
});
