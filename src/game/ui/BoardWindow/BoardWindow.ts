import { Label, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import { DisplayUtil } from "../../utils/DisplayUtil";
import { StaticState, UpdatingState, WindowState } from "./WindowState";
import { CardColors } from "../Card/Card";
import { BoardWindowData, MaybePartialBoardWindowData } from "@game/types/BoardWindowData";
import { BLACK, BLUE, GREEN, RED, WHITE } from "@game/constants/Colors";
import { DECK, HAND, TRASH, WINS } from "@/game/constants/Keys";

export type BoardZones = 
    | typeof HAND 
    | typeof DECK
    | typeof TRASH
    | typeof WINS;

export default class BoardWindow extends Sizer {
    #tween: Phaser.Tweens.Tween | null = null;
    #status: WindowState;
    #contentLabel: Label;

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
        this.#status = new StaticState(this);
        this.#setStartData(data, reverse);
        this.#createBackground();
        this.#createContentLabel(data);
        this.layout();
        this.setScale(1, 0);
        scene.add.existing(this);
    }

    #setStartData(data: BoardWindowData, reverse: boolean = false) {
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
        this.data.set('numberOfCardsInTrash', data.numberOfCardsInTrash);
        this.data.set('numberOfWins', data.numberOfWins);
        this.data.set('reverse', reverse);
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
            data.numberOfCardsInTrash, 
            data.numberOfWins
        );
        return this.data.get('reverse') ? `${boardPoints}\n\n${battlePoints}` : `${battlePoints}\n\n${boardPoints}`;
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
        numberOfCardsInTrash: number, 
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
        const trash = numberOfCardsInTrash.toString().padStart(2, ' ');
        const wins = numberOfWins.toString();
        const boardPoints = `Hnd:${hand} Dck:${deck} Trs:${trash} Win:${wins}`;
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

    open(onComplete?: () => void) {
        this.#tween = this.scene.tweens.add({
            targets: this,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                if (onComplete) onComplete();
            }
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
            ap: this.data.get('ap'),
            hp: this.data.get('hp'),
            redPoints: this.data.get('redPoints'),
            greenPoints: this.data.get('greenPoints'),
            bluePoints: this.data.get('bluePoints'),
            blackPoints: this.data.get('blackPoints'),
            whitePoints: this.data.get('whitePoints'),
            orangePoints: this.data.get('orangePoints'),
            numberOfCardsInHand: this.data.get('numberOfCardsInHand'),
            numberOfCardsInDeck: this.data.get('numberOfCardsInDeck'),
            numberOfCardsInTrash: this.data.get('numberOfCardsInTrash'),
            numberOfWins: this.data.get('numberOfWins'),
        };
    }

    preUpdate() {
        if (this.#status) this.#status.preUpdate();
    }

    addZonePoints(boardZone: BoardZones, value: number): void {
        this.data.set('numberOfCardsInHand', this.data.get('numberOfCardsInHand') + (boardZone === HAND ? value : 0));
        this.data.set('numberOfCardsInDeck', this.data.get('numberOfCardsInDeck') + (boardZone === DECK ? value : 0));
        this.data.set('numberOfCardsInTrash', this.data.get('numberOfCardsInTrash') + (boardZone === TRASH ? value : 0));
        this.data.set('numberOfWins', this.data.get('numberOfWins') + (boardZone === WINS ? value : 0));
        let boardPoints = {
            numberOfCardsInHand: this.data.get('numberOfCardsInHand'),
            numberOfCardsInDeck: this.data.get('numberOfCardsInDeck'),
            numberOfCardsInTrash: this.data.get('numberOfCardsInTrash'),
            numberOfWins: this.data.get('numberOfWins'),
        } as MaybePartialBoardWindowData;
        this.#updating(boardPoints);
    }

    removeZonePoints(boardZone: BoardZones, value: number): void {
        this.data.set('numberOfCardsInHand', this.data.get('numberOfCardsInHand') - (boardZone === HAND ? value : 0));
        this.data.set('numberOfCardsInDeck', this.data.get('numberOfCardsInDeck') - (boardZone === DECK ? value : 0));
        this.data.set('numberOfCardsInTrash', this.data.get('numberOfCardsInTrash') - (boardZone === TRASH ? value : 0));
        this.data.set('numberOfWins', this.data.get('numberOfWins') - (boardZone === WINS ? value : 0));
        let boardPoints = {
            numberOfCardsInHand: this.data.get('numberOfCardsInHand'),
            numberOfCardsInDeck: this.data.get('numberOfCardsInDeck'),
            numberOfCardsInTrash: this.data.get('numberOfCardsInTrash'),
            numberOfWins: this.data.get('numberOfWins'),
        } as MaybePartialBoardWindowData;
        this.#updating(boardPoints);
    }

    addColorPoints(cardColor: CardColors, value: number): void {
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

    removeColorPoints(cardColor: CardColors, value: number): void {
        this.data.set('redPoints', this.data.get('redPoints') - (cardColor === RED ? value : 0));
        this.data.set('greenPoints', this.data.get('greenPoints') - (cardColor === GREEN ? value : 0));
        this.data.set('bluePoints', this.data.get('bluePoints') - (cardColor === BLUE ? value : 0));
        this.data.set('blackPoints', this.data.get('blackPoints') - (cardColor === BLACK ? value : 0));
        this.data.set('whitePoints', this.data.get('whitePoints') - (cardColor === WHITE ? value : 0));
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
            ap: toTarget.ap ?? this.data.get('ap'),
            hp: toTarget.hp ?? this.data.get('hp'),
            redPoints: toTarget.redPoints ?? this.data.get('redPoints'),
            greenPoints: toTarget.greenPoints ?? this.data.get('greenPoints'),
            bluePoints: toTarget.bluePoints ?? this.data.get('bluePoints'),
            blackPoints: toTarget.blackPoints ?? this.data.get('blackPoints'),
            whitePoints: toTarget.whitePoints ?? this.data.get('whitePoints'),
            orangePoints: toTarget.orangePoints ?? this.data.get('orangePoints'),
            numberOfCardsInHand: toTarget.numberOfCardsInHand ?? this.data.get('numberOfCardsInHand'),
            numberOfCardsInDeck: toTarget.numberOfCardsInDeck ?? this.data.get('numberOfCardsInDeck'),
            numberOfCardsInTrash: toTarget.numberOfCardsInTrash ?? this.data.get('numberOfCardsInTrash'),
            numberOfWins: toTarget.numberOfWins ?? this.data.get('numberOfWins'),
        };
        if (this.#status instanceof UpdatingState) {
            this.#status.addTweens(boardWindowData);
            return;
        }
        this.#status.updating(boardWindowData);
    }
}