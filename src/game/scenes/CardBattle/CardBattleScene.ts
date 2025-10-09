import { EventBus } from '@game/EventBus';
import { ORANGE, WHITE } from '@game/constants/colors';
import { RoomData } from '@objects/RoomData';
import { VueScene } from '@scenes/VueScene';
import { Phase } from '@scenes/CardBattle/phase/Phase';
import { ChallengePhase } from '@scenes/CardBattle/phase/ChallengePhase';
import { StartPhase } from '@scenes/CardBattle/phase/StartPhase';
import { DrawPhase } from '@scenes/CardBattle/phase/DrawPhase';
import { LoadPhase } from '@scenes/CardBattle/phase/LoadPhase';
import { SummonPhase } from './phase/SummonPhase';
import { CompilePhase } from './phase/CompilePhase';
import Card from 'phaser3-rex-plugins/plugins/gameobjects/mesh/perspective/card/Card';
import { CardColorType } from '@game/types/CardColorType';

export class CardBattleScene extends VueScene {
    room: RoomData;
    private phase: Phase;
    
    constructor () {
        super('CardBattleScene');
    }

    init () {
        EventBus.emit('current-scene-ready', this);
    }

    async create () {
        // CREATE ROOM
        this.room = await this.getCardBattle().createRoom();
        const { roomId, playerId } = this.room;
        
        // CHALLENGE PHASE
        const { playerId: opponentId }: RoomData = await this.getCardBattle().joinRoom(roomId);
        
        // START PHASE
        await this.getCardBattle().setFolder(playerId, 'f3');
        
        // DRAW PHASE
        await this.getCardBattle().setMiniGameChoice(playerId, WHITE);
        
        // LOAD PHASE
        // await this.getCardBattle().setReadyDrawCards(opponentId);
        // await this.getCardBattle().setReadyDrawCards(playerId);
        
        // SUMMON PHASE
        // nothing to do here
        
        // COMPILE PHASE
        // const playerCards = await this.getCardBattle().getCardsFromHand(playerId);
        // const playerBoard = await this.getCardBattle().getBoard(playerId);
        // const playerCardIds = playerCards.filter(card => {
        //     if (card.staticData.color === ORANGE) return true;
        //     const colorPoints = playerBoard[card.staticData.color];
        //     if (colorPoints < card.staticData.cost) return false;
        //     playerBoard[card.staticData.color] = colorPoints - card.staticData.cost;
        //     return true;
        // }).map(card => card.staticData.id);
        // await this.getCardBattle().setBattleCards(playerId, playerCardIds);
        // const opponentCards = await this.getCardBattle().getCardsFromHand(opponentId);
        // const opponentBoard = await this.getCardBattle().getBoard(opponentId);
        // const opponentCardIds = opponentCards.filter(card => {
        //     if (card.staticData.color === ORANGE) return true;
        //     const colorPoints = opponentBoard[card.staticData.color];
        //     if (colorPoints < card.staticData.cost) return false;
        //     opponentBoard[card.staticData.color] = colorPoints - card.staticData.cost;
        //     return true;
        // }).map(card => card.staticData.id);
        // await this.getCardBattle().setBattleCards(opponentId, opponentCardIds);

        this.changePhase(new DrawPhase(this));
    }

    changePhase(phase: Phase, ...params: any[]): void {
        this.phase = phase;
        this.phase.create(...(params || []));
    }

}
