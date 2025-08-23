import StaticState from "./StaticState";
import MovingState from "./MovingState";
import UpdatingState from "./UpdatingState";
import { Move } from "../types/Move";
import FlashState from "./FlashState";
import { FlashCardConfig } from "../types/FlashCardConfig";

export interface CardState {
    create?(...args: any[]): void;
    addTweens?(...args: any[]): void;
    preUpdate?(): void;
    static?(): void;
    moving?(moves: Move[]): void;
    updating?(ap: number, hp: number): void;
    flash?(config: FlashCardConfig): void;
}

export { StaticState, MovingState, UpdatingState, FlashState };