import { Phase } from "./Phase";
import { TextWindow } from '@ui/TextWindow';

export class ChallengePhase implements Phase {
    constructor(readonly scene: Phaser.Scene) {}

    create(): void {
        TextWindow.createCenteredWindow(this.scene, 'Welcome to the Card Battle!', () => {
            console.log('Text box closed');
        });
    }

    update(): void {
        console.log("Updating Challenge Phase...");
    }
    
}