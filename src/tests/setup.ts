import { vi } from 'vitest';
import PhaserMock, { ShapeMock } from './mocks/phaser';
import { BoardWindow } from '@game/ui/BoardWindow/BoardWindow';

(globalThis as any).Phaser = PhaserMock;

vi.stubGlobal('Phaser', PhaserMock);

vi.mock('phaser3-rex-plugins/templates/ui/ui-components', () => {
    return {
        TextBox: vi.fn().mockImplementation(() => {
            return {
                scaleX: 1,
                scaleY: 1,
                layout: vi.fn(),
                setScale: vi.fn(function (this: any, x: number, y: number) {
                    this.scaleX = x;
                    this.scaleY = y;
                }),
                setStartClose: vi.fn(),
            };
        }),
        Label: vi.fn().mockImplementation(() => {
            return {
                getElement: vi.fn(() => {
                    return new ShapeMock();
                })
            };
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