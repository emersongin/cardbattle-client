import StaticState from "./StaticState";
import MovingState from "./MovingState";

export interface CardState {
    create(): void;
    update(): void;
    stopped(): void;
}

export { StaticState, MovingState };