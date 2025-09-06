import Phaser from "phaser";
import PhaserMock from "@mocks/phaser";
import CardBattleMock from "@mocks/cardset";
import { describe, it, expect, beforeAll } from "vitest";
import { Cardset } from "@game/ui/Cardset/Cardset";
import { Card } from "@game/ui/Card/Card";
import { BLUE } from "@game/constants/colors";
import { CardColors } from "@/game/types/CardColors";
import { BATTLE } from "@game/constants/keys";
import { CardType } from "@/game/types/CardType";

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
            id: '123e4567-e89b-12d3-a456-426614174000',
            number: 1,
            name: 'Test Card',
            description: 'This is a test card description.',
            details: 'This is a test card details.',
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
