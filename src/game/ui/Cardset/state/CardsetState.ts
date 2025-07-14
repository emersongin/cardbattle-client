import StaticState from "./StaticState";
import SelectState from "./SelectState";

export interface CardsetState {
    create(...args: any[]): void;
    selectMode(...args: any[]): void;
    staticMode(): void;
}

export { StaticState, SelectState };
