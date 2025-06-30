import StaticState from "./StaticState";
import MovingState from "./MovingState";
import UpdatingState from "./UpdatingState";

export interface CardState {
    create(...args: any[]): void;
    update(): void;
    stopped(): void;
}

export { StaticState, MovingState, UpdatingState };