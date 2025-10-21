import { vi } from 'vitest';
import PhaserMock from './mocks/phaser';
import { TextWindow } from '@game/ui/TextWindows/TextWindow';

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
                close: vi.fn(TextWindow.prototype.close),
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
            };
        })
    };
});