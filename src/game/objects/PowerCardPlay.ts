import { PowerAction } from "./PowerAction";

export type PowerCardPlay = {
    pass: boolean;
    powerAction: PowerAction | null;
}