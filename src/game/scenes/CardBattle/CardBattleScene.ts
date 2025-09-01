import { VueScene } from '../VueScene';
import { Phase } from './phase/Phase';
import { EventBus } from '@game/EventBus';
import { RoomData } from '@/game/types/RoomData';
import { ChallengePhase } from './phase/ChallengePhase';
import { StartPhase } from './phase/StartPhase';
import { DrawPhase } from './phase/DrawPhase';
import { WHITE } from '@/game/constants/colors';
import { LoadPhase } from './phase/LoadPhase';

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
        this.room = await this.getCardBattle().createRoom();
        const { roomId, playerId } = this.room;
        const { playerId: opponentId }: RoomData = await this.getCardBattle().joinRoom(roomId);

        // START PHASE
        // await this.getCardBattle().setFolder(playerId, 'f3');
        // DRAW PHASE
        // await this.getCardBattle().setMiniGameChoice(playerId, WHITE);
        // await this.getCardBattle().setReadyDrawCards(opponentId);
        // await this.getCardBattle().setReadyDrawCards(playerId);
        // LOAD PHASE

        this.changePhase(new ChallengePhase(this));
    }

    changePhase(phase: Phase, ...params: any[]): void {
        this.phase = phase;
        this.phase.create(...(params || []));
    }

}
