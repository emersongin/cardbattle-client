import { Card } from "@ui/Card/Card";
import { CardPointsData } from "@/game/objects/BattlePointsData";
import { UpdateConfig } from "@ui/Card/animations/types/UpdateConfig";

export class UpdateAnimation {
    
    constructor(readonly card: Card, toTarget: CardPointsData) {
        const fromTarget: CardPointsData = this.card.getAllData();
        const apPoints = this.#createUpdate(fromTarget, fromTarget.ap, toTarget.ap,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.ap = Math.round(tween.getValue() ?? 0);
                const ap = Math.round(fromTarget.ap);
                const hp = Math.round(fromTarget.hp);
                this.card.setPointsDisplay(ap, hp);
            },
            () => this.card.setAp(toTarget.ap)
        );
        const hpPoints = this.#createUpdate(fromTarget, fromTarget.hp, toTarget.hp,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.hp = Math.round(tween.getValue() ?? 0);
                const ap = Math.round(fromTarget.ap);
                const hp = Math.round(fromTarget.hp);
                this.card.setPointsDisplay(ap, hp);
            },
            () => this.card.setHp(toTarget.hp)
        );
        const updates = [apPoints, hpPoints];
        const updateTweens = updates.map(update => {
            return {
                ...update,
                hold: 0,
                duration: 300
            };
        });
        for (const points of updateTweens) {
            this.card.scene.tweens.addCounter({ ...points });
        }
    }

    #createUpdate(
        target: CardPointsData,
        fromPoints: number, 
        toPoints: number, 
        onUpdate: (tween: Phaser.Tweens.Tween) => void,
        onComplete: () => void,
    ): UpdateConfig {
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
}