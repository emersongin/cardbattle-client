import { describe, it, expect, beforeAll } from "vitest";
import { Card } from "@ui/Card/Card";
import { CardColors } from "@/game/ui/Card/CardColors";
import { CardType } from "@/game/ui/Card/CardType";
import Phaser from "@mocks/phaser";

describe("MockScene", () => {
    let scene: Phaser.Scene;

    beforeAll(() => {
        scene = new Phaser.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        });
    });

    it("deve criar uma cena mock com tweens", () => {
        const card = new Card(scene, {
            UUID: '123e4567-e89b-12d3-a456-426614174000',
            number: 1,
            name: 'Test Card',
            description: 'This is a test card description.',
            color: 'blue' as CardColors,
            imageName: 'card-picture',
            hp: 10,
            ap: 5,
            typeId: 'battle' as CardType,
            powerId: 'none',
            cost: 2
        });
        expect(card).toBeDefined();
    });
});
