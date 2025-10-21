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
import { CardColorType } from '@game/types/CardColorType';
import { BattlePhase } from './phase/BattlePhase';
import { POWER } from '@/game/constants/keys';

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
        await this.getCardBattle().setReadyDrawCards(opponentId);
        await this.getCardBattle().setReadyDrawCards(playerId);
        
        // SUMMON PHASE
        // nothing to do here
        
        // COMPILE PHASE
        // const playerCards = await this.getCardBattle().getCardsFromHand(playerId);
        // const playerBoard = await this.getCardBattle().getBoard(playerId);
        // const playerCardIds = playerCards.filter(card => {
        //     const cardColor = card.getColor() as CardColorType;
        //     const cardType = card.getType();
        //     if (cardType === POWER) return false;
        //     if (cardColor === ORANGE) return true;
        //     const colorPoints = playerBoard.getAllData()[cardColor];
        //     if (colorPoints < card.staticData.cost) return false;
        //     playerBoard.getAllData()[cardColor] = colorPoints - card.staticData.cost;
        //     return true;
        // }).map(card => card.staticData.id);
        // await this.getCardBattle().setBattleCards(playerId, playerCardIds);
        // const opponentCards = await this.getCardBattle().getCardsFromHand(opponentId);
        // const opponentBoard = await this.getCardBattle().getBoard(opponentId);
        // const opponentCardIds = opponentCards.filter(card => {
        //     const cardColor = card.getColor() as CardColorType;
        //     const cardType = card.getType();
        //     if (cardType === POWER) return false;
        //     if (cardColor === ORANGE) return true;
        //     const colorPoints = opponentBoard.getAllData()[cardColor];
        //     if (colorPoints < card.staticData.cost) return false;
        //     opponentBoard.getAllData()[cardColor] = colorPoints - card.staticData.cost;
        //     return true;
        // }).map(card => card.staticData.id);
        // await this.getCardBattle().setBattleCards(opponentId, opponentCardIds);

        // BATTLE PHASE

        this.changePhase(new LoadPhase(this));
    }

    changePhase(phase: Phase, ...params: any[]): void {
        this.phase = phase;
        this.phase.create(...(params || []));
    }

    isPhase(phaseName: string): boolean {
        return this.phase && this.phase.constructor.name === phaseName;
    }

}
