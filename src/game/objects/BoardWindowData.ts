import { BLACK, BLUE, GREEN, RED, WHITE } from "../constants/colors";
import { AP, DECK, HAND, HP, PASS, TRASH, WINS } from "../constants/keys";

export type BoardWindowData = {
    [AP]: number;
    [HP]: number;
    [RED]: number;
    [GREEN]: number;
    [BLUE]: number;
    [BLACK]: number;
    [WHITE]: number;
    [HAND]: number,
    [DECK]: number,
    [TRASH]: number,
    [WINS]: number,
    [PASS]: boolean;
};