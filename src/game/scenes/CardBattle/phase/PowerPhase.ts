import { ADD_COLOR_POINTS, HAND, REMOVE_COLOR_POINTS } from "@constants/keys";
import { CARD_WIDTH } from "@constants/default";
import { TriggerPhase } from "@scenes/CardBattle/phase/TriggerPhase";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { PowerCardPlay } from "@game/objects/PowerCardPlay";
import { Card } from "@game/ui/Card/Card";
import { PowerCard } from "@game/ui/Card/PowerCard";
import { BoardWindow } from "@game/ui/BoardWindow/BoardWindow";
import { CardBattleScene } from "../CardBattleScene";

export type PowerPhaseEvents = {
    onOpenPhaseWindows?: () => void;
    onOpenBeginPhaseWindow?: () => void;
    onOpenCommandWindow?: () => void;
    onSelectModeHandZoneCardset?: () => void;
    onOpenPowerCardSelectionCommandWindow?: () => void;
    onOpenPowerCardActivationCommandWindow?: () => void;
}
export abstract class PowerPhase extends CardBattlePhase {

    constructor(scene: CardBattleScene, events?: PowerPhaseEvents) {
        super(scene);
        if (events?.onOpenPhaseWindows) {
            super.addListener('onOpenPhaseWindows', events.onOpenPhaseWindows);
        }
        if (events?.onOpenBeginPhaseWindow) {
            super.addListener('onOpenBeginPhaseWindow', events.onOpenBeginPhaseWindow);
        }
        if (events?.onOpenCommandWindow) {
            super.addListener('onOpenCommandWindow', events.onOpenCommandWindow);
        }
        if (events?.onSelectModeHandZoneCardset) {
            super.addListener('onSelectModeHandZoneCardset', events.onSelectModeHandZoneCardset);
        }
        if (events?.onOpenPowerCardSelectionCommandWindow) {
            super.addListener('onOpenPowerCardSelectionCommandWindow', events.onOpenPowerCardSelectionCommandWindow);
        }
        if (events?.onOpenPowerCardActivationCommandWindow) {
            super.addListener('onOpenPowerCardActivationCommandWindow', events.onOpenPowerCardActivationCommandWindow);
        }

    }

    async create(goToPlays: boolean = false): Promise<void> {
        if (goToPlays) {
            super.removeBoardPass();
            super.removeOpponentBoardPass();
            this.resumePhase();
            return;
        }
        this.createPhaseWindows();
        super.openAllWindows({
            onComplete: () => {
                this.scene.addKeyEnterListeningOnce({
                    onTrigger: () => {
                        this.scene.removeAllKeyListening();
                        super.closeAllWindows({
                            onComplete: async () => {
                                await super.createGameBoard();
                                this.createBeginPhaseWindows();
                                await super.openGameBoard();
                                super.openAllWindows({
                                    onComplete: () => {
                                        this.scene.addKeyEnterListeningOnce({
                                            onTrigger: () => {
                                                this.scene.removeAllKeyListening();
                                                super.closeAllWindows({
                                                    onComplete: () => this.resumePhase()
                                                })
                                            }
                                        });
                                        super.publish('onOpenBeginPhaseWindow');
                                    }
                                });
                            }
                        })
                    }
                });
                super.publish('onOpenPhaseWindows');
            }
        });
    }

    abstract createPhaseWindows(): void;
    abstract createBeginPhaseWindows(): void;

    async resumePhase(): Promise<void> {
        if (await this.cardBattle.isStartPlaying(this.scene.getPlayerId())) {
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
        super.openCommandWindow({
            onComplete: () => {
                const commandWindow = super.getCommandWindow();
                this.scene.addKeyUpListening({ onTrigger: () => commandWindow.cursorUp() });
                this.scene.addKeyDownListening({ onTrigger: () => commandWindow.cursorDown() });
                this.scene.addKeyEnterListeningOnce({ onTrigger: () => {
                    this.scene.removeAllKeyListening();
                    commandWindow.select();
                } });
                commandWindow.selectByIndex(0);
                super.publish('onOpenCommandWindow');
            }
        })
    }

    #resetPlay(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            await this.cardBattle.setPlaying(this.scene.getPlayerId());
            super.removeBoardPass();
            resolve();
        });
    }

    #createCommandWindow(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            super.createCommandWindowBottom('Use a Power Card?', [
                {
                    description: 'Yes',
                    disabled: !await this.cardBattle.hasPowerCardInHand(this.scene.getPlayerId()),
                    onSelect: () => this.#changeBattleZoneToHandZone()
                },
                {
                    description: 'No',
                    onSelect: async () => {
                        await this.cardBattle.pass(this.scene.getPlayerId());
                        super.setBoardPass();
                        this.#nextPlay();
                    },
                    disabled: false
                }
            ]);
            resolve();
        });
    }

    async #changeBattleZoneToHandZone(): Promise<void> {
        await super.closeGameBoard();
        await this.createHandZone();
        super.openHandZone({ onComplete: () => this.#selectModeHandZoneCardset() });
    }

    async createHandZone(): Promise<void> {
        super.addBoard(await this.cardBattle.getBoard(this.scene.getPlayerId()) as BoardWindow);
        super.createHandDisplayWindows();
    }

    #selectModeHandZoneCardset (): void {
        super.setSelectModeOnceCardset({
            onChangeIndex: (card: Card) => this.#updateTextWindows(card),
            onComplete: (cardIds: string[]) => this.#completeChoice(cardIds),
            onLeave: () => this.#changeHandZoneToBattleZone({ 
                onComplete: () => this.#goPlay() 
            }),
        });
        const cardset = super.getCardset();
        this.scene.addKeyRightListening({ onTrigger: () => cardset.cursorRight() });
        this.scene.addKeyLeftListening({ onTrigger: () => cardset.cursorLeft() });
        this.scene.addKeyEnterListeningOnce({ onTrigger: () => {
            this.scene.removeAllKeyListening();
            cardset.select();
        } });
        this.scene.addKeyEscListeningOnce({ onTrigger: () => {
            this.scene.removeAllKeyListening();
            cardset.leave();
        } });
        super.publish('onSelectModeHandZoneCardset');
    }

    async #changeHandZoneToBattleZone(config: { onComplete: () => void }): Promise<void> {
        await super.closeHandZone();
        await super.createGameBoard({ isPowerCardsFaceUp: true });
        await super.openGameBoard();
        if (config?.onComplete) config.onComplete();
    }

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
        cardIds.forEach(cardId => handCardset.highlightCardsById(cardId));
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
                },
                disabled: false
            },
            {
                description: 'No',
                onSelect: () => handCardset.restoreSelectMode(),
                disabled: false
            },
        ]);
        super.openCommandWindow({
            onComplete: () => {
                const commandWindow = super.getCommandWindow();
                this.scene.addKeyUpListening({ onTrigger: () => commandWindow.cursorUp() });
                this.scene.addKeyDownListening({ onTrigger: () => commandWindow.cursorDown() });
                this.scene.addKeyEnterListeningOnce({ onTrigger: () => {
                    this.scene.removeAllKeyListening();
                    commandWindow.select();
                } });
                commandWindow.selectByIndex(0);
                super.publish('onOpenPowerCardSelectionCommandWindow');
            }
        });
    }

    async #startPowerCardPlay(cardId: string): Promise<void> {
        const powerCard = await this.cardBattle.getPowerCardById(this.scene.getPlayerId(), cardId);
        const playerPlay = () => this.#createPowerCardConfig(powerCard);
        //mock
        // const playerPlay = () => this.#finishPowerCardPlay(powerCard, true);
        this.#playPowerCard(powerCard, playerPlay);
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
        super.createTextWindowTop(card.getName(), { textAlign: 'center' });
        super.addTextWindow(card.getEffectDescription());
        super.createCommandWindowBottom('Use this Power Card?', [
            {
                description: 'Yes',
                onSelect: async () => this.#finishPowerCardPlay(card, true),
                disabled: false
            },
            {
                description: 'No',
                onSelect: () => this.#changeBattleZoneToHandZone(),
                disabled: false
            }
        ]);
        super.openAllWindows();
        super.openCommandWindow({
            onComplete: () => {
                const commandWindow = super.getCommandWindow();
                this.scene.addKeyUpListening({ onTrigger: () => commandWindow.cursorUp() });
                this.scene.addKeyDownListening({ onTrigger: () => commandWindow.cursorDown() });
                this.scene.addKeyEnterListeningOnce({ onTrigger: () => {
                    this.scene.removeAllKeyListening();
                    commandWindow.select();
                } });
                commandWindow.selectByIndex(0);
                super.publish('onOpenPowerCardActivationCommandWindow');
            }
        });
    }

    async #finishPowerCardPlay(powerCard: PowerCard, powerCardConfig: any): Promise<void> {
        await super.closeAllWindows();
        // make power card play and remove hand point
        const powerAction = {
            playerId: this.scene.getPlayerId(),
            powerCard: powerCard.staticData,
            config: powerCardConfig 
        };
        await this.cardBattle.makePowerCardPlay(this.scene.getPlayerId(), powerAction);
        super.removeBoardZonePoints(HAND, 1);
        // set board pass
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
        const widthEdge = (this.scene.scale.width - cardset.getX()) - ((CARD_WIDTH * 1.5) - 20);
        const lastIndex = cardset.getCardsLastIndex();
        cardset.setCardAtThePosition(lastIndex, widthEdge);
        cardset.setCardClosedByIndex(lastIndex);
        // show last card (played card)
        super.openCardFromPowerCardsetByIndex(lastIndex, {
            faceUp: true,
            onComplete: () => {
                const cardId = cardset.getCardByIndex(lastIndex).getId();
                cardset.selectCardById(cardId);
                loadPowerActionConfig();
            }
        });
    }

    async #loadPlayAndMovePowerCardToField(): Promise<void> {
        super.getPowerCardset().removeAllSelect();
        super.movePowerCardsetToBoard({ onComplete: () => this.#nextPlay() });
    }

    async #nextPlay(): Promise<void> {
        console.log(await this.cardBattle.hasPowerCardsProcessed());
        if (await this.cardBattle.hasPowerCardsProcessed()) {
            this.changeToTriggerPhase();
            return;
        }
        if (await this.cardBattle.allPass()) {
            super.closeGameBoard({ onComplete: () => this.changeTo() });
            return;
        }
        if (await this.cardBattle.isOpponentPassed(this.scene.getPlayerId())) {
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
                    this.scene.getPlayerId(), 
                    async (opponentPlay: PowerCardPlay) => {
                        await super.closeAllWindows();
                        this.#onOpponentPlay(opponentPlay);
                    }
                );
            }
        });
    }

    async #onOpponentPlay(opponentPlay: PowerCardPlay): Promise<void> {
        const { pass, powerAction } = opponentPlay;
        super.addOpponentBoardPass();
        if (pass) {
            this.#nextPlay();
            return;
        }
        if (await this.cardBattle.isPowerfieldLimitReached() === false) {
            await this.#resetPlay();
        }
        if (powerAction?.powerCard?.getId()) {
            const opponentPlayFunction = async () => {
                await super.closeAllWindows();
                super.removeOpponentBoardZonePoints(HAND, 1);
                this.#loadPlayAndMovePowerCardToField();
            };
            // const powerCard = await this.cardBattle.getOpponentPowerCardById(this.scene.getPlayerId(), powerAction.powerCard.id);
            const powerCard = powerAction.powerCard;
            this.#playPowerCard(powerCard, opponentPlayFunction);
        }
    }

}
