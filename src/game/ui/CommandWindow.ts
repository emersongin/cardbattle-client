import { Sizer, Label } from 'phaser3-rex-plugins/templates/ui/ui-components';

interface CommandOption {
    description: string;
    onSelect: () => void;
}

export class CommandWindow extends Sizer {
    #tween: Phaser.Tweens.Tween | null = null;
    private selectedIndex: number = 0;
    private buttons: Label[];

    private constructor(
        readonly scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        title: string,
        readonly commands: CommandOption[]
    ) {
        super(scene, {
            x,
            y,
            width,
            height,
            orientation: 1, // vertical
            space: { item: 10 },
        });

        const background = scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x222222);
        this.addBackground(background);

        const titleLabel = scene.rexUI.add.label({
            text: scene.add.text(0, 0, title, {
                fontSize: '24px',
                color: '#ffffff'
            }),
            align: 'center'
        });

        this.add(titleLabel, { align: 'center', expand: false, padding: { top: 10 } });

        this.buttons = commands.map(cmd =>
            CommandWindow.createButton(scene, cmd.description, width - 20)
        );

        this.buttons.forEach(btn => {
            this.add(btn, { align: 'center', expand: true });
        });

        this.layout();
        this.setScale(1, 0);
        scene.add.existing(this);
    }

    static createCentered(scene: Phaser.Scene, title: string, commands: CommandOption[]) {
        const width = (scene.scale.width / 10) * 6;
        const height = commands.length * 50 + 100;
        const x = scene.cameras.main.centerX;
        const y = scene.cameras.main.centerY;
        return new CommandWindow(scene, x, y, width, height, title, commands);
    }

    private static createButton(scene: Phaser.Scene, label: string, width: number): Label {
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

    open() {
        this.#tween = this.scene.tweens.add({
            targets: this,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.setupKeyboardControls();
                this.select(0);
            }
        });
    }

    private setupKeyboardControls() {
        const keyboard = this.scene.input.keyboard;
        if (!keyboard) {
            throw new Error('Keyboard input not available');
        }

        keyboard.on('keydown-UP', () => {
            this.select(this.selectedIndex - 1);
        });

        keyboard.on('keydown-DOWN', () => {
            this.select(this.selectedIndex + 1);
        });

        keyboard.on('keydown-SPACE', () => {
            if (!keyboard) {
                throw new Error('Keyboard input not available');
            }
            keyboard.removeAllListeners();
            this.close(this.commands[this.selectedIndex].onSelect);
        });
    }

    private select(newIndex: number) {
        const limit = this.commands.length - 1;
        if (newIndex < 0) newIndex = 0;
        if (newIndex > limit) newIndex = limit;

        this.selectedIndex = newIndex;

        this.buttons.forEach((btn, i) => {
            const bg = btn.getElement('background');
            if (bg) {
                bg.setFillStyle(i === newIndex ? 0x8888ff : 0x444444);
            }
        });
    }

    close(onSelect: Function) {
        this.#tween = this.scene.tweens.add({
            targets: this,
            scaleY: 0,
            duration: 300,
            ease: 'Back.easeIn',
            onComplete: () => {
                onSelect();
            }
        });
    }

    isBusy() {
        return this.#tween !== null && this.#tween.isPlaying();
    }
}
