export const COLORS = {
    RED: 'RED',
    GREEN: 'GREEN',
    BLUE: 'BLUE',
    BLACK: 'BLACK',
    WHITE: 'WHITE',
    ORANGE: 'ORANGE',
} as const;

export type ColorName = keyof typeof COLORS;
export type ColorHex = typeof COLORS[ColorName];