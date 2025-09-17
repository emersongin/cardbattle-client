import { BoardWindowData } from "@objects/BoardWindowData";
import { UpdateConfig } from "@/game/ui/BoardWindow/animations/types/UpdateConfig";
import { BoardWindow } from "@ui/BoardWindow/BoardWindow";
import { BoardUpdateConfig } from "./types/BoardUpdateConfig";
export class UpdateAnimation {
    
    constructor(
        readonly window: BoardWindow, 
        config: BoardUpdateConfig
    ) {
        const updates = this.#createUpdateConfig(config.fromTarget, config.toTarget);
        const updateTweens = updates.map(update => {
            return {
                ...update,
                hold: 0,
                duration: config.duration || 0,
            };
        });
        for (const points of updateTweens) {
            this.window.scene.tweens.addCounter({ ...points });
        }
    }

    #createUpdateConfig(fromTarget: BoardWindowData, toTarget: BoardWindowData): UpdateConfig[] {
        const { apPoints, hpPoints } = this.#createUpdateBattlePoints(fromTarget, toTarget);
        const passUpdates = this.#createUpdatePass(fromTarget, toTarget);
        const { redPoints, greenPoints, bluePoints, blackPoints, whitePoints } = this.#createUpdateColorsPoints(fromTarget, toTarget);
        const { numberOfCardsInHand, numberOfCardsInDeck, numberOfCardsInTrash, numberOfWins } = this.#createUpdateBoardPoints(fromTarget, toTarget);
        return [
            apPoints, 
            hpPoints, 
            passUpdates,
            redPoints, 
            greenPoints, 
            bluePoints, 
            blackPoints,
            whitePoints,
            numberOfCardsInHand,
            numberOfCardsInDeck,
            numberOfCardsInTrash,
            numberOfWins,
        ];
    }

    #createUpdateBattlePoints(fromTarget: BoardWindowData, toTarget: BoardWindowData): {
        apPoints: UpdateConfig, hpPoints: UpdateConfig
    } {
        const apPoints = this.#createUpdate(fromTarget, fromTarget.ap, toTarget.ap,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.ap = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        const hpPoints = this.#createUpdate(fromTarget, fromTarget.hp, toTarget.hp,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.hp = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        return { apPoints, hpPoints };
    }

    #createUpdatePass(fromTarget: BoardWindowData, toTarget: BoardWindowData): UpdateConfig {
        const pass = this.#createUpdate(fromTarget, fromTarget.pass ? 1 : 0, toTarget.pass ? 1 : 0,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.pass = tween.getValue() === 1;
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        return pass;
    }

    #createUpdateColorsPoints(fromTarget: BoardWindowData, toTarget: BoardWindowData): {
        redPoints: UpdateConfig, 
        greenPoints: UpdateConfig, 
        bluePoints: UpdateConfig, 
        blackPoints: UpdateConfig, 
        whitePoints: UpdateConfig
    } {
        const redPoints = this.#createUpdate(fromTarget, fromTarget.redPoints, toTarget.redPoints,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.redPoints = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        const greenPoints = this.#createUpdate(fromTarget, fromTarget.greenPoints, toTarget.greenPoints,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.greenPoints = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        const bluePoints = this.#createUpdate(fromTarget, fromTarget.bluePoints, toTarget.bluePoints,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.bluePoints = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        const blackPoints = this.#createUpdate(fromTarget, fromTarget.blackPoints, toTarget.blackPoints,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.blackPoints = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        const whitePoints = this.#createUpdate(fromTarget, fromTarget.whitePoints, toTarget.whitePoints,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.whitePoints = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        return { redPoints, greenPoints, bluePoints, blackPoints, whitePoints };
    }

    #createUpdateBoardPoints(fromTarget: BoardWindowData, toTarget: BoardWindowData): {
        numberOfCardsInHand: UpdateConfig,
        numberOfCardsInDeck: UpdateConfig,
        numberOfCardsInTrash: UpdateConfig,
        numberOfWins: UpdateConfig
    } {
        const numberOfCardsInHand = this.#createUpdate(fromTarget, fromTarget.numberOfCardsInHand, toTarget.numberOfCardsInHand,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.numberOfCardsInHand = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        const numberOfCardsInDeck = this.#createUpdate(fromTarget, fromTarget.numberOfCardsInDeck, toTarget.numberOfCardsInDeck,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.numberOfCardsInDeck = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        const numberOfCardsInTrash = this.#createUpdate(fromTarget, fromTarget.numberOfCardsInTrash, toTarget.numberOfCardsInTrash,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.numberOfCardsInTrash = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        const numberOfWins = this.#createUpdate(fromTarget, fromTarget.numberOfWins, toTarget.numberOfWins,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.numberOfWins = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        return { numberOfCardsInHand, numberOfCardsInDeck, numberOfCardsInTrash, numberOfWins };
    }
    
    #createUpdate(
        target: BoardWindowData,
        fromPoints: number, 
        toPoints: number, 
        onUpdate: (tween: Phaser.Tweens.Tween) => void,
        onComplete?: () => void,
    ): UpdateConfig {
        return {
            target,
            from: fromPoints,
            to: toPoints,
            ease: 'linear',
            onUpdate,
            onComplete
        };
    }
}