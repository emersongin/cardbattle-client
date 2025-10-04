import { ADD_COLOR_POINTS, HAND, REMOVE_COLOR_POINTS } from "@constants/keys";
import { CARD_WIDTH } from "@constants/default";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { PowerCardPlayData } from "@/game/objects/PowerCardPlayData";
import { Card } from "@/game/ui/Card/Card";
import { TriggerPhase } from "./TriggerPhase";
import { BoardWindowData } from "@/game/objects/BoardWindowData";
import { PowerCard } from "@/game/ui/Card/PowerCard";
export abstract class PowerPhase extends CardBattlePhase {

    async create(goToPlays: boolean = false): Promise<void> {
        if (goToPlays) {
            super.removeBoardPass();
            super.removeOpponentBoardPass();
            this.resumePhase();
            return;
        }
        this.createPhaseWindows();
        super.openAllWindows();
    }

    abstract createPhaseWindows(): void;

    async resumePhase(): Promise<void> {
        if (await this.cardBattle.isStartPlaying(this.scene.room.playerId)) {
            this.#goPlay();
            return;
        }
        this.#nextPlay();
    }

    async #goPlay(): Promise<void> {
        await Promise.all([
            this.#resetPlay(),
            this.#createCommandWindow()
        ]);
        super.openCommandWindow()
    }

    #resetPlay(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            await this.cardBattle.setPlaying(this.scene.room.playerId);
            super.removeBoardPass();
            resolve();
        });
    }

    #createCommandWindow(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            super.createCommandWindowBottom('Use a Power Card?', [
                {
                    description: 'Yes',
                    disabled: !await this.cardBattle.hasPowerCardInHand(this.scene.room.playerId),
                    onSelect: () => this.#changeBattleZoneToHandZone()
                },
                {
                    description: 'No',
                    onSelect: async () => {
                        await this.cardBattle.pass(this.scene.room.playerId);
                        super.setBoardPass();
                        this.#nextPlay();
                    }
                }
            ]);
            resolve();
        });
    }

    async #changeBattleZoneToHandZone(): Promise<void> {
        await super.closeGameBoard();
        // create hand zone
        const boardData: BoardWindowData = await this.cardBattle.getBoard(this.scene.room.playerId);
        await this.createHandZone();
        super.createBoard(boardData);
        super.createHandDisplayWindows();
        // open
        await super.openHandZone();
        super.openAllWindows();
        // start select mode
        super.setSelectModeOnceCardset({
            onChangeIndex: (card: Card) => this.#updateTextWindows(card),
            onComplete: (cardIds: string[]) => this.#completeChoice(cardIds),
            onLeave: () => this.#changeHandZoneToBattleZone({ onComplete: () => this.#goPlay() }),
        });
    }

    async #changeHandZoneToBattleZone(config: { onComplete: () => void }): Promise<void> {
        await super.closeHandZone();
        await super.createGameBoard({ isPowerCardsFaceUp: true });
        await super.openGameBoard();
        if (config?.onComplete) config.onComplete();
    }

    abstract createHandZone(): Promise<void>;

    #updateTextWindows(card: Card): void {
        super.setTextWindowText(card.getName() + ' ' + card.getId(), 1);
        super.setTextWindowText(card.getDescription(), 2);
        if (card instanceof PowerCard) {
            super.setTextWindowText(card.getEffectDescription(), 3);
            return;
        }
        super.setTextWindowText('...', 3);
    }

    #completeChoice(cardIds: string[]): void {
        const handCardset = super.getCardset();
        handCardset.highlightCardsByIndexes(cardIds);
        super.createCommandWindowBottom('Complete your choice?', [
            {
                description: 'Yes',
                onSelect: () => {
                    const cardId = cardIds.shift();
                    this.#changeHandZoneToBattleZone({ 
                        onComplete: () => {
                            this.#startPowerCardPlay(cardId as string);
                        }
                    });
                }
            },
            {
                description: 'No',
                onSelect: () => handCardset.restoreSelectMode()
            },
        ]);
        super.openCommandWindow();
    }

    async #startPowerCardPlay(cardId: string): Promise<void> {
        const card: PowerCard = await this.cardBattle.getPowerCardById(this.scene.room.playerId, cardId);
        const playerPlay = () => this.#createPowerCardConfig(card);
        //mock
        // const playerPlay = () => this.#finishPowerCardPlay(powerCard, true);
        this.#playPowerCard(card, playerPlay);
    }

    #createPowerCardConfig(card: PowerCard): void {
        switch (card.getEffectType()) {
            case ADD_COLOR_POINTS:
            case REMOVE_COLOR_POINTS:
            default:
                this.#createConfirmPowerCardConfig(card);
                break;
        }
    }

    #createConfirmPowerCardConfig(card: PowerCard): void {
        super.createTextWindowTop(card.name, { textAlign: 'center' });
        super.addTextWindow(card.getEffectDescription());
        super.createCommandWindowBottom('Use this Power Card?', [
            {
                description: 'Yes',
                onSelect: async () => this.#finishPowerCardPlay(card, true)
            },
            {
                description: 'No',
                onSelect: () => this.#changeBattleZoneToHandZone()
            }
        ]);
        super.openAllWindows();
        super.openCommandWindow();
    }

    async #finishPowerCardPlay(powerCard: PowerCard, powerCardConfig: any): Promise<void> {
        await super.closeAllWindows();
        // make power card play and remove hand point
        const powerAction = { 
            powerCard, 
            config: powerCardConfig 
        };
        await this.cardBattle.makePowerCardPlay(this.scene.room.playerId, powerAction);
        super.removeBoardZonePoints(HAND, 1);
        // set board pass
        await this.cardBattle.pass(this.scene.room.playerId);
        super.setBoardPass();
        // reset opponent board pass if limit not reached
        if (!await this.cardBattle.isPowerfieldLimitReached()) super.removeOpponentBoardPass();
        // move power card to field
        this.#loadPlayAndMovePowerCardToField();
    }

    async #playPowerCard(powerCard: PowerCard, loadPowerActionConfig: () => void): Promise<void> {
        // create power cardset
        const powerCards: PowerCard[] = await this.cardBattle.getFieldPowerCards();
        const powerCardsFiltered = powerCards.filter(card => card.getId() !== powerCard.getId());
        powerCard.faceUp();
        powerCard.enable();
        await super.createPowerCardset([...powerCardsFiltered, powerCard]);
        // show power cardset last state
        const cardset = super.getPowerCardset();
        cardset.setCardsInLinePosition();
        cardset.showCards();
        // set last card position
        const widthEdge = (this.scene.scale.width - cardset.x) - ((CARD_WIDTH * 1.5) - 20);
        const lastIndex = cardset.getCardsLastIndex();
        cardset.setCardAtPosition(lastIndex, widthEdge);
        cardset.setCardClosedByIndex(lastIndex);
        // show last card (played card)
        super.openCardFromPowerCardsetByIndex(lastIndex, {
            faceUp: true,
            onComplete: () => {
                const card = cardset.getCardByIndex(lastIndex);
                cardset.selectCardById(card.getId());
                loadPowerActionConfig();
            }
        });
    }

    async #loadPlayAndMovePowerCardToField(): Promise<void> {
        super.getPowerCardset().removeAllSelect();
        super.movePowerCardsetToBoard({ onComplete: () => this.#nextPlay() });
    }

    async #nextPlay(): Promise<void> {
        if (await this.cardBattle.isPowerfieldLimitReached()) {
            this.changeToTriggerPhase();
            return;
        }
        if (await this.cardBattle.allPass()) {
            if (await this.cardBattle.hasPowerCardsInField()) {
                this.changeToTriggerPhase();
                return;
            }
            this.changeTo();
            return;
        }
        if (await this.cardBattle.isOpponentPassed(this.scene.room.playerId)) {
            this.#goPlay();
            return;
        }
        this.#listanOpponentPlay();
    }

    abstract changeTo(): void;
    
    changeToTriggerPhase(): void {
        this.scene.changePhase(new TriggerPhase(this.scene, this));
    }

    #listanOpponentPlay() {
        super.createWaitingWindow('Waiting for opponent to play...');
        super.openAllWindows({
            onComplete: () => {
                this.cardBattle.listenOpponentPlay(
                    this.scene.room.playerId, 
                    async (opponentPlay: PowerCardPlayData) => {
                        await super.closeAllWindows();
                        this.#onOpponentPlay(opponentPlay);
                    }
                );
            }
        });
    }

    async #onOpponentPlay(opponentPlay: PowerCardPlayData): Promise<void> {
        const { pass, powerAction } = opponentPlay;
        super.addOpponentBoardPass();
        if (pass) {
            this.#nextPlay();
            return;
        }
        if (await this.cardBattle.isPowerfieldLimitReached() === false) {
            await this.#resetPlay();
        }
        if (powerAction?.powerCard) {
            const opponentPlayFunction = async () => {
                await super.closeAllWindows();
                super.removeOpponentBoardZonePoints(HAND, 1);
                this.#loadPlayAndMovePowerCardToField();
            };
            this.#playPowerCard(powerAction.powerCard, opponentPlayFunction);
        }
    }

}
