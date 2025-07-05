import StaticState from "./StaticState";
import SelectState from "./SelectState";

export interface CardsetState {
    selectMode(...args: any[]): void;
    staticMode(): void;
}

export { StaticState, SelectState };
