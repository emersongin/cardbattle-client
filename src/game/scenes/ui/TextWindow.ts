import { TextBox } from 'phaser3-rex-plugins/templates/ui/ui-components';

export class TextWindow extends TextBox {
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, text: string) {
        super(scene, {
            x,
            y,
            width,
            height,
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 4, 0x222222),
            text: scene.add.text(0, 0, text, {
                fontSize: '24px',
                align: 'center',
                wordWrap: { 
                    width: width - 20, 
                }
            }),
            expandTextWidth: true,
            space: {
                left: 10, right: 10, top: 10, bottom: 10
            }
        });
        this.layout();
        scene.add.existing(this);
    }
}
