import { vi } from 'vitest';
import PhaserMock from './mocks/phaser';

(globalThis as any).Phaser = PhaserMock;

vi.stubGlobal('Phaser', PhaserMock);