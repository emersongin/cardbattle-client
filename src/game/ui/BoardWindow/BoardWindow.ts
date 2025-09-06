import { Label, Sizer } from "phaser3-rex-plugins/templates/ui/ui-components";
import { DisplayUtil } from "../../utils/DisplayUtil";
import { BoardWindowData } from "@game/types/BoardWindowData";
import { BLACK, BLUE, GREEN, RED, WHITE } from "@/game/constants/colors";
import { BoardZones } from "@/game/types/BoardZones";
import { DECK, HAND, TRASH, WINS } from "@/game/constants/keys";
import { CardColors } from "../../types/CardColors";
import { TweenConfig } from "@/game/types/TweenConfig";
import { UpdateAnimation } from "./animations/UpdateAnimation";

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
        return this.data.get('reverse') ? `${boardPoints}\n\n${battlePoints}` : `${battlePoints}\n\n${boardPoints}`;
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
            ap: this.data.get('ap'),
            hp: this.data.get('hp'),
            redPoints: this.data.get('redPoints'),
            greenPoints: this.data.get('greenPoints'),
            bluePoints: this.data.get('bluePoints'),
            blackPoints: this.data.get('blackPoints'),
            whitePoints: this.data.get('whitePoints'),
            numberOfCardsInHand: this.data.get('numberOfCardsInHand'),
            numberOfCardsInDeck: this.data.get('numberOfCardsInDeck'),
            numberOfCardsInTrash: this.data.get('numberOfCardsInTrash'),
            numberOfWins: this.data.get('numberOfWins'),
            pass: this.data.get('pass'),
        };
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
        } as Partial<BoardWindowData>;
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
        } as Partial<BoardWindowData>;
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
        } as Partial<BoardWindowData>;
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
        } as Partial<BoardWindowData>;
        this.#updating(colorsPoints);
    }

    setPass(pass: boolean): void {
        this.data.set('pass', pass);
        let boardWindowData = {
            pass: this.data.get('pass')
        } as Partial<BoardWindowData>;
        this.#updating(boardWindowData);
    }

    #updating(toTarget: Partial<BoardWindowData>): void {
        const boardWindowData = {
            ap: toTarget.ap ?? this.data.get('ap'),
            hp: toTarget.hp ?? this.data.get('hp'),
            redPoints: toTarget.redPoints ?? this.data.get('redPoints'),
            greenPoints: toTarget.greenPoints ?? this.data.get('greenPoints'),
            bluePoints: toTarget.bluePoints ?? this.data.get('bluePoints'),
            blackPoints: toTarget.blackPoints ?? this.data.get('blackPoints'),
            whitePoints: toTarget.whitePoints ?? this.data.get('whitePoints'),
            numberOfCardsInHand: toTarget.numberOfCardsInHand ?? this.data.get('numberOfCardsInHand'),
            numberOfCardsInDeck: toTarget.numberOfCardsInDeck ?? this.data.get('numberOfCardsInDeck'),
            numberOfCardsInTrash: toTarget.numberOfCardsInTrash ?? this.data.get('numberOfCardsInTrash'),
            numberOfWins: toTarget.numberOfWins ?? this.data.get('numberOfWins'),
            pass: toTarget.pass ?? this.data.get('pass'),
        };
        new UpdateAnimation(this, boardWindowData);
    }
}