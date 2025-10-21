import { Label, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import { BLACK, BLUE, GREEN, RED, WHITE } from "@constants/colors";
import { AP, DECK, HAND, HP, PASS, REVERSE, TRASH, WINS } from "@constants/keys";
import { BoardWindowData } from "@objects/BoardWindowData";
import { DisplayUtil } from "@utils/DisplayUtil";
import { BoardZonesType } from "@game/types/BoardZonesType";
import { CardColorType } from "@game/types/CardColorType";
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
        this.data.set(AP, data[AP] ?? 0);
        this.data.set(HP, data[HP] ?? 0);
        this.data.set(RED, data[RED] ?? 0);
        this.data.set(GREEN, data[GREEN] ?? 0);
        this.data.set(BLUE, data[BLUE] ?? 0);
        this.data.set(BLACK, data[BLACK] ?? 0);
        this.data.set(WHITE, data[WHITE] ?? 0);
        this.data.set(HAND, data[HAND] ?? 0);
        this.data.set(DECK, data[DECK] ?? 0);
        this.data.set(TRASH, data[TRASH] ?? 0);
        this.data.set(WINS, data[WINS] ?? 0);
        this.data.set(REVERSE, reverse ?? false);
        this.data.set(PASS, data[PASS] ?? false);
    }

    #createBackground(color: number) {
        const background = this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, color);
        this.addBackground(background);
    }

    #createContentLabel(config: BoardWindowData) { console.log(this.#createContent);
        const contentLabel = this.scene.rexUI.add.label({
            text: this.scene.add.text(0, 0, this.#createContent(config), {
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
    }

    #createContent(data: BoardWindowData): string {
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
        return this.#getData(REVERSE) ? `${boardPoints}\n\n${battlePoints}` : `${battlePoints}\n\n${boardPoints}`;
    }

    #getData(prop: string): any {
        return this.data.get(prop);
    }

    #createBattlePoints(ap: number, hp: number, pass: boolean): string {
        const apText = ap.toString().padStart(3, ' ');
        const hpText = hp.toString().padStart(3, ' ');
        const passText = pass ? ' '.repeat(50).concat(PASS) : '';
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
            [AP]: this.#getData(AP),
            [HP]: this.#getData(HP),
            [RED]: this.#getData(RED),
            [GREEN]: this.#getData(GREEN),
            [BLUE]: this.#getData(BLUE),
            [BLACK]: this.#getData(BLACK),
            [WHITE]: this.#getData(WHITE),
            [HAND]: this.#getData(HAND),
            [DECK]: this.#getData(DECK),
            [TRASH]: this.#getData(TRASH),
            [WINS]: this.#getData(WINS),
            [PASS]: this.#getData(PASS),
        };
    }

    getZonePointsByZone(boardZone: BoardZonesType): number {
        if (boardZone === HAND) return this.#getData(HAND);
        if (boardZone === DECK) return this.#getData(DECK);
        if (boardZone === TRASH) return this.#getData(TRASH);
        if (boardZone === WINS) return this.#getData(WINS);
        return 0;
    }

    hasEnoughColorPointsByColor(cardColor: CardColorType, cost: number): boolean {
        if (cardColor === RED) return this.#getColorPointsByColor(cardColor) - cost >= 0;
        if (cardColor === GREEN) return this.#getColorPointsByColor(cardColor) - cost >= 0;
        if (cardColor === BLUE) return this.#getColorPointsByColor(cardColor) - cost >= 0;
        if (cardColor === BLACK) return this.#getColorPointsByColor(cardColor) - cost >= 0;
        if (cardColor === WHITE) return this.#getColorPointsByColor(cardColor) - cost >= 0;
        return false;
    }

    #getColorPointsByColor(cardColor: CardColorType): number {
        if (cardColor === RED) return this.#getData(RED);
        if (cardColor === GREEN) return this.#getData(GREEN);
        if (cardColor === BLUE) return this.#getData(BLUE);
        if (cardColor === BLACK) return this.#getData(BLACK);
        if (cardColor === WHITE) return this.#getData(WHITE);
        return 0;
    }

    setBattlePoints(attackPoints: number, healthPoints: number): void {
        this.data.set(AP, attackPoints);
        this.data.set(HP, healthPoints);
        const fromTarget = this.getAllData();
        const content = this.#createContent(fromTarget);
        this.setText(content);
    }

    setBattlePointsWithDuration(attackPoints: number, healthPoints: number, onComplete?: () => void): void {
        const fromTarget = {
            [AP]: this.#getData(AP),
            [HP]: this.#getData(HP),
        } as Partial<BoardWindowData>;
        const toTarget = {
            [AP]: attackPoints,
            [HP]: healthPoints,
        } as Partial<BoardWindowData>;
        this.#updating(fromTarget, toTarget, 1000, onComplete);
        this.data.set(AP, attackPoints);
        this.data.set(HP, healthPoints);
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
            fromTarget[HAND] = this.#getData(HAND);
            toTarget[HAND] = value
        }
        if (boardZone === DECK) {
            fromTarget[DECK] = this.#getData(DECK);
            toTarget[DECK] = value
        }
        if (boardZone === TRASH) {
            fromTarget[TRASH] = this.#getData(TRASH);
            toTarget[TRASH] = value
        }
        if (boardZone === WINS) {
            fromTarget[WINS] = this.#getData(WINS);
            toTarget[WINS] = value
        }
        this.#updating(fromTarget, toTarget);
        if (boardZone === HAND) this.data.set(HAND, value);
        if (boardZone === DECK) this.data.set(DECK, value);
        if (boardZone === TRASH) this.data.set(TRASH, value);
        if (boardZone === WINS) this.data.set(WINS, value);
    }

    addColorPoints(cardColor: CardColorType, value: number): void {
        const lastValue = this.#getColorPointsByColor(cardColor);
        this.#setColorPoints(cardColor, (lastValue + value));
    }

    removeColorPoints(cardColor: CardColorType, value: number): void {
        const lastValue = this.#getColorPointsByColor(cardColor);
        this.#setColorPoints(cardColor, (lastValue - value));
    }

    #setColorPoints(cardColor: CardColorType, value: number): void {
        const fromTarget = {} as Partial<BoardWindowData>;
        const toTarget = {} as Partial<BoardWindowData>;
        if (cardColor === RED) {
            fromTarget[RED] = this.#getData(RED);
            toTarget[RED] = value;
        }
        if (cardColor === GREEN) {
            fromTarget[GREEN] = this.#getData(GREEN);
            toTarget[GREEN] = value;
        }
        if (cardColor === BLUE) {
            fromTarget[BLUE] = this.#getData(BLUE);
            toTarget[BLUE] = value;
        }
        if (cardColor === BLACK) {
            fromTarget[BLACK] = this.#getData(BLACK);
            toTarget[BLACK] = value;
        }
        if (cardColor === WHITE) {
            fromTarget[WHITE] = this.#getData(WHITE);
            toTarget[WHITE] = value;
        }
        this.#updating(fromTarget, toTarget);
        if (cardColor === RED) this.data.set(RED, value);
        if (cardColor === GREEN) this.data.set(GREEN, value);
        if (cardColor === BLUE) this.data.set(BLUE, value);
        if (cardColor === BLACK) this.data.set(BLACK, value);
        if (cardColor === WHITE) this.data.set(WHITE, value);
    }

    setPass(pass: boolean): void {
        const fromTarget = {} as Partial<BoardWindowData>;
        const toTarget = {} as Partial<BoardWindowData>;
        fromTarget[PASS] = this.#getData(PASS);
        toTarget[PASS] = pass;
        this.#updating(fromTarget, toTarget);
        this.data.set(PASS, pass);
    }

    #updating(
        fromTarget: Partial<BoardWindowData>, 
        toTarget: Partial<BoardWindowData>, 
        duration: number = 0,
        onComplete?: () => void
    ): void {
        const fromTargetMerged = {
            [AP]: fromTarget[AP] ?? this.#getData(AP),
            [HP]: fromTarget[HP] ?? this.#getData(HP),
            [RED]: fromTarget[RED] ?? this.#getData(RED),
            [GREEN]: fromTarget[GREEN] ?? this.#getData(GREEN),
            [BLUE]: fromTarget[BLUE] ?? this.#getData(BLUE),
            [BLACK]: fromTarget[BLACK] ?? this.#getData(BLACK),
            [WHITE]: fromTarget[WHITE] ?? this.#getData(WHITE),
            [HAND]: fromTarget[HAND] ?? this.#getData(HAND),
            [DECK]: fromTarget[DECK] ?? this.#getData(DECK),
            [TRASH]: fromTarget[TRASH] ?? this.#getData(TRASH),
            [WINS]: fromTarget[WINS] ?? this.#getData(WINS),
            [PASS]: fromTarget[PASS] ?? this.#getData(PASS),
        }
        const toTargetMerged = {
            [AP]: toTarget[AP] ?? this.#getData(AP),
            [HP]: toTarget[HP] ?? this.#getData(HP),
            [RED]: toTarget[RED] ?? this.#getData(RED),
            [GREEN]: toTarget[GREEN] ?? this.#getData(GREEN),
            [BLUE]: toTarget[BLUE] ?? this.#getData(BLUE),
            [BLACK]: toTarget[BLACK] ?? this.#getData(BLACK),
            [WHITE]: toTarget[WHITE] ?? this.#getData(WHITE),
            [HAND]: toTarget[HAND] ?? this.#getData(HAND),
            [DECK]: toTarget[DECK] ?? this.#getData(DECK),
            [TRASH]: toTarget[TRASH] ?? this.#getData(TRASH),
            [WINS]: toTarget[WINS] ?? this.#getData(WINS),
            [PASS]: toTarget[PASS] ?? this.#getData(PASS),
        };
        new UpdateAnimation(this, { 
            fromTarget: fromTargetMerged, 
            toTarget: toTargetMerged, 
            duration,
            onComplete
        });
    }
}