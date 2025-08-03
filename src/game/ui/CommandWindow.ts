import { Sizer, Label } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { DisplayUtil } from '@utils/DisplayUtil';

type CommandOption = {
    description: string;
    onSelect: () => Promise<void> | void;
}

export class CommandWindow extends Sizer {
    #tween: Phaser.Tweens.Tween | null = null;
    private selectedIndex: number = 0;
    private options: Label[];

    private constructor(
        readonly scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        title: string,
        readonly commands: CommandOption[]
    ) {
        const vertical = 1;
        super(scene, {
            x,
            y,
            width,
            height,
            orientation: vertical,
            space: { item: 6 },
        });

        this.#createBackground(scene);
        this.#createTitle(scene, title);
        this.#createOptions(scene, width, commands);

        this.layout();
        this.setScale(1, 0);
        scene.add.existing(this);
    }

    static createBottom(scene: Phaser.Scene, title: string, commands: CommandOption[]) {
        const width = scene.scale.width;
        const height = DisplayUtil.column3of12(scene.scale.height);
        const x = width / 2;
        const y = (scene.scale.height - height);
        return new CommandWindow(scene, x, y, width, height, title, commands);
    }

    static createCentered(scene: Phaser.Scene, title: string, commands: CommandOption[]) {
        const width = scene.scale.width;
        const height = DisplayUtil.column3of12(scene.scale.height);
        const x = width / 2;
        const y = scene.scale.height / 2;
        return new CommandWindow(scene, x, y, width, height, title, commands);
    }

    open() {
        this.#tween = this.scene.tweens.add({
            targets: this,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.#setupKeyboardControls();
                this.#select(0);
            }
        });
    }

    #createBackground(scene: Phaser.Scene) {
        const background = scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x000000);
        background.setAlpha(0.8);
        this.addBackground(background);
    }

    #createTitle(scene: Phaser.Scene, title: string) {
        const titleLabel = scene.rexUI.add.label({
            text: scene.add.text(0, 0, ` ${title}`, {
                fontSize: '24px',
                color: '#ffffff'
            }),
            align: 'center'
        });
        this.add(titleLabel, { align: 'left', expand: false, padding: { top: 20, bottom: 20 } });
    }
    
    #createOptions(scene: Phaser.Scene, width: number, commands: CommandOption[]) {
        this.options = commands.map(cmd => {
            const option = CommandWindow.#createOption(scene, cmd.description, width - 20);
            this.add(option, { align: 'center', expand: true });
            return option;
        });
    }

    static #createOption(scene: Phaser.Scene, label: string, width: number): Label {
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

    #setupKeyboardControls() {
        const keyboard = this.scene.input.keyboard;
        if (!keyboard) {
            throw new Error('Keyboard input not available');
        }

        keyboard.on('keydown-UP', () => {
            this.#select(this.selectedIndex - 1);
        });

        keyboard.on('keydown-DOWN', () => {
            this.#select(this.selectedIndex + 1);
        });

        keyboard.on('keydown-ENTER', () => {
            if (!keyboard) {
                throw new Error('Keyboard input not available');
            }
            keyboard.removeAllListeners();
            this.close(this.commands[this.selectedIndex].onSelect);
        });
    }

    close(onSelect: () => Promise<void> | void) {
        this.#tween = this.scene.tweens.add({
            targets: this,
            scaleY: 0,
            duration: 300,
            ease: 'Back.easeIn',
            onComplete: async () => await onSelect()
        });
    }

    #select(newIndex: number) {
        this.#setSelectIndex(newIndex);
        this.#updateOptions();
    }

    #setSelectIndex(newIndex: number) {
        const limit = this.commands.length - 1;
        if (newIndex < 0) newIndex = 0;
        if (newIndex > limit) newIndex = limit;
        this.selectedIndex = newIndex;
    }

    #updateOptions() {
        this.options.forEach((opt: Label, i: number) => {
            const bg = opt.getElement('background') as Phaser.GameObjects.Shape;
            if (bg) bg.setFillStyle(i === this.selectedIndex ? 0x8888ff : 0x444444);
        });
    }
}
