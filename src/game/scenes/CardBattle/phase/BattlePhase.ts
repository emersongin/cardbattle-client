import { Phase } from "@scenes/CardBattle/phase/Phase";
import { CardBattlePhase } from './CardBattlePhase';
import { CardActionsBuilder } from "@/game/ui/Card/CardActionsBuilder";
import { CARD_HEIGHT, CARD_WIDTH } from "@/game/constants/default";
import { TimelineEvent } from "../../VueScene";
import { CardUi } from "@/game/ui/Card/CardUi";

export class BattlePhase extends CardBattlePhase implements Phase {
    
    create(): void {
        const onClose = async () => {
            await super.createGameBoard();
            await super.openGameBoard();
            await super.createTextWindowCentered('Card Battle', { 
                textAlign: 'center', 
                onClose: () => this.#startBattle()
            });
            super.openAllWindows();
        }
        super.createTextWindowCentered('Battle Phase', { textAlign: 'center', onClose });
        super.addTextWindow('Start Battle!');
        super.openAllWindows();
    }

    #startBattle(): void {
        this.#startPlayerAttack();
    }

    #startPlayerAttack(): void {
        const cardset = super.getCardset();
        const opponentCardset = super.getOpponentCardset();
        const relativeX = opponentCardset.x - cardset.x;
        const relativeY = opponentCardset.y - cardset.y;
        const moveX = relativeX + (((opponentCardset.getCardsTotal() * CARD_WIDTH)  / 2) - (CARD_WIDTH / 2));
        const moveY = relativeY + (CARD_HEIGHT / 2);
        const flashAllOpponentCards = () => {
            opponentCardset.getCards().forEach(opponentCard => {
                CardActionsBuilder.create(opponentCard)
                    .flash({ 
                        color: 0xff0000, 
                        delay: 0, 
                        duration: 10 
                    })
                    .play();
            });
        }
        const cardsUis = cardset.getCardsUi();
        this.scene.children.bringToTop(cardset);
        const moveConfig = {
            targets: cardsUis,
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                CardActionsBuilder
                    .create(card)
                    .open({ delay: 0, duration: 0 })
                    .move({
                        toX: moveX,
                        toY: moveY,
                        delay: (index * 500), 
                        duration: 100,
                        onComplete: () => flashAllOpponentCards()
                    })
                    .move({
                        toX: card.getOriginX(),
                        toY: card.getOriginY(),
                        delay: 0, 
                        duration: 400,
                        onComplete: () => resume()
                    })
                    .play();
            },
            onAllComplete: () => {
                this.#startOpponentAttack();
            }
        };
        this.scene.timeline(moveConfig);
    }

    #startOpponentAttack(): void {
        const cardset = super.getOpponentCardset();
        const opponentCardset = super.getCardset();
        const relativeX = opponentCardset.x - cardset.x;
        const relativeY = opponentCardset.y;
        const moveX = relativeX + (((opponentCardset.getCardsTotal() * CARD_WIDTH)  / 2) - (CARD_WIDTH / 2));
        const moveY = relativeY - CARD_HEIGHT;
        const flashAllOpponentCards = () => {
            opponentCardset.getCards().forEach(opponentCard => {
                CardActionsBuilder.create(opponentCard)
                    .flash({ 
                        color: 0xff0000, 
                        delay: 0, 
                        duration: 10 
                    })
                    .play();
            });
        }
        const cardsUis = cardset.getCardsUi();
        this.scene.children.bringToTop(cardset);
        const moveConfig = {
            targets: cardsUis,
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                CardActionsBuilder
                    .create(card)
                    .open({ delay: 0, duration: 0 })
                    .move({
                        toX: moveX,
                        toY: moveY,
                        delay: (index * 500), 
                        duration: 100,
                        onComplete: () => flashAllOpponentCards()
                    })
                    .move({
                        toX: card.getOriginX(),
                        toY: card.getOriginY(),
                        delay: 0, 
                        duration: 400,
                        onComplete: () => resume()
                    })
                    .play();
            },
            onAllComplete: () => {
                
            }
        };
        this.scene.timeline(moveConfig);
    }
}