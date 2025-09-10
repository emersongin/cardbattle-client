import { EventBus } from '@game/EventBus';
import { WHITE } from '@/game/constants/colors';
import { RoomData } from '@objects/RoomData';
import { VueScene } from '@scenes/VueScene';
import { Phase } from '@scenes/CardBattle/phase/Phase';
import { ChallengePhase } from '@scenes/CardBattle/phase/ChallengePhase';
import { StartPhase } from '@scenes/CardBattle/phase/StartPhase';
import { DrawPhase } from '@scenes/CardBattle/phase/DrawPhase';
import { LoadPhase } from '@scenes/CardBattle/phase/LoadPhase';
import { SummonPhase } from './phase/SummonPhase';
import { CompilePhase } from './phase/CompilePhase';
import { BATTLE } from '@/game/constants/keys';

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
        // console.log(await this.getCardBattle().getOpponentCardsFromHand(opponentId));
        
        // const playerBattleCards = await this.getCardBattle().getCardsFromHand(playerId);
        // const playerCardIds = playerBattleCards.filter(c => c.typeId === BATTLE).map(c => c.id);
        // await this.getCardBattle().setBattleCards(playerId, playerCardIds);

        // console.log(await this.getCardBattle().getOpponentCardsFromHand(opponentId));
        // const opponentBattleCards = await this.getCardBattle().getOpponentCardsFromHand(opponentId);
        // const opponentCardIds = opponentBattleCards.filter(c => c.typeId === BATTLE).map(c => c.id);
        // await this.getCardBattle().setBattleCards(opponentId, opponentCardIds);

        this.changePhase(new LoadPhase(this));
    }

    changePhase(phase: Phase, ...params: any[]): void {
        this.phase = phase;
        this.phase.create(...(params || []));
    }

}
