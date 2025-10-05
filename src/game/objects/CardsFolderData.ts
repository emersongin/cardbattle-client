import { BLACK, BLUE, GREEN, ORANGE, RED, WHITE } from "../constants/colors";

export type ColorsPointsData = {
    [RED]: number;
    [GREEN]: number;
    [BLUE]: number;
    [BLACK]: number;
    [WHITE]: number;
    [ORANGE]: number;
}

export type CardsFolderData = {
    id: string;
    name: string;
    colorsPoints: ColorsPointsData;
    numCards: number;
};