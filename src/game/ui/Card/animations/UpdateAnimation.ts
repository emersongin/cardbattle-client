import { BattlePoints } from "@game/objects/BattlePoints";
import { UpdateConfig } from "@ui/Card/animations/types/UpdateConfig";
import { AP, HP } from "@game/constants/keys";
import { BattleCard } from "@ui/Card/BattleCard";

export class UpdateAnimation {
    
    constructor(readonly card: BattleCard, toTarget: BattlePoints) {
        const fromTarget: BattlePoints = this.card.getAllData();
        const apPoints = this.#createUpdate(fromTarget, fromTarget[AP], toTarget[AP],
            (tween: Phaser.Tweens.Tween) => {
                fromTarget[AP] = Math.round(tween.getValue() ?? 0);
                const ap = Math.round(fromTarget[AP]);
                const hp = Math.round(fromTarget[HP]);
                this.card.setDisplayPoints(ap, hp);
            },
            () => this.card.setAp(toTarget[AP])
        );
        const hpPoints = this.#createUpdate(fromTarget, fromTarget[HP], toTarget[HP],
            (tween: Phaser.Tweens.Tween) => {
                fromTarget[HP] = Math.round(tween.getValue() ?? 0);
                const ap = Math.round(fromTarget[AP]);
                const hp = Math.round(fromTarget[HP]);
                this.card.setDisplayPoints(ap, hp);
            },
            () => this.card.setHp(toTarget[HP])
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
        target: BattlePoints,
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