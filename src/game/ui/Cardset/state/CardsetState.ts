import StaticState from "./StaticState";
import SelectState from "./SelectState";
import { SelectStateConfig } from "../types/SelectStateConfig";

export interface CardsetState {
    create?(...args: any[]): void;
    selectMode(config: SelectStateConfig): void;
    staticMode(): void;
    getSelectIndexes(): number[];
    removeSelectLastIndex(): void;
    resetCardsState(): void;
    enable(): void;
    disableBattleCards(): void;
    disablePowerCards(): void;
}

export { StaticState, SelectState };
