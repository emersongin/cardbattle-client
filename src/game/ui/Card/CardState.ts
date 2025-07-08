import StaticState from "./StaticState";
import MovingState from "./MovingState";
import UpdatingState from "./UpdatingState";

export interface CardState {
    create(...args: any[]): void;
    preUpdate(): void;
    static(): void;
    moving(): void;
    updating(): void;
}

export { StaticState, MovingState, UpdatingState };