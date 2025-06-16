import { Buttons } from 'phaser3-rex-plugins/templates/ui/ui-components';

interface CommandOption {
    description: string;
    onSelect: () => void;
}

export class CommandWindow extends Buttons {
    #tween: Phaser.Tweens.Tween | null = null;

    private constructor(
        readonly scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        title: string,
        commands: CommandOption[]
    ) {
        super(scene, {
            x,
            y,
            width,
            height,
            orientation: 'y',
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x222222),
            buttons: commands.map(cmd =>
                CommandWindow.createButton(scene, cmd.description, width - 20)
            ),
            space: {
                top: 20,
                bottom: 10,
                item: 10
            },
            align: 'center',
            expand: true
        });

        this.layout();
        this.setScale(1, 0);
        scene.add.existing(this);

        this.addTitle(scene, title, width);

        this.on('button.click', (_button: any, index: number) => {
            commands[index].onSelect();
            this.close();
        });
    }

    static createCentered(scene: Phaser.Scene, title: string, commands: CommandOption[]) {
        const width = (scene.scale.width / 10) * 6;
        const height = commands.length * 50 + 80;
        const x = scene.cameras.main.centerX;
        const y = scene.cameras.main.centerY;
        return new CommandWindow(scene, x, y, width, height, title, commands);
    }

    private static createButton(scene: Phaser.Scene, label: string, width: number) {
        return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, width, 40, 4, 0x444444),
        text: scene.add.text(0, 0, label, {
            fontSize: '20px',
            color: '#ffffff'
        }),
        space: {
            left: 10,
            right: 10,
            top: 5,
            bottom: 5
        }
        });
    }

    private addTitle(scene: Phaser.Scene, title: string, width: number) {
        const titleLabel = scene.add.text(0, 0, title, {
        fontSize: '24px',
        color: '#ffffff',
        align: 'center'
        });
        titleLabel.setOrigin(0.5, 0.5);
        titleLabel.setPosition(this.x, this.y - this.height / 2 + 20);
    }

    open() {
        this.#tween = this.scene.tweens.add({
            targets: this,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }

    close() {
        this.#tween = this.scene.tweens.add({
            targets: this,
            scaleY: 0,
            duration: 300,
            ease: 'Back.easeIn'
        });
    }

    isBusy() {
        return this.#tween !== null && this.#tween.isPlaying();
    }
}
