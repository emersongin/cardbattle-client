import { Label, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import { CardPoints } from "../Card/types/CardPoints";
import { ColorsPoints } from "../../types";
import { DisplayUtil } from "../../utils/DisplayUtil";
import { StaticState, UpdatingState, WindowState } from "./WindowState";

export type BoardWindowConfig = {
    cardPoints: CardPoints,
    colorsPoints: ColorsPoints,
    numberOfCardsInHand: number,
    numberOfCardsInDeck: number,
    numberOfWins: number,
};

export default class BoardWindow extends Sizer {
    #tween: Phaser.Tweens.Tween | null = null;
    #status: WindowState;
    #reverse: boolean;
    #contentLabel: Label;
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

        this.#reverse = reverse;
        this.#status = new StaticState(this);
        this.#colorsPoints = config.colorsPoints;
        this.#battlePoints = config.cardPoints;
        this.#numberOfCardsInHand = config.numberOfCardsInHand;
        this.#numberOfCardsInDeck = config.numberOfCardsInDeck;
        this.#numberOfWins = config.numberOfWins;

        this.#createBackground(scene);
        this.#createContentLabel(scene, config);

        this.layout();
        this.setScale(1, 0);
        scene.add.existing(this);
    }

    #createBackground(scene: Phaser.Scene) {
        const background = scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x222222);
        this.addBackground(background);
    }

    #createContentLabel(scene: Phaser.Scene, config: BoardWindowConfig) {
        const contentLabel = scene.rexUI.add.label({
            text: scene.add.text(0, 0, this.createContent(config), {
                fontSize: '24px',
                color: '#ffffff'
            }),
            align: 'center'
        });
        this.add(contentLabel, { align: 'center', expand: false, padding: { top: 20, bottom: 20 } });
        this.#contentLabel = contentLabel;
    }

    setText(text: string) {
        this.#contentLabel.text = text;
        this.#contentLabel.layout();
    }

    createContent(config: BoardWindowConfig): string {
        const battlePoints = this.#createBattlePoints(config.cardPoints);
        const boardPoints = this.#createBoardPoints(
            config.colorsPoints, 
            config.numberOfCardsInHand, 
            config.numberOfCardsInDeck, 
            config.numberOfWins
        );
        return this.#reverse ? `${boardPoints}\n\n${battlePoints}` : `${battlePoints}\n\n${boardPoints}`;
    }

    #createBattlePoints(cardPoints: CardPoints): string {
        const ap = cardPoints.ap.toString().padStart(3, ' ');
        const hp = cardPoints.hp.toString().padStart(3, ' ');
        return `Ap:${ap} Hp:${hp}`;
    }

    #createBoardPoints(
        points: ColorsPoints, 
        numberOfCardsInHand: number, 
        numberOfCardsInDeck: number, 
        numberOfWins: number
    ): string {
        const colorsTag = [
            {
                color: 'Red',
                points: points.red
            },
            {
                color: 'Grn',
                points: points.green
            },
            {
                color: 'Blu',
                points: points.blue
            },
            {
                color: 'Wht',
                points: points.white
            },
            {
                color: 'Blk',
                points: points.black
            },
        ];
        const colorsPoints = colorsTag.map(color => {
            const points = color.points.toString().padStart(2, ' ');
            return `${color.color}:${points}`;
        }).join(' ');
        const hand = numberOfCardsInHand.toString().padStart(2, ' ');
        const deck = numberOfCardsInDeck.toString().padStart(2, ' ');
        const wins = numberOfWins.toString();
        const boardPoints = `Hand:${hand} Deck:${deck} Wins:${wins}`;
        return `${colorsPoints}          ${boardPoints}`;
    }

    static createBottom(scene: Phaser.Scene, config: BoardWindowConfig): BoardWindow {
        const width = scene.scale.width;
        const height = DisplayUtil.column1of12(scene.scale.height);
        const x = width / 2;
        const y = (scene.scale.height - height);
        return new BoardWindow(scene, x, y, width, height, config);
    }

    static createTopReverse(scene: Phaser.Scene, config: BoardWindowConfig): BoardWindow {
        const width = scene.scale.width;
        const height = DisplayUtil.column1of12(scene.scale.height);
        const x = width / 2;
        const y = height;
        return new BoardWindow(scene, x, y, width, height, config, true);
    }

    open() {
        this.#tween = this.scene.tweens.add({
            targets: this,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
        });
    }

    close() {
        this.#tween = this.scene.tweens.add({
            targets: this,
            scaleY: 0,
            duration: 300,
            ease: 'Back.easeIn',
        });
    }

    isBusy() {
        return this.#tween !== null && this.#tween.isPlaying();
    }

    changeState(state: WindowState, ...args: any[]): void {
        this.#status = state;
        this.#status.create(...args);
    }

    getAllData(): BoardWindowConfig {
        return {
            cardPoints: this.#battlePoints,
            colorsPoints: this.#colorsPoints,
            numberOfCardsInHand: this.#numberOfCardsInHand,
            numberOfCardsInDeck: this.#numberOfCardsInDeck,
            numberOfWins: this.#numberOfWins,
        };
    }

    setAp(ap: number) {
        this.#battlePoints.ap = ap;
    }

    setHp(hp: number) {
        this.#battlePoints.hp = hp;
    }

    setRedColorPoints(points: number) {
        this.#colorsPoints.red = points;
    }

    setGreenColorPoints(points: number) {
        this.#colorsPoints.green = points;
    }

    setBlueColorPoints(points: number) {
        this.#colorsPoints.blue = points;
    }

    setBlackColorPoints(points: number) {
        this.#colorsPoints.black = points;
    }

    setWhiteColorPoints(points: number) {
        this.#colorsPoints.white = points;
    }

    setNumberOfCardsInHand(count: number) {
        this.#numberOfCardsInHand = count;
    }

    setNumberOfCardsInDeck(count: number) {
        this.#numberOfCardsInDeck = count;
    }

    setNumberOfWins(count: number) {
        this.#numberOfWins = count;
    }

    preUpdate() {
        if (this.#status) this.#status.preUpdate();
    }

    updating(toTarget: BoardWindowConfig): void {
        if (!this.#status) return
        if (this.#status instanceof UpdatingState) {
            this.#status.addTweens(toTarget, 2000);
            return;
        }
        this.#status.updating(toTarget);
    }
}