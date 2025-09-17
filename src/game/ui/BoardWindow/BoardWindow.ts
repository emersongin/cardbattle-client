import { Label, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import { BLACK, BLUE, GREEN, RED, WHITE } from "@constants/colors";
import { DECK, HAND, TRASH, WINS } from "@constants/keys";
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
        this.data.set('ap', data.ap ?? 0);
        this.data.set('hp', data.hp ?? 0);
        this.data.set('redPoints', data.redPoints ?? 0);
        this.data.set('greenPoints', data.greenPoints ?? 0);
        this.data.set('bluePoints', data.bluePoints ?? 0);
        this.data.set('blackPoints', data.blackPoints ?? 0);
        this.data.set('whitePoints', data.whitePoints ?? 0);
        this.data.set('numberOfCardsInHand', data.numberOfCardsInHand ?? 0);
        this.data.set('numberOfCardsInDeck', data.numberOfCardsInDeck ?? 0);
        this.data.set('numberOfCardsInTrash', data.numberOfCardsInTrash ?? 0);
        this.data.set('numberOfWins', data.numberOfWins ?? 0);
        this.data.set('reverse', reverse ?? false);
        this.data.set('pass', data.pass ?? false);
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
        const battlePoints = this.#createBattlePoints(data.ap, data.hp, data.pass);
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
            }
        });
    }

    getAllData(): BoardWindowData {
        return {
            ap: this.#getData('ap'),
            hp: this.#getData('hp'),
            redPoints: this.#getData('redPoints'),
            greenPoints: this.#getData('greenPoints'),
            bluePoints: this.#getData('bluePoints'),
            blackPoints: this.#getData('blackPoints'),
            whitePoints: this.#getData('whitePoints'),
            numberOfCardsInHand: this.#getData('numberOfCardsInHand'),
            numberOfCardsInDeck: this.#getData('numberOfCardsInDeck'),
            numberOfCardsInTrash: this.#getData('numberOfCardsInTrash'),
            numberOfWins: this.#getData('numberOfWins'),
            pass: this.#getData('pass'),
        };
    }

    getZonePoints(boardZone: BoardZonesType): number {
        if (boardZone === HAND) return this.#getData('numberOfCardsInHand');
        if (boardZone === DECK) return this.#getData('numberOfCardsInDeck');
        if (boardZone === TRASH) return this.#getData('numberOfCardsInTrash');
        if (boardZone === WINS) return this.#getData('numberOfWins');
        return 0;
    }

    getColorPoints(cardColor: CardColorsType): number {
        if (cardColor === RED) return this.#getData('redPoints');
        if (cardColor === GREEN) return this.#getData('greenPoints');
        if (cardColor === BLUE) return this.#getData('bluePoints');
        if (cardColor === BLACK) return this.#getData('blackPoints');
        if (cardColor === WHITE) return this.#getData('whitePoints');
        return 0;
    }

    setBattlePointsWithDuration(attackPoints: number, healthPoints: number): void {
        const fromTarget = {
            ap: this.#getData('ap'),
            hp: this.#getData('hp'),
        } as Partial<BoardWindowData>;
        const toTarget = {
            ap: attackPoints,
            hp: healthPoints,
        } as Partial<BoardWindowData>;
        this.#updating(fromTarget, toTarget, 1000);
        this.data.set('ap', attackPoints);
        this.data.set('hp', healthPoints);
    }

    setZonePoints(boardZone: BoardZonesType, value: number): void {
        const fromTarget = {} as Partial<BoardWindowData>;
        const toTarget = {} as Partial<BoardWindowData>;
        if (boardZone === HAND) {
            fromTarget.numberOfCardsInHand = this.#getData('numberOfCardsInHand');
            toTarget.numberOfCardsInHand = value
        }
        if (boardZone === DECK) {
            fromTarget.numberOfCardsInDeck = this.#getData('numberOfCardsInDeck');
            toTarget.numberOfCardsInDeck = value
        }
        if (boardZone === TRASH) {
            fromTarget.numberOfCardsInTrash = this.#getData('numberOfCardsInTrash');
            toTarget.numberOfCardsInTrash = value
        }
        if (boardZone === WINS) {
            fromTarget.numberOfWins = this.#getData('numberOfWins');
            toTarget.numberOfWins = value
        }
        this.#updating(fromTarget, toTarget);
        if (boardZone === HAND) this.data.set('numberOfCardsInHand', value);
        if (boardZone === DECK) this.data.set('numberOfCardsInDeck', value);
        if (boardZone === TRASH) this.data.set('numberOfCardsInTrash', value);
        if (boardZone === WINS) this.data.set('numberOfWins', value);
    }

    setColorPoints(cardColor: CardColorsType, value: number): void {
        const fromTarget = {} as Partial<BoardWindowData>;
        const toTarget = {} as Partial<BoardWindowData>;
        if (cardColor === RED) {
            fromTarget.redPoints = this.#getData('redPoints');
            toTarget.redPoints = value;
        }
        if (cardColor === GREEN) {
            fromTarget.greenPoints = this.#getData('greenPoints');
            toTarget.greenPoints = value;
        }
        if (cardColor === BLUE) {
            fromTarget.bluePoints = this.#getData('bluePoints');
            toTarget.bluePoints = value;
        }
        if (cardColor === BLACK) {
            fromTarget.blackPoints = this.#getData('blackPoints');
            toTarget.blackPoints = value;
        }
        if (cardColor === WHITE) {
            fromTarget.whitePoints = this.#getData('whitePoints');
            toTarget.whitePoints = value;
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
        fromTarget.pass = this.#getData('pass');
        toTarget.pass = pass;
        this.#updating(fromTarget, toTarget);
        this.data.set('pass', pass);
    }

    #updating(fromTarget: Partial<BoardWindowData>, toTarget: Partial<BoardWindowData>, duration: number = 0): void {
        const fromTargetMerged = {
            ap: fromTarget.ap ?? this.#getData('ap'),
            hp: fromTarget.hp ?? this.#getData('hp'),
            redPoints: fromTarget.redPoints ?? this.#getData('redPoints'),
            greenPoints: fromTarget.greenPoints ?? this.#getData('greenPoints'),
            bluePoints: fromTarget.bluePoints ?? this.#getData('bluePoints'),
            blackPoints: fromTarget.blackPoints ?? this.#getData('blackPoints'),
            whitePoints: fromTarget.whitePoints ?? this.#getData('whitePoints'),
            numberOfCardsInHand: fromTarget.numberOfCardsInHand ?? this.#getData('numberOfCardsInHand'),
            numberOfCardsInDeck: fromTarget.numberOfCardsInDeck ?? this.#getData('numberOfCardsInDeck'),
            numberOfCardsInTrash: fromTarget.numberOfCardsInTrash ?? this.#getData('numberOfCardsInTrash'),
            numberOfWins: fromTarget.numberOfWins ?? this.#getData('numberOfWins'),
            pass: fromTarget.pass ?? this.#getData('pass'),
        }
        const toTargetMerged = {
            ap: toTarget.ap ?? this.#getData('ap'),
            hp: toTarget.hp ?? this.#getData('hp'),
            redPoints: toTarget.redPoints ?? this.#getData('redPoints'),
            greenPoints: toTarget.greenPoints ?? this.#getData('greenPoints'),
            bluePoints: toTarget.bluePoints ?? this.#getData('bluePoints'),
            blackPoints: toTarget.blackPoints ?? this.#getData('blackPoints'),
            whitePoints: toTarget.whitePoints ?? this.#getData('whitePoints'),
            numberOfCardsInHand: toTarget.numberOfCardsInHand ?? this.#getData('numberOfCardsInHand'),
            numberOfCardsInDeck: toTarget.numberOfCardsInDeck ?? this.#getData('numberOfCardsInDeck'),
            numberOfCardsInTrash: toTarget.numberOfCardsInTrash ?? this.#getData('numberOfCardsInTrash'),
            numberOfWins: toTarget.numberOfWins ?? this.#getData('numberOfWins'),
            pass: toTarget.pass ?? this.#getData('pass'),
        };
        new UpdateAnimation(this, fromTargetMerged, toTargetMerged, duration);
    }
}