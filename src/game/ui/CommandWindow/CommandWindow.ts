import { Sizer, Label } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { DisplayUtil } from '@utils/DisplayUtil';
import { VueScene } from '@game/scenes/VueScene';
import { CommandOption } from '@ui/CommandWindow/CommandOption';
import { TweenConfig } from '@/game/types/TweenConfig';
export class CommandWindow {
    #sizer: Sizer;
    #options: Label[];
    #selectedIndex: number = 0;

    private constructor(
        readonly scene: VueScene,
        x: number,
        y: number,
        width: number,
        height: number,
        title: string,
        readonly commands: CommandOption[]
    ) {
        const vertical = 1;
        this.#sizer = new Sizer(scene, {
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
        this.#sizer.layout();
        this.#sizer.setScale(1, 0);
        scene.add.existing(this.#sizer);
    }

    static createBottom(scene: VueScene, title: string, commands: CommandOption[]) {
        const width = scene.scale.width;
        const height = DisplayUtil.column3of12(scene.scale.height);
        const x = width / 2;
        const y = (scene.scale.height - height);
        return new CommandWindow(scene, x, y, width, height, title, commands);
    }

    static createCentered(scene: VueScene, title: string, commands: CommandOption[]) {
        const width = scene.scale.width;
        const height = DisplayUtil.column3of12(scene.scale.height);
        const x = width / 2;
        const y = scene.scale.height / 2;
        return new CommandWindow(scene, x, y, width, height, title, commands);
    }

    open(config?: TweenConfig) {
        this.scene.tweens.add({
            targets: this,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                if (config?.onComplete) config.onComplete();
            }
        });
    }

    #createBackground(scene: Phaser.Scene) {
        const background = scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x000000);
        background.setAlpha(0.8);
        this.#sizer.addBackground(background);
    }

    #createTitle(scene: Phaser.Scene, title: string) {
        const titleLabel = scene.rexUI.add.label({
            text: scene.add.text(0, 0, ` ${title}`, {
                fontSize: '24px',
                color: '#ffffff'
            }),
            align: 'center'
        });
        this.#sizer.add(titleLabel, { align: 'left', expand: false, padding: { top: 20, bottom: 20 } });
    }
    
    #createOptions(scene: Phaser.Scene, width: number, commands: CommandOption[]) {
        this.#options = commands.map(cmd => {
            const option = CommandWindow.#createOption(scene, cmd.description, width - 20, cmd.disabled);
            this.#sizer.add(option, { align: 'center', expand: true });
            return option;
        });
    }

    static #createOption(scene: Phaser.Scene, label: string, width: number, disabled: boolean = false): Label {
        return scene.rexUI.add.label({
            background: scene.rexUI.add.roundRectangle(0, 0, width, 40, 4, 0x444444),
            text: scene.add.text(0, 0, label, {
                fontSize: '20px',
                color: disabled ? '#222' : '#fff'
            }),
            space: {
                left: 10,
                right: 10,
                top: 5,
                bottom: 5
            }
        });
    }

    cursorUp(): void {
        this.selectByIndex(this.#selectedIndex - 1);
    }

    cursorDown(): void {
        this.selectByIndex(this.#selectedIndex + 1);
    }

    selectByIndex(newIndex: number): void {
        this.#setSelectIndex(newIndex);
        this.#updateOptions();
    }

    select(): void {
        if (this.commands[this.#selectedIndex].disabled) {
            console.log('Sound disabled command');
            return;
        }
        this.#close({
            onComplete: async () => {
                await this.commands[this.#selectedIndex].onSelect();
            }
        });
    }

    #close(config?: TweenConfig) {
        this.scene.tweens.add({
            targets: this,
            scaleY: 0,
            duration: 300,
            ease: 'Back.easeIn',
            onComplete: async () => {
                this.#sizer.scaleY = 0;
                if (config?.onComplete) config.onComplete();
                this.#sizer.destroy();
            }
        });
    }

    #setSelectIndex(newIndex: number) {
        const limit = this.commands.length - 1;
        if (newIndex < 0) newIndex = 0;
        if (newIndex > limit) newIndex = limit;
        this.#selectedIndex = newIndex;
    }

    #updateOptions() {
        this.#options.forEach((opt: Label, index: number) => {
            const bg = opt.getElement('background') as Phaser.GameObjects.Shape;
            if (bg) bg.setFillStyle(index === this.#selectedIndex ? 0x8888ff : 0x444444);
        });
    }
}
