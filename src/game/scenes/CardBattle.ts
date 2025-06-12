import { Scene } from 'phaser';
import { TextWindow } from './ui/TextWindow';

export class CardBattle extends Scene
{
    constructor ()
    {
        super('CardBattle');
    }

    preload () {
        
    }

    create () {
        TextWindow.createCenteredWindow(this, 'Welcome to the Card Battle!', () => {
            console.log('Text box closed');
        });
    }
}
