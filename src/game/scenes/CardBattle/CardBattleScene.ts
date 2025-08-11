import { VueScene } from '../VueScene';
import { Phase } from './phase/Phase';
import { EventBus } from '@game/EventBus';
import { RoomData } from '@/game/types/RoomData';
import { ChallengePhase } from './phase/ChallengePhase';
import { StartPhase } from './phase/StartPhase';
import { DrawPhase } from './phase/DrawPhase';
import { WHITE } from '@/game/constants/colors';
// import { LoadPhase } from './phase/LoadPhase';

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
        this.changePhase(new DrawPhase(this));

        if (this.phase instanceof ChallengePhase) {
            await this.getCardBattle().joinRoom(this.room.roomId);
        }

        if (this.phase instanceof StartPhase) {
            await this.getCardBattle().joinRoom(this.room.roomId);
            await this.getCardBattle().setFolder(this.room.playerId, 'f3');
        }

        if (this.phase instanceof DrawPhase) {
            await this.getCardBattle().joinRoom(this.room.roomId);
            await this.getCardBattle().setFolder(this.room.playerId, 'f3');
            await this.getCardBattle().setMiniGameChoice(this.room.playerId, WHITE);
        }

    }

    changePhase(phase: Phase) {
        this.phase = phase;
        this.phase.create();
    }

    update() {
        if (this.phase) this.phase.update();
    }
}
