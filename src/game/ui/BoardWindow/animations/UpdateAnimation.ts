import { BoardWindowData } from "@objects/BoardWindowData";
import { UpdateConfig } from "@/game/ui/BoardWindow/animations/types/UpdateConfig";
import { BoardWindow } from "@ui/BoardWindow/BoardWindow";
import { BoardUpdateConfig } from "./types/BoardUpdateConfig";
import { AP, DECK, HAND, HP, PASS, TRASH, WINS } from "@/game/constants/keys";
import { BLACK, BLUE, GREEN, RED, WHITE } from "@/game/constants/colors";
export class UpdateAnimation {
    
    constructor(
        readonly window: BoardWindow, 
        config: BoardUpdateConfig
    ) {
        const updates = this.#createUpdateConfig(config.fromTarget, config.toTarget);
        const promises = updates.map(update => {
            return new Promise<void>((resolve) => {
                this.window.scene.tweens.addCounter({
                    ...update,
                    hold: 0,
                    duration: config.duration || 0,
                    onComplete: () => {
                        if (update.onComplete) update.onComplete();
                        resolve();
                    }
                });
            });
        });
        Promise.all(promises).then(() => {
            if (config.onComplete) config.onComplete();
        });
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
        const apPoints = this.#createUpdate(fromTarget, fromTarget[AP], toTarget[AP],
            (tween: Phaser.Tweens.Tween) => {
                fromTarget[AP] = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        const hpPoints = this.#createUpdate(fromTarget, fromTarget[HP], toTarget[HP],
            (tween: Phaser.Tweens.Tween) => {
                fromTarget[HP] = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        return { apPoints, hpPoints };
    }

    #createUpdatePass(fromTarget: BoardWindowData, toTarget: BoardWindowData): UpdateConfig {
        const pass = this.#createUpdate(fromTarget, fromTarget[PASS] ? 1 : 0, toTarget[PASS] ? 1 : 0,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget[PASS] = tween.getValue() === 1;
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
        const redPoints = this.#createUpdate(fromTarget, fromTarget[RED], toTarget[RED],
            (tween: Phaser.Tweens.Tween) => {
                fromTarget[RED] = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        const greenPoints = this.#createUpdate(fromTarget, fromTarget[GREEN], toTarget[GREEN],
            (tween: Phaser.Tweens.Tween) => {
                fromTarget[GREEN] = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        const bluePoints = this.#createUpdate(fromTarget, fromTarget[BLUE], toTarget[BLUE],
            (tween: Phaser.Tweens.Tween) => {
                fromTarget[BLUE] = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        const blackPoints = this.#createUpdate(fromTarget, fromTarget[BLACK], toTarget[BLACK],
            (tween: Phaser.Tweens.Tween) => {
                fromTarget[BLACK] = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        const whitePoints = this.#createUpdate(fromTarget, fromTarget[WHITE], toTarget[WHITE],
            (tween: Phaser.Tweens.Tween) => {
                fromTarget[WHITE] = Math.round(tween.getValue() ?? 0);
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
        const numberOfCardsInHand = this.#createUpdate(fromTarget, fromTarget[HAND], toTarget[HAND],
            (tween: Phaser.Tweens.Tween) => {
                fromTarget[HAND] = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        const numberOfCardsInDeck = this.#createUpdate(fromTarget, fromTarget[DECK], toTarget[DECK],
            (tween: Phaser.Tweens.Tween) => {
                fromTarget[DECK] = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        const numberOfCardsInTrash = this.#createUpdate(fromTarget, fromTarget[TRASH], toTarget[TRASH],
            (tween: Phaser.Tweens.Tween) => {
                fromTarget[TRASH] = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            }
        );
        const numberOfWins = this.#createUpdate(fromTarget, fromTarget[WINS], toTarget[WINS],
            (tween: Phaser.Tweens.Tween) => {
                fromTarget[WINS] = Math.round(tween.getValue() ?? 0);
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