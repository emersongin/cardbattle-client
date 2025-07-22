import { Label, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import { CardPoints } from "../Card/types/CardPoints";
import { ColorsPoints } from "../../types";
import { DisplayUtil } from "../../utils/DisplayUtil";
import { StaticState, UpdatingState, WindowState } from "./WindowState";
import { CardColors } from "../Card/Card";
import { BoardWindowData, MaybePartialBoardWindowData } from "@/game/types/BoardWindowData";
import { BLACK, BLUE, GREEN, ORANGE, RED, WHITE } from "@/game/constants/Colors";

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
        data: BoardWindowData,
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
        this.#colorsPoints = {
            [RED]: data.redPoints,
            [GREEN]: data.greenPoints,
            [BLUE]: data.bluePoints,
            [BLACK]: data.blackPoints,
            [WHITE]: data.whitePoints,
            [ORANGE]: data.orangePoints,
        };
        this.#battlePoints = {
            ap: data.ap,
            hp: data.hp,
        };
        this.#numberOfCardsInHand = data.numberOfCardsInHand;
        this.#numberOfCardsInDeck = data.numberOfCardsInDeck;
        this.#numberOfWins = data.numberOfWins;

        this.#setStartData(data);
        this.#createBackground();
        this.#createContentLabel(data);

        this.layout();
        this.setScale(1, 0);
        scene.add.existing(this);
    }

    #setStartData(data: BoardWindowData) {
        this.setDataEnabled();
        this.data.set('ap', data.ap);
        this.data.set('hp', data.hp);
        this.data.set('redPoints', data.redPoints);
        this.data.set('greenPoints', data.greenPoints);
        this.data.set('bluePoints', data.bluePoints);
        this.data.set('blackPoints', data.blackPoints);
        this.data.set('whitePoints', data.whitePoints);
        this.data.set('numberOfCardsInHand', data.numberOfCardsInHand);
        this.data.set('numberOfCardsInDeck', data.numberOfCardsInDeck);
        this.data.set('numberOfWins', data.numberOfWins);
    }

    #createBackground() {
        const background = this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x222222);
        this.addBackground(background);
    }

    #createContentLabel(config: BoardWindowData) {
        const contentLabel = this.scene.rexUI.add.label({
            text: this.scene.add.text(0, 0, this.createContent(config), {
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

    createContent(data: BoardWindowData): string {
        const battlePoints = this.#createBattlePoints(data.ap, data.hp);
        const boardPoints = this.#createBoardPoints(
            data.redPoints,
            data.greenPoints,
            data.bluePoints,
            data.blackPoints,
            data.whitePoints,
            data.numberOfCardsInHand, 
            data.numberOfCardsInDeck, 
            data.numberOfWins
        );
        return this.#reverse ? `${boardPoints}\n\n${battlePoints}` : `${battlePoints}\n\n${boardPoints}`;
    }

    #createBattlePoints(ap: number, hp: number): string {
        const apText = ap.toString().padStart(3, ' ');
        const hpText = hp.toString().padStart(3, ' ');
        return `Ap:${apText} Hp:${hpText}`;
    }

    #createBoardPoints(
        redPoints: number,
        greenPoints: number,
        bluePoints: number,
        blackPoints: number,
        whitePoints: number, 
        numberOfCardsInHand: number, 
        numberOfCardsInDeck: number, 
        numberOfWins: number
    ): string {
        const colorsTag = [
            {
                color: 'Red',
                points: redPoints
            },
            {
                color: 'Grn',
                points: greenPoints
            },
            {
                color: 'Blu',
                points: bluePoints
            },
            {
                color: 'Wht',
                points: whitePoints
            },
            {
                color: 'Blk',
                points: blackPoints
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

    static createBottom(scene: Phaser.Scene, config: BoardWindowData): BoardWindow {
        const width = scene.scale.width;
        const height = DisplayUtil.column1of12(scene.scale.height);
        const x = width / 2;
        const y = (scene.scale.height - height);
        return new BoardWindow(scene, x, y, width, height, config);
    }

    static createTopReverse(scene: Phaser.Scene, config: BoardWindowData): BoardWindow {
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

    getAllData(): BoardWindowData {
        return {
            ap: this.#battlePoints.ap,
            hp: this.#battlePoints.hp,
            redPoints: this.#colorsPoints[RED],
            greenPoints: this.#colorsPoints[GREEN],
            bluePoints: this.#colorsPoints[BLUE],
            blackPoints: this.#colorsPoints[BLACK],
            whitePoints: this.#colorsPoints[WHITE],
            orangePoints: this.#colorsPoints[ORANGE],
            numberOfCardsInHand: this.#numberOfCardsInHand,
            numberOfCardsInDeck: this.#numberOfCardsInDeck,
            numberOfWins: this.#numberOfWins,
        };
    }

    getColorsPoints(): ColorsPoints {
        return this.#colorsPoints;
    }

    setAp(ap: number) {
        this.#battlePoints.ap = ap;
    }

    setHp(hp: number) {
        this.#battlePoints.hp = hp;
    }

    setRedColorPoints(points: number) {
        this.#colorsPoints[RED] = points;
    }

    setGreenColorPoints(points: number) {
        this.#colorsPoints[GREEN]= points;
    }

    setBlueColorPoints(points: number) {
        this.#colorsPoints[BLUE] = points;
    }

    setBlackColorPoints(points: number) {
        this.#colorsPoints[BLACK] = points;
    }

    setWhiteColorPoints(points: number) {
        this.#colorsPoints[WHITE] = points;
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

    updateColorsPoints(cardColor: CardColors, value: number): void {
        this.data.set('redPoints', this.data.get('redPoints') + (cardColor === RED ? value : 0));
        this.data.set('greenPoints', this.data.get('greenPoints') + (cardColor === GREEN ? value : 0));
        this.data.set('bluePoints', this.data.get('bluePoints') + (cardColor === BLUE ? value : 0));
        this.data.set('blackPoints', this.data.get('blackPoints') + (cardColor === BLACK ? value : 0));
        this.data.set('whitePoints', this.data.get('whitePoints') + (cardColor === WHITE ? value : 0));
        let colorsPoints = {
            redPoints: this.data.get('redPoints'),
            greenPoints: this.data.get('greenPoints'),
            bluePoints: this.data.get('bluePoints'),
            blackPoints: this.data.get('blackPoints'),
            whitePoints: this.data.get('whitePoints'),
        } as MaybePartialBoardWindowData;
        this.#updating(colorsPoints);
    }

    #updating(toTarget: MaybePartialBoardWindowData): void {
        if (!this.#status) return
        const boardWindowData = {
            ap: toTarget.ap ?? this.#battlePoints.ap,
            hp: toTarget.hp ?? this.#battlePoints.hp,
            redPoints: toTarget.redPoints ?? this.#colorsPoints[RED],
            greenPoints: toTarget.greenPoints ?? this.#colorsPoints[GREEN],
            bluePoints: toTarget.bluePoints ?? this.#colorsPoints[BLUE],
            blackPoints: toTarget.blackPoints ?? this.#colorsPoints[BLACK],
            whitePoints: toTarget.whitePoints ?? this.#colorsPoints[WHITE],
            orangePoints: toTarget.orangePoints ?? this.#colorsPoints[ORANGE],
            numberOfCardsInHand: toTarget.numberOfCardsInHand ?? this.#numberOfCardsInHand,
            numberOfCardsInDeck: toTarget.numberOfCardsInDeck ?? this.#numberOfCardsInDeck,
            numberOfWins: toTarget.numberOfWins ?? this.#numberOfWins,
        };
        if (this.#status instanceof UpdatingState) {
            this.#status.addTweens(boardWindowData);
            return;
        }
        this.#status.updating(boardWindowData);
    }
}