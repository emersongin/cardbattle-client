import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@/game/ui/TextWindow';
import { LoadPhase } from "./LoadPhase";
import { CardBattle } from "@/game/api/CardBattle";
import { BoardWindowData, CardData } from "@/game/types";
import { CARD_HEIGHT, CARD_WIDTH } from "@/game/ui/Card/Card";
import { Cardset } from "@/game/ui/Cardset/Cardset";
import BoardWindow from "@/game/ui/BoardWindow/BoardWindow";

export class DrawPhase implements Phase {
    #cardBattle: CardBattle;
    #titleWindow: TextWindow;
    #textWindow: TextWindow;
    #playerBoard: BoardWindow;
    #opponentBoard: BoardWindow;
    #playerCardset: Cardset;
    #opponentCardset: Cardset;
    
    constructor(readonly scene: CardBattleScene) {
        this.#cardBattle = scene.getCardBattle();
    }

    async create(): Promise<void> {
        const playerCards: CardData[] = await this.#cardBattle.drawPlayerCardsData();
        const opponentCards: CardData[] = await this.#cardBattle.drawOpponentCardsData();
        const playerBoardData: BoardWindowData = await this.#cardBattle.getPlayerBoardData();
        const opponentBoardData: BoardWindowData = await this.#cardBattle.getOpponentBoardData();
        this.#createWindows();
        this.#createBoards(playerBoardData, opponentBoardData);
        this.#createcardSets(playerCards, opponentCards);
        this.#openWindows();
    }

    #createcardSets(playerCards: CardData[], opponentCards: CardData[]): void {
        this.#createPlayerCardSet(playerCards);
        this.#createOpponentCardSet(opponentCards);
    }

    #createPlayerCardSet(playerCards: CardData[]): void {
        const dimensions = { 
            x: (this.scene.cameras.main.centerX - (CARD_WIDTH * 3)), 
            y: (this.#playerBoard.y - (this.#playerBoard.height / 2)) - CARD_HEIGHT - 10, 
            width: (CARD_WIDTH * 6), 
            height: CARD_HEIGHT 
        };
        const widthEdge = this.scene.scale.width;
        const cardset = Cardset.createCardsAtPosition(this.scene, dimensions, playerCards, widthEdge, 0);
        this.#playerCardset = cardset;
    }

    #createOpponentCardSet(opponentCards: CardData[]): void {
        const dimensions = { 
            x: (this.scene.cameras.main.centerX - (CARD_WIDTH * 3)),
            y: (this.#opponentBoard.y + (this.#playerBoard.height / 2)) + 10, 
            width: (CARD_WIDTH * 6), 
            height: CARD_HEIGHT 
        };
        const widthEdge = this.scene.scale.width;
        const cardset = Cardset.createCardsAtPosition(this.scene, dimensions, opponentCards, widthEdge, 0);
        this.#opponentCardset = cardset;
    }

    #createBoards(playerBoardData: BoardWindowData, opponentBoardData: BoardWindowData): void {
        this.#createPlayerBoard(playerBoardData);
        this.#createOpponentBoard(opponentBoardData);
    }

    #createPlayerBoard(playerBoardData: BoardWindowData): void {
        const boardWindow = BoardWindow.createBottom(this.scene, playerBoardData);
        this.#playerBoard = boardWindow;
    }

    #createOpponentBoard(opponentBoardData: BoardWindowData): void {
        const boardWindow = BoardWindow.createTopReverse(this.scene, opponentBoardData);
        this.#opponentBoard = boardWindow;
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
                this.#openBoards();
                this.#moveCardSetsToBoards();
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

    #openBoards(): void {
        this.#openPlayerBoard();
        this.#openOpponentBoard();
    }

    #openPlayerBoard(): void {
        this.#playerBoard.open();
    }

    #openOpponentBoard(): void {
        this.#opponentBoard.open();
    }

    #moveCardSetsToBoards(): void {
        this.#movePlayerCardSetToBoard();
        this.#moveOpponentCardSetToBoard();
    }

    #movePlayerCardSetToBoard(): void {
        this.scene.timeline({
            targets: this.#playerCardset.getCardsUi(),
            x: 0,
            eachX: CARD_WIDTH,
            eachDuration: 100,
            onComplete: () => {
                // devem ser timeline
                // this.#playerCardset.flipAllCardsDominoMovement();
                // this.#playerCardset.flashAllCardsDominoMovement();
            }
        });
    }

    #moveOpponentCardSetToBoard(): void {
        this.scene.timeline({
            targets: this.#opponentCardset.getCardsUi(),
            x: 0,
            eachX: CARD_WIDTH,
            eachDuration: 100,
        });
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