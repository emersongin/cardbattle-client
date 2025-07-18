import StaticState from "./StaticState";
import MovingState from "./MovingState";
import UpdatingState from "./UpdatingState";
import { Move } from "../types/Move";
import FlashState, { FlashConfig } from "./FlashState";

export interface CardState {
    create?(...args: any[]): void;
    addTweens?(...args: any[]): void;
    preUpdate?(): void;
    static(): void;
    moving(moves: Move[]): void;
    updating(ap: number, hp: number): void;
    flash(config: FlashConfig): void;
}

export { StaticState, MovingState, UpdatingState, FlashState };
export type { FlashConfig };