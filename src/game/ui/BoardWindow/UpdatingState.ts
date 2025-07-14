import BoardWindow, { BoardWindowConfig } from "./BoardWindow";
import { UpdatePoints } from "./UpdatePoints";
import { StaticState, WindowState } from "./WindowState";

export default class UpdatingState implements WindowState {
    #updates: UpdatePoints[][] = [];
    #tweens: Phaser.Tweens.Tween[][] = [];
    
    constructor(readonly window: BoardWindow) {}

    create(toTarget: BoardWindowConfig, duration: number) {
        this.addTweens(toTarget, duration);
    }

    addTweens(toTarget: BoardWindowConfig, duration: number) {
        const fromTarget = this.window.getAllData();
        const updates = this.#createUpdatePoints(fromTarget, toTarget);
        const updateTweens = updates.map(update => {
            return {
                ...update,
                hold: 0,
                duration,
            };
        });
        this.#pushUpdates(updateTweens);
    }

    static() {
        this.window.changeState(new StaticState(this.window));
    }

    updating() {
        throw new Error('MovingState: cannot call updating() from MovingState.');
    }

    #createUpdatePoints(fromTarget: BoardWindowConfig, toTarget: BoardWindowConfig): UpdatePoints[] {
        const { apPoints, hpPoints } = this.#createUpdateBattlePoints(fromTarget, toTarget);
        const { redPoints, greenPoints, bluePoints, blackPoints, whitePoints } = 
            this.#createUpdateColorsPoints(fromTarget, toTarget);
        const { numberOfCardsInHand, numberOfCardsInDeck, numberOfWins } = this.#createUpdateBoardPoints(fromTarget, toTarget);
        return [
            apPoints, 
            hpPoints, 
            redPoints, 
            greenPoints, 
            bluePoints, 
            blackPoints,
            whitePoints,
            numberOfCardsInHand,
            numberOfCardsInDeck,
            numberOfWins
        ];
    }

    #createUpdateBattlePoints(fromTarget: BoardWindowConfig, toTarget: BoardWindowConfig): {
        apPoints: UpdatePoints, hpPoints: UpdatePoints
    } {
        const apPoints = this.#createUpdate(fromTarget, fromTarget.cardPoints.ap, toTarget.cardPoints.ap,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.cardPoints.ap = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            },
            () => this.window.setAp(toTarget.cardPoints.ap)
        );
        const hpPoints = this.#createUpdate(fromTarget, fromTarget.cardPoints.hp, toTarget.cardPoints.hp,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.cardPoints.hp = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            },
            () => this.window.setHp(toTarget.cardPoints.hp)
        );
        return { apPoints, hpPoints };
    }

    #createUpdateColorsPoints(fromTarget: BoardWindowConfig, toTarget: BoardWindowConfig): {
        redPoints: UpdatePoints, 
        greenPoints: UpdatePoints, 
        bluePoints: UpdatePoints, 
        blackPoints: UpdatePoints, 
        whitePoints: UpdatePoints
    } {
                const redPoints = this.#createUpdate(fromTarget, fromTarget.colorsPoints.red, toTarget.colorsPoints.red,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.colorsPoints.red = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            },
            () => this.window.setRedColorPoints(toTarget.colorsPoints.red)
        );
        const greenPoints = this.#createUpdate(fromTarget, fromTarget.colorsPoints.green, toTarget.colorsPoints.green,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.colorsPoints.green = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            },
            () => this.window.setGreenColorPoints(toTarget.colorsPoints.green)
        );
        const bluePoints = this.#createUpdate(fromTarget, fromTarget.colorsPoints.blue, toTarget.colorsPoints.blue,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.colorsPoints.blue = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            },
            () => this.window.setBlueColorPoints(toTarget.colorsPoints.blue)
        );
        const blackPoints = this.#createUpdate(fromTarget, fromTarget.colorsPoints.black, toTarget.colorsPoints.black,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.colorsPoints.black = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            },
            () => this.window.setBlackColorPoints(toTarget.colorsPoints.black)
        );
        const whitePoints = this.#createUpdate(fromTarget, fromTarget.colorsPoints.white, toTarget.colorsPoints.white,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.colorsPoints.white = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            },
            () => this.window.setWhiteColorPoints(toTarget.colorsPoints.white)
        );
        return { redPoints, greenPoints, bluePoints, blackPoints, whitePoints };
    }

    #createUpdateBoardPoints(fromTarget: BoardWindowConfig, toTarget: BoardWindowConfig): {
        numberOfCardsInHand: UpdatePoints,
        numberOfCardsInDeck: UpdatePoints,
        numberOfWins: UpdatePoints
    } {
        const numberOfCardsInHand = this.#createUpdate(fromTarget, fromTarget.numberOfCardsInHand, toTarget.numberOfCardsInHand,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.numberOfCardsInHand = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            },
            () => this.window.setNumberOfCardsInHand(toTarget.numberOfCardsInHand)
        );
        const numberOfCardsInDeck = this.#createUpdate(fromTarget, fromTarget.numberOfCardsInDeck, toTarget.numberOfCardsInDeck,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.numberOfCardsInDeck = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            },
            () => this.window.setNumberOfCardsInDeck(toTarget.numberOfCardsInDeck)
        );
        const numberOfWins = this.#createUpdate(fromTarget, fromTarget.numberOfWins, toTarget.numberOfWins,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.numberOfWins = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            },
            () => this.window.setNumberOfWins(toTarget.numberOfWins)
        );
        return { numberOfCardsInHand, numberOfCardsInDeck, numberOfWins };
    }

    #createUpdate(
        target: BoardWindowConfig,
        fromPoints: number, 
        toPoints: number, 
        onUpdate: (tween: Phaser.Tweens.Tween) => void,
        onComplete: () => void,
    ): UpdatePoints {
        return {
            target,
            from: fromPoints,
            to: toPoints,
            duration: 300,
            ease: 'linear',
            onUpdate,
            onComplete
        };
    }
    
    #pushUpdates(updates: UpdatePoints[]) {
        this.#updates.push(updates);
    }

    preUpdate() {
        if (this.#isPlaying()) return;
        if (this.#hasUpdates()) this.#createTweens();
        if (this.#hasTweens()) return;
        this.static();
    }

    #isPlaying(): boolean {
        return this.#tweens.some(group  => group.some(tween => tween.isPlaying())) ?? false;
    }

    #hasUpdates(): boolean {
        return this.#updates.length > 0;
    }

    #createTweens() {
        const updates = this.#updates.shift();
        if (!updates || updates.length === 0) return;
        let counterTweens = [];
        for (const points of updates) {
            const tween = this.window.scene.tweens.addCounter({
                ...points,
                onComplete: () => {
                    for (let index = 0; index < this.#tweens.length; index++) {
                        const group = this.#tweens[index];
                        const filteredGroup = group.filter(t => t !== tween);
                        this.#tweens[index] = filteredGroup;
                    }
                } 
            });
            counterTweens.push(tween);
        }
        this.#tweens.push(counterTweens);
    }

    #hasTweens(): boolean {
        return this.#hasUpdates() || this.#tweens.length > 0;
    }
}