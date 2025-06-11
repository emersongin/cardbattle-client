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
        const x = this.scale.width / 2;
        const y = (this.scale.height / 2) - (this.scale.height / 8 / 2);
        const width = this.scale.width / 2;
        const height = this.scale.height / 8;
        new TextWindow(this,  x, y, width, height, 'Welcome to the Card Battle! This is a simple text window example using Phaser 3 and RexUI plugin.');
    }
}
