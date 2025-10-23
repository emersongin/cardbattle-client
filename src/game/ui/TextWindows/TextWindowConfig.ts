
import { LEFT, CENTER, RIGHT } from "@game/constants/keys";
import { TextWindow } from "@ui/TextWindows/TextWindow";

export type TextWindowConfig = {
    text: string,
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    textColor?: string,
    textAlign?: typeof LEFT | typeof CENTER | typeof RIGHT,
    relativeParent?: TextWindow,
    marginTop?: number
};