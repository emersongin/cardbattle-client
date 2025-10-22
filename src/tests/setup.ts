import { vi } from 'vitest';
import PhaserMock from './mocks/phaser';
import { TextWindow } from '@game/ui/TextWindows/TextWindow';
import { BoardWindow } from '@game/ui/BoardWindow/BoardWindow';

(globalThis as any).Phaser = PhaserMock;

vi.stubGlobal('Phaser', PhaserMock);

vi.mock('phaser3-rex-plugins/templates/ui/ui-components', () => {
    return {
        TextBox: vi.fn().mockImplementation(() => {
            return {
                layout: vi.fn(),
                setScale: vi.fn(),
                setStartClose: vi.fn(),
                open: vi.fn(TextWindow.prototype.open),
                isOpen: vi.fn(TextWindow.prototype.isOpen),
                close: vi.fn(TextWindow.prototype.close),
                hasOnCloseFunction: vi.fn(TextWindow.prototype.hasOnCloseFunction),
                destroy: vi.fn(),
            };
        }),
        Label: vi.fn().mockImplementation(() => {
            return {};
        }),
        Sizer: vi.fn().mockImplementation(() => {
            return {
                data: {
                    values: {} as any,
                    set: function(key: string, value: any) {
                        this.values[key] = value
                    },
                    get: function(key: string) {
                        return this.values[key];
                    }
                },
                addBackground: vi.fn(),
                setDataEnabled: vi.fn().mockReturnValue(true),
                add: vi.fn(),
                layout: vi.fn(),
                setScale: vi.fn(),
                createContent: vi.fn(BoardWindow.prototype.createContent),
                setPass: vi.fn(BoardWindow.prototype.setPass),
                open: vi.fn(BoardWindow.prototype.open),
            };
        })
    };
});