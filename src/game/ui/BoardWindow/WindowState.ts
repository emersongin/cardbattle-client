import { BoardWindowData } from "@game/types";
import StaticState from "./StaticState";
import UpdatingState from "./UpdatingState";

export interface WindowState {
    create(...args: any[]): void;
    addTweens(...args: any[]): void;
    preUpdate(): void;
    static(): void;
    updating(toTarget: BoardWindowData): void;
}

export { StaticState, UpdatingState };