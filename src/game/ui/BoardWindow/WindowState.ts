import { BoardWindowConfig } from "./BoardWindow";
import StaticState from "./StaticState";
import UpdatingState from "./UpdatingState";

export interface WindowState {
    create(...args: any[]): void;
    addTweens(...args: any[]): void;
    preUpdate(): void;
    static(): void;
    updating(toTarget: BoardWindowConfig): void;
}

export { StaticState, UpdatingState };