import { vi } from 'vitest';
import PhaserMock from './mocks/phaser';

(globalThis as any).Phaser = PhaserMock;

vi.mock('phaser3-rex-plugins/templates/ui/ui-plugin.js', () => {
    return {
        default: class RexUIPluginMock {
            add = vi.fn();
            getSizer = vi.fn();
        }
    };
});
