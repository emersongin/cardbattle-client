import { vi } from 'vitest';
import PhaserMock from './mocks/phaser';

(globalThis as any).Phaser = PhaserMock;

vi.stubGlobal('Phaser', PhaserMock);

vi.mock('phaser3-rex-plugins/templates/ui/ui-components', () => {
    return {
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