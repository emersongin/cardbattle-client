import { Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import { CardPoints } from "./Card/types/CardPoints";
import { ColorsPoints } from "../types";
import { DisplayUtil } from "../utils/DisplayUtil";

type BoardWindowConfig = {
    cardPoints: CardPoints,
    colorsPoints: ColorsPoints,
    numberOfCardsInHand: number,
    numberOfCardsInDeck: number,
    numberOfWins: number,
};

export default class BoardWindow extends Sizer {
    #colorsPoints: ColorsPoints;
    #battlePoints: CardPoints;
    #numberOfCardsInHand: number;
    #numberOfCardsInDeck: number;
    #numberOfWins: number;

    private constructor(
        readonly scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        config: BoardWindowConfig,
        reverse: boolean = false
    ) {
        const vertical = 1;
        super(scene, {
            x,
            y,
            width,
            height,
            orientation: vertical,
        });

        this.#colorsPoints = config.colorsPoints;
        this.#battlePoints = config.cardPoints;
        this.#numberOfCardsInHand = config.numberOfCardsInHand;
        this.#numberOfCardsInDeck = config.numberOfCardsInDeck;
        this.#numberOfWins = config.numberOfWins;

        this.#createBackground(scene);
        this.#createContent(scene, reverse);
        this.layout();
        scene.add.existing(this);
    }

    #createBackground(scene: Phaser.Scene) {
        const background = scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x222222);
        this.addBackground(background);
    }

    #createContent(scene: Phaser.Scene, reverse: boolean = false) {
        const battlePoints = this.#createBattlePoints();
        const boardPoints = this.#createBoardPoints();
        const content = reverse ? `${boardPoints}\n\n${battlePoints}` : `${battlePoints}\n\n${boardPoints}`;
        const contentLabel = scene.rexUI.add.label({
            text: scene.add.text(0, 0, content, {
                fontSize: '24px',
                color: '#ffffff'
            }),
            align: 'center'
        });
        this.add(contentLabel, { align: 'center', expand: false, padding: { top: 20, bottom: 20 } });
    }

    #createBattlePoints(): string {
        const ap = this.#battlePoints.ap.toString().padStart(3, ' ');
        const hp = this.#battlePoints.hp.toString().padStart(3, ' ');
        return `Ap:${ap} Hp:${hp}`;
    }

    #createBoardPoints(): string {
        const colorsTag = [
            {
                color: 'Red',
                points: this.#colorsPoints.red
            },
            {
                color: 'Grn',
                points: this.#colorsPoints.green
            },
            {
                color: 'Blu',
                points: this.#colorsPoints.blue
            },
            {
                color: 'Wht',
                points: this.#colorsPoints.white
            },
            {
                color: 'Blk',
                points: this.#colorsPoints.black
            },
        ];
        const colorsPoints = colorsTag.map(color => {
            const points = color.points.toString().padStart(2, ' ');
            return `${color.color}:${points}`;
        }).join(' ');
        const hand = this.#numberOfCardsInHand.toString().padStart(2, ' ');
        const deck = this.#numberOfCardsInDeck.toString().padStart(2, ' ');
        const wins = this.#numberOfWins.toString();
        const boardPoints = `Hand:${hand} Deck:${deck} Wins:${wins}`;
        return `${colorsPoints} - ${boardPoints}`;
    }

    static createCentered(scene: Phaser.Scene, config: BoardWindowConfig, reverse: boolean = false): BoardWindow {
        const width = scene.scale.width;
        const height = DisplayUtil.column1of12(scene.scale.height);
        const x = width / 2;
        const y = scene.scale.height / 2;
        return new BoardWindow(scene, x, y, width, height, config, reverse);
    }

    open() {
        this.scene.add.existing(this);
        this.setVisible(true);
    }
}