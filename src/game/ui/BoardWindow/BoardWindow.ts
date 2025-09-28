import { Label, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import { BLACK, BLUE, GREEN, RED, WHITE } from "@constants/colors";
import { AP, DECK, HAND, HP, PASS, TRASH, WINS } from "@constants/keys";
import { BoardWindowData } from "@objects/BoardWindowData";
import { DisplayUtil } from "@utils/DisplayUtil";
import { BoardZonesType } from "@game/types/BoardZonesType";
import { CardColorsType } from "@game/types/CardColorsType";
import { TweenConfig } from "@game/types/TweenConfig";
import { UpdateAnimation } from "@ui/BoardWindow/animations/UpdateAnimation";

export class BoardWindow extends Sizer {
    #contentLabel: Label;

    private constructor(
        readonly scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        data: BoardWindowData,
        color: number = 0x222222,
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
        this.#setStartData(data, reverse);
        this.#createBackground(color);
        this.#createContentLabel(data);
        this.layout();
        this.setScale(1, 0);
        scene.add.existing(this);
    }

    #setStartData(data: BoardWindowData, reverse: boolean = false) {
        this.setDataEnabled();
        this.data.set('ap', data[AP] ?? 0);
        this.data.set('hp', data[HP] ?? 0);
        this.data.set('redPoints', data[RED] ?? 0);
        this.data.set('greenPoints', data[GREEN] ?? 0);
        this.data.set('bluePoints', data[BLUE] ?? 0);
        this.data.set('blackPoints', data[BLACK] ?? 0);
        this.data.set('whitePoints', data[WHITE] ?? 0);
        this.data.set('numberOfCardsInHand', data[HAND] ?? 0);
        this.data.set('numberOfCardsInDeck', data[DECK] ?? 0);
        this.data.set('numberOfCardsInTrash', data[TRASH] ?? 0);
        this.data.set('numberOfWins', data[WINS] ?? 0);
        this.data.set('reverse', reverse ?? false);
        this.data.set('pass', data[PASS] ?? false);
    }

    #createBackground(color: number) {
        const background = this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, color);
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
        const battlePoints = this.#createBattlePoints(data[AP], data[HP], data[PASS]);
        const boardPoints = this.#createBoardPoints(
            data[RED],
            data[GREEN],
            data[BLUE],
            data[BLACK],
            data[WHITE],
            data[HAND], 
            data[DECK],
            data[TRASH], 
            data[WINS]
        );
        return this.#getData('reverse') ? `${boardPoints}\n\n${battlePoints}` : `${battlePoints}\n\n${boardPoints}`;
    }

    #getData(prop: string): any {
        return this.data.get(prop);
    }

    #createBattlePoints(ap: number, hp: number, pass: boolean): string {
        const apText = ap.toString().padStart(3, ' ');
        const hpText = hp.toString().padStart(3, ' ');
        const passText = pass ? ' '.repeat(50).concat('PASS') : '';
        return `Ap:${apText} Hp:${hpText} ${passText}`;
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

    static createBottom(scene: Phaser.Scene, config: BoardWindowData, color: number): BoardWindow {
        const width = scene.scale.width;
        const height = DisplayUtil.column1of12(scene.scale.height);
        const x = width / 2;
        const y = (scene.scale.height - height);
        return new BoardWindow(scene, x, y, width, height, config, color);
    }

    static createTopReverse(scene: Phaser.Scene, config: BoardWindowData, color: number): BoardWindow {
        const width = scene.scale.width;
        const height = DisplayUtil.column1of12(scene.scale.height);
        const x = width / 2;
        const y = height;
        return new BoardWindow(scene, x, y, width, height, config, color, true);
    }

    open(config?: TweenConfig) {
        this.scene.tweens.add({
            targets: this,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                if (config?.onComplete) config.onComplete();
            }
        });
    }

    close(config?: TweenConfig) {
        this.scene.tweens.add({
            targets: this,
            scaleY: 0,
            duration: 300,
            ease: 'Back.easeIn',
            onComplete: () => {
                if (config?.onComplete) config.onComplete();
                this.destroy();
            }
        });
    }

    getAllData(): BoardWindowData {
        return {
            [AP]: this.#getData('ap'),
            [HP]: this.#getData('hp'),
            [RED]: this.#getData('redPoints'),
            [GREEN]: this.#getData('greenPoints'),
            [BLUE]: this.#getData('bluePoints'),
            [BLACK]: this.#getData('blackPoints'),
            [WHITE]: this.#getData('whitePoints'),
            [HAND]: this.#getData('numberOfCardsInHand'),
            [DECK]: this.#getData('numberOfCardsInDeck'),
            [TRASH]: this.#getData('numberOfCardsInTrash'),
            [WINS]: this.#getData('numberOfWins'),
            [PASS]: this.#getData('pass'),
        };
    }

    getZonePointsByZone(boardZone: BoardZonesType): number {
        if (boardZone === HAND) return this.#getData('numberOfCardsInHand');
        if (boardZone === DECK) return this.#getData('numberOfCardsInDeck');
        if (boardZone === TRASH) return this.#getData('numberOfCardsInTrash');
        if (boardZone === WINS) return this.#getData('numberOfWins');
        return 0;
    }

    hasEnoughColorPointsByColor(cardColor: CardColorsType, cost: number): boolean {
        if (cardColor === RED) return this.#getColorPointsByColor(cardColor) - cost >= 0;
        if (cardColor === GREEN) return this.#getColorPointsByColor(cardColor) - cost >= 0;
        if (cardColor === BLUE) return this.#getColorPointsByColor(cardColor) - cost >= 0;
        if (cardColor === BLACK) return this.#getColorPointsByColor(cardColor) - cost >= 0;
        if (cardColor === WHITE) return this.#getColorPointsByColor(cardColor) - cost >= 0;
        return false;
    }

    #getColorPointsByColor(cardColor: CardColorsType): number {
        if (cardColor === RED) return this.#getData('redPoints');
        if (cardColor === GREEN) return this.#getData('greenPoints');
        if (cardColor === BLUE) return this.#getData('bluePoints');
        if (cardColor === BLACK) return this.#getData('blackPoints');
        if (cardColor === WHITE) return this.#getData('whitePoints');
        return 0;
    }

    setBattlePointsWithDuration(attackPoints: number, healthPoints: number, onComplete?: () => void): void {
        const fromTarget = {
            [AP]: this.#getData('ap'),
            [HP]: this.#getData('hp'),
        } as Partial<BoardWindowData>;
        const toTarget = {
            [AP]: attackPoints,
            [HP]: healthPoints,
        } as Partial<BoardWindowData>;
        this.#updating(fromTarget, toTarget, 1000, onComplete);
        this.data.set('ap', attackPoints);
        this.data.set('hp', healthPoints);
    }

    addZonePoints(boardZone: BoardZonesType, value: number): void {
        const lastValue = this.getZonePointsByZone(boardZone);
        this.#setZonePoints(boardZone, (lastValue + value));
    }

    removeZonePoints(boardZone: BoardZonesType, value: number): void {
        const lastValue = this.getZonePointsByZone(boardZone);
        this.#setZonePoints(boardZone, (lastValue - value));
    }

    #setZonePoints(boardZone: BoardZonesType, value: number): void {
        const fromTarget = {} as Partial<BoardWindowData>;
        const toTarget = {} as Partial<BoardWindowData>;
        if (boardZone === HAND) {
            fromTarget[HAND] = this.#getData('numberOfCardsInHand');
            toTarget[HAND] = value
        }
        if (boardZone === DECK) {
            fromTarget[DECK] = this.#getData('numberOfCardsInDeck');
            toTarget[DECK] = value
        }
        if (boardZone === TRASH) {
            fromTarget[TRASH] = this.#getData('numberOfCardsInTrash');
            toTarget[TRASH] = value
        }
        if (boardZone === WINS) {
            fromTarget[WINS] = this.#getData('numberOfWins');
            toTarget[WINS] = value
        }
        this.#updating(fromTarget, toTarget);
        if (boardZone === HAND) this.data.set('numberOfCardsInHand', value);
        if (boardZone === DECK) this.data.set('numberOfCardsInDeck', value);
        if (boardZone === TRASH) this.data.set('numberOfCardsInTrash', value);
        if (boardZone === WINS) this.data.set('numberOfWins', value);
    }

    addColorPoints(cardColor: CardColorsType, value: number): void {
        const lastValue = this.#getColorPointsByColor(cardColor);
        this.#setColorPoints(cardColor, (lastValue + value));
    }

    removeColorPoints(cardColor: CardColorsType, value: number): void {
        const lastValue = this.#getColorPointsByColor(cardColor);
        this.#setColorPoints(cardColor, (lastValue - value));
    }

    #setColorPoints(cardColor: CardColorsType, value: number): void {
        const fromTarget = {} as Partial<BoardWindowData>;
        const toTarget = {} as Partial<BoardWindowData>;
        if (cardColor === RED) {
            fromTarget[RED] = this.#getData('redPoints');
            toTarget[RED] = value;
        }
        if (cardColor === GREEN) {
            fromTarget[GREEN] = this.#getData('greenPoints');
            toTarget[GREEN] = value;
        }
        if (cardColor === BLUE) {
            fromTarget[BLUE] = this.#getData('bluePoints');
            toTarget[BLUE] = value;
        }
        if (cardColor === BLACK) {
            fromTarget[BLACK] = this.#getData('blackPoints');
            toTarget[BLACK] = value;
        }
        if (cardColor === WHITE) {
            fromTarget[WHITE] = this.#getData('whitePoints');
            toTarget[WHITE] = value;
        }
        this.#updating(fromTarget, toTarget);
        if (cardColor === RED) this.data.set('redPoints', value);
        if (cardColor === GREEN) this.data.set('greenPoints', value);
        if (cardColor === BLUE) this.data.set('bluePoints', value);
        if (cardColor === BLACK) this.data.set('blackPoints', value);
        if (cardColor === WHITE) this.data.set('whitePoints', value);
    }

    setPass(pass: boolean): void {
        const fromTarget = {} as Partial<BoardWindowData>;
        const toTarget = {} as Partial<BoardWindowData>;
        fromTarget[PASS] = this.#getData('pass');
        toTarget[PASS] = pass;
        this.#updating(fromTarget, toTarget);
        this.data.set('pass', pass);
    }

    #updating(
        fromTarget: Partial<BoardWindowData>, 
        toTarget: Partial<BoardWindowData>, 
        duration: number = 0,
        onComplete?: () => void
    ): void {
        const fromTargetMerged = {
            [AP]: fromTarget[AP] ?? this.#getData('ap'),
            [HP]: fromTarget[HP] ?? this.#getData('hp'),
            [RED]: fromTarget[RED] ?? this.#getData('redPoints'),
            [GREEN]: fromTarget[GREEN] ?? this.#getData('greenPoints'),
            [BLUE]: fromTarget[BLUE] ?? this.#getData('bluePoints'),
            [BLACK]: fromTarget[BLACK] ?? this.#getData('blackPoints'),
            [WHITE]: fromTarget[WHITE] ?? this.#getData('whitePoints'),
            [HAND]: fromTarget[HAND] ?? this.#getData('numberOfCardsInHand'),
            [DECK]: fromTarget[DECK] ?? this.#getData('numberOfCardsInDeck'),
            [TRASH]: fromTarget[TRASH] ?? this.#getData('numberOfCardsInTrash'),
            [WINS]: fromTarget[WINS] ?? this.#getData('numberOfWins'),
            [PASS]: fromTarget[PASS] ?? this.#getData('pass'),
        }
        const toTargetMerged = {
            [AP]: toTarget[AP] ?? this.#getData('ap'),
            [HP]: toTarget[HP] ?? this.#getData('hp'),
            [RED]: toTarget[RED] ?? this.#getData('redPoints'),
            [GREEN]: toTarget[GREEN] ?? this.#getData('greenPoints'),
            [BLUE]: toTarget[BLUE] ?? this.#getData('bluePoints'),
            [BLACK]: toTarget[BLACK] ?? this.#getData('blackPoints'),
            [WHITE]: toTarget[WHITE] ?? this.#getData('whitePoints'),
            [HAND]: toTarget[HAND] ?? this.#getData('numberOfCardsInHand'),
            [DECK]: toTarget[DECK] ?? this.#getData('numberOfCardsInDeck'),
            [TRASH]: toTarget[TRASH] ?? this.#getData('numberOfCardsInTrash'),
            [WINS]: toTarget[WINS] ?? this.#getData('numberOfWins'),
            [PASS]: toTarget[PASS] ?? this.#getData('pass'),
        };
        new UpdateAnimation(this, { 
            fromTarget: fromTargetMerged, 
            toTarget: toTargetMerged, 
            duration,
            onComplete
        });
    }
}