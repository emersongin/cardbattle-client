import { describe, it, expect, beforeAll } from "vitest";
import { Card, CardColors, CardType } from "@ui/Card/Card";
import { Cardset } from "@game/ui/Cardset/Cardset";
import { BLUE } from "@game/constants/Colors";
import { BATTLE } from "@game/constants/CardTypes";
import Phaser from "phaser";
import PhaserMock from "@mocks/phaser";
import CardBattleMock from "@mocks/cardset";

describe("MockScene", () => {
    let scene: Phaser.Scene;
    let cardset: Cardset;

    beforeAll(() => {
        scene = new PhaserMock.Scene({
            key: "MockScene",
            active: true,
            visible: true,
        });
        cardset = new CardBattleMock.Cardset(scene, [], 0, 0);
    });

    it("deve criar uma cena mock com tweens", () => {
        const card = new Card(scene, cardset, {
            UUID: '123e4567-e89b-12d3-a456-426614174000',
            number: 1,
            name: 'Test Card',
            description: 'This is a test card description.',
            color: BLUE as CardColors,
            imageName: 'card-picture',
            hp: 10,
            ap: 5,
            typeId: BATTLE as CardType,
            powerId: 'none',
            cost: 2
        });
        expect(card).toBeDefined();
    });
});
