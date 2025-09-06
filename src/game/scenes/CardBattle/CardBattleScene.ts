import { EventBus } from '@game/EventBus';
import { WHITE } from '@/game/constants/colors';
import { RoomData } from '@objects/RoomData';
import { VueScene } from '@scenes/VueScene';
import { Phase } from '@scenes/CardBattle/phase/Phase';
import { ChallengePhase } from '@scenes/CardBattle/phase/ChallengePhase';
import { StartPhase } from '@scenes/CardBattle/phase/StartPhase';
import { DrawPhase } from '@scenes/CardBattle/phase/DrawPhase';
import { LoadPhase } from '@scenes/CardBattle/phase/LoadPhase';

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
        // await this.getCardBattle().setPointsToBoard(playerId);
        // await this.getCardBattle().setPointsToBoard(opponentId);
        // LOAD PHASE

        this.changePhase(new ChallengePhase(this));
    }

    changePhase(phase: Phase, ...params: any[]): void {
        this.phase = phase;
        this.phase.create(...(params || []));
    }

}
