import { Phase } from "./Phase";
import { CardBattlePhase } from "./CardBattlePhase";
import { SummonPhase } from "./SummonPhase";
import { TriggerPhase } from "./TriggerPhase";
import { HAND, LOAD_PHASE } from "@/game/constants/keys";
import { CardData } from "@/game/types";
import { LoadPhasePlay } from "@/game/api/CardBattle";
import { CARD_WIDTH } from "@/game/constants/default";
import { CardUi } from "@/game/ui/Card/CardUi";
import { TimelineEvent } from "../../VueScene";
import { CloseCardsetEvents } from "@/game/ui/Cardset/types/CloseCardsetEvents";
import { OpenCardsetEvents } from "@/game/ui/Cardset/types/OpenCardsetEvents";

export class LoadPhase extends CardBattlePhase implements Phase {

    async create(): Promise<void> {
        this.#createLoadPhaseWindows();
        super.openAllWindows();
    }

    #createLoadPhaseWindows(): void {
        super.createTextWindowCentered('Load Phase started!', {
            textAlign: 'center',
            onClose: () => this.#loadLoadPhase()
        });
        super.addTextWindow('Select and use a Power Card');
    }

    async #loadLoadPhase(): Promise<void> {
        await this.#createGameBoard();
        this.#openGameBoard();
        if (await this.cardBattle.isStartPlaying(this.scene.room.playerId)) {
            this.#goPlay();
            return;
        }
        this.#nextPlay();
    }

    async #createGameBoard(): Promise<void> {
        const board = await this.cardBattle.getBoard(this.scene.room.playerId);
        const opponentBoard = await this.cardBattle.getOpponentBoard(this.scene.room.playerId);
        const powerCards: CardData[] = await this.cardBattle.getFieldPowerCards();
        super.createOpponentBoard(opponentBoard);
        super.createBoard(board);
        super.createFieldCardset(powerCards);

    }

    #openGameBoard(config?: OpenCardsetEvents): void {
        super.openOpponentBoard();
        super.openBoard();
        super.openFieldCardset(config);
    }

    async #goPlay(): Promise<void> {
        await this.#resetPlay();
        await this.#createCommandWindow();
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
                    onSelect: () => this.#onUsePowerCard()
                },
                {
                    description: 'No',
                    onSelect: () => this.#onPassPlay()
                }
            ]);
            resolve();
        });
    }

    #onUsePowerCard(): void {
        super.closeOpponentBoard();
        super.closeBoard();
        super.closeFieldCardset({ onComplete: () => this.#createHandZone() });
    }

    async #onPassPlay(): Promise<void> {
        await this.#passPlay();
        this.#nextPlay();
    }

    #passPlay(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            await this.cardBattle.pass(this.scene.room.playerId);
            super.addBoardPass();
            resolve();
        });
    }

    #createHandZone(): void {
        this.#createHandDisplayWindows();
        this.#createHandCardset();
    }

    #createHandDisplayWindows(): void {
        super.createTextWindowTop('Your Hand', {
            textAlign: 'center',
        });
        super.addTextWindow('...', { marginTop: 32 });
        super.addTextWindow('...');
        super.addTextWindow('...');
    }

    async #createHandCardset(): Promise<void> {
        const cards: CardData[] = await this.cardBattle.getHandCards(this.scene.room.playerId);
        const cardset = super.createHandCardset(cards);
        cardset.setCardsInLinePosition();
        cardset.setCardsClosed();
        this.#openHandCardset();
    }

    #openHandCardset(): void {
        const cardset = super.getCardset();
        cardset.disableBattleCards();
        super.openCardset({ onComplete: () => {
            super.openAllWindows();
            super.openBoard();
            cardset.selectModeOne({
                onChangeIndex: (cardIndex: number) => this.#onChangeHandCardsetIndex(cardIndex),
                onComplete: (cardIndexes: number[]) => this.#onSelectHandCardsetCard(cardIndexes),
                onLeave: () => this.#onLeaveHand(),
            });
        }});
    }

    #onChangeHandCardsetIndex(cardIndex: number): void {
        const cardset = super.getCardset();
        if (!cardset.isValidIndex(cardIndex)) return;
        super.setTextWindowText(cardset.getCardByIndex(cardIndex).getName(), 1);
        super.setTextWindowText(cardset.getCardByIndex(cardIndex).getDescription(), 2);
        super.setTextWindowText(cardset.getCardByIndex(cardIndex).getDetails(), 3);
    }

    #onSelectHandCardsetCard(cardIndexes: number[]): void {
        const cardset = super.getCardset();
        cardset.highlightCardsByIndexes(cardIndexes);
        super.createCommandWindowBottom('Complete your choice?', [
            {
                description: 'Yes',
                onSelect: () => this.#onPlayPowerCard(cardIndexes.shift() || 0)
            },
            {
                description: 'No',
                onSelect: () => cardset.restoreSelectState()
            },
        ]);
        super.openCommandWindow();
    }

    #onPlayPowerCard(cardIndex: number): void {
        this.#closeHandBoard({ onComplete: () => {
            this.#openGameBoard({ onComplete: () => this.#loadPowerCardAction(cardIndex) });
        }});
    }

    #closeHandBoard(config: CloseCardsetEvents): void {
        super.closeAllWindows();
        super.closeBoard();
        super.closeCardset(config);
    }

    async #loadPowerCardAction(cardIndex: number): Promise<void> {
        const powerCard = await this.cardBattle.getPowerCardByIndex(this.scene.room.playerId, cardIndex);
        this.#playPowerCard(powerCard, () => {
            this.removeBoardZonePoints(HAND, 1);
            this.#onSetPowerCardAction(powerCard);
        });
    }

    async #onSetPowerCardAction(powerCard: CardData): Promise<void> {
        console.log('Set power card play!');
        const powerAction = {
            powerCard,
            // action:{} config...
        }
        await this.cardBattle.makePowerCardPlay(this.scene.room.playerId, powerAction);
        await this.#passPlay();
        if (!await this.cardBattle.isPowerfieldLimitReached()) {
            super.removeOpponentBoardPass();
        }
        this.#loadPlayAndMovePowerCardToField();
    }

    #onLeaveHand(): void {
        this.#closeHandBoard({ onComplete: () => {
            this.#openGameBoard({ onComplete: () => this.#goPlay() });
        }});
    }

    async #playPowerCard(powerCard: CardData, onComplete: () => void): Promise<void> {
        const powerCards: CardData[] = await this.cardBattle.getFieldPowerCards();
        const powerCardsFiltered = powerCards.filter(card => card.id !== powerCard.id);
        const cardset = super.createFieldCardset([...powerCardsFiltered, powerCard]);
        cardset.setCardsInLinePosition();
        const widthEdge = (this.scene.scale.width - cardset.x) - ((CARD_WIDTH * 1.5) - 20);
        const lastIndex = cardset.getCardsLastIndex();
        cardset.setCardAtPosition(lastIndex, widthEdge);
        cardset.setCardClosedByIndex(lastIndex);
        super.openFieldCardsetCardByIndex(lastIndex, {
            onComplete: () => {
                const card = cardset.getCardByIndex(lastIndex);
                cardset.selectCard(card);
                onComplete(); // show select power action config or not
                // this.#createPowerCardWindows(powerCard); vai no onComplete
            }
        });
    }

    // comportamento de selecção yes ou no, poder ter outros como selecioanr outros cartões do jogo
    // #createPowerCardWindows(powerCard: CardData): void {
    //     super.createTextWindowTop(powerCard.name, { textAlign: 'center' });
    //     super.addTextWindow(`${powerCard.description} ${powerCard.description} ${powerCard.description}`);
    //     super.createCommandWindowBottom('Use this Power Card?', [
    //         {
    //             description: 'Yes',
    //             onSelect: async () => {
    //                 const powerAction = {
    //                     powerCard,
    //                     // action:{} config...
    //                 };
    //                 await this.cardBattle.makePowerCardPlay(this.scene.room.playerId, powerAction);
    //                 this.#loadPlayAndMovePowerCardToField();
    //             }
    //         },
    //         {
    //             description: 'No',
    //             onSelect: () => {
    //                 super.closeAllWindows();
    //                 super.closeOpponentBoard();
    //                 super.closeBoard();
    //                 super.closeFieldCardset({ onComplete: () => this.#createHandZone() });
    //             }
    //         }
    //     ]);
    //     super.openAllWindows();
    //     super.openCommandWindow();
    // }

    #createOpponentPlayingWaitingWindow(): void {
        super.createWaitingWindow('Waiting for opponent to play...');
    }

    #loadPlayAndMovePowerCardToField(): void {
        super.closeAllWindows();
        const cardset = super.getFieldCardset();
        const lastIndex = cardset.getCardsLastIndex();
        const card = cardset.getCardByIndex(lastIndex);
        cardset.deselectCard(card);
        this.#movePowerCardToField();
    }

    #movePowerCardToField(): void {
        const totalCards = this.getFieldCardset().getCardsTotal();
        const moveConfig = {
            targets: this.getFieldCardset().getCardsUi(),
            x: 0,
            eachX: CARD_WIDTH,
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                card.moveFromTo({
                    xTo: 0 + (index! * CARD_WIDTH),
                    yTo: 0,
                    delay: (index! * 100), 
                    duration: (300 / totalCards) * (totalCards - index!),
                    onComplete: () => resume()
                });
            },
            onAllComplete: () => this.#nextPlay(),
        };
        this.scene.timeline(moveConfig);
    }

    async #nextPlay(): Promise<void> {
        if (await this.cardBattle.isPowerfieldLimitReached()) {
            this.changeToTriggerPhase(LOAD_PHASE);
            return;
        }
        if (await this.cardBattle.allPass()) {
            if (await this.cardBattle.hasPowerCardsInField()) {
                this.changeToTriggerPhase(LOAD_PHASE);
                return;
            }
            this.changeToSummonPhase();
            return;
        }
        if (await this.cardBattle.isOpponentPassed(this.scene.room.playerId)) {
            this.#goPlay();
            return;
        }
        this.#createOpponentPlayingWaitingWindow();
        super.openAllWindows({
            onComplete: async () => {
                await this.cardBattle.listenOpponentPlay(
                    this.scene.room.playerId, 
                    (opponentPlay: LoadPhasePlay) => this.#loadOpponentPlay(
                            opponentPlay.pass, 
                            opponentPlay.powerAction!.powerCard
                        )
                );
            }
        });
    }

    async #loadOpponentPlay(pass: boolean, powerCard?: CardData): Promise<void> {
        super.closeAllWindows({ onComplete: async () => {
            super.addOpponentBoardPass();
            if (pass) {
                this.#nextPlay();
                return;
            }
            if (!await this.cardBattle.isPowerfieldLimitReached()) {
                await this.#resetPlay();
            }
            if (!pass && powerCard) {
                this.#playPowerCard(powerCard, () => {
                    this.removeOpponentBoardZonePoints(HAND, 1);
                    this.#loadPlayAndMovePowerCardToField();
                });
            }
        }})
    }




























    // #createZoneCommandWindow(): void {
    //     const options = [
    //         {
    //             description: 'Play Power card',
    //             onSelect: () => {
    //                 this.#powerSlots.addPowerSlot({
    //                     action: 'POWER_1',
    //                     params: {
    //                         cardId: 'card_1',
    //                         zone: 'player'
    //                     } 
    //                 });
    //                 if (this.#powerSlots.isLimitReached()) {
    //                     this.changeToTriggerPhase(LOAD_PHASE);
    //                     return;
    //                 }
    //                 this.changeToLoadPhase();
    //             }
    //         },
    //         {
    //             description: 'Trash',
    //             onSelect: () => {
    //                 this.changeToLoadPhase();
    //             }
    //         },
    //         {
    //             description: 'Field',
    //             onSelect: () => {
    //                 this.changeToLoadPhase();
    //             }
    //         },
    //         {
    //             description: 'Hand',
    //             onSelect: () => {
    //                 this.changeToLoadPhase();
    //             }
    //         }
    //     ];
    //     super.createCommandWindowBottom('Select your zone', options);
    // }

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
        throw new Error("Method not implemented.");
    }

    changeToTriggerPhase(origin: string): void {
        this.scene.changePhase(new TriggerPhase(this.scene, origin));
    }

    changeToSummonPhase(): void {
        this.closeBoard({ onComplete: () => this.scene.changePhase(new SummonPhase(this.scene)) });
        this.closeOpponentBoard();
    }

    changeToCompilePhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToBattlePhase(): void {
        throw new Error("Method not implemented.");
    }
    
    destroy(): void {
        super.destroyAllTextWindows();
    }
}