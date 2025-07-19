import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@/game/ui/TextWindow';
import { LoadPhase } from "./LoadPhase";
import { CardBattle } from "@/game/api/CardBattle";
import { BoardWindowData, CardData } from "@/game/types";

export class DrawPhase implements Phase {
    #cardBattle: CardBattle;
    #titleWindow: TextWindow;
    #textWindow: TextWindow;
    
    constructor(readonly scene: CardBattleScene) {
        this.#cardBattle = scene.getCardBattle();
    }

    async create(): Promise<void> {
        const playerCards: CardData[] = await this.#cardBattle.drawPlayerCardsData();
        const opponentCards: CardData[] = await this.#cardBattle.drawOpponentCardsData();
        const playerBoardData: BoardWindowData = await this.#cardBattle.getPlayerBoardData();
        const opponentBoardData: BoardWindowData = await this.#cardBattle.getOpponentBoardData();
        this.#createWindows();
        this.#openWindows();    
    }

    #createWindows(): void {
        this.#createTitleWindow();
        this.#createTextWindow();
    }

    #createTitleWindow(): void {
        this.#titleWindow = TextWindow.createCentered(this.scene, 'Draw Phase', {
            align: 'center',
            onStartClose: () => {
                this.#textWindow.close();
            },
            onClose: () => {
                // Transition to the next phase
            }
        });
    }

    #createTextWindow(): void {
        this.#textWindow = TextWindow.createCentered(this.scene, '6 cards will be draw.', {
            relativeParent: this.#titleWindow
        });
    }

    #openWindows(): void {
        this.#openTitleWindow();
        this.#openTextWindow();
    }

    #openTitleWindow(): void {
        this.#titleWindow.open();
    }

    #openTextWindow(): void {
        this.#textWindow.open();
    }

    update(): void {
        console.log("Updating Draw Phase...");
    }

        changeToChallengePhase(): void {
        throw new Error("Method not implemented.");
    }
    
    changeToStartPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToDrawPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToLoadPhase(): void {
        this.scene.changePhase(new LoadPhase(this.scene));
    }

    changeToTriggerPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToSummonPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToCompilePhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToBattlePhase(): void {
        throw new Error("Method not implemented.");
    }

    destroy(): void {
        if (this.#titleWindow) this.#titleWindow.destroy();
        if (this.#textWindow) this.#textWindow.destroy();
    }
}