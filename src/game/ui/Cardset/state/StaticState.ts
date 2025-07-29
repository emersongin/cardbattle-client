import { Cardset } from "../Cardset";
import { CardsetState, SelectState } from "./CardsetState";
import { SelectStateConfig } from "./SelectState";

export default class StaticState implements CardsetState {
    constructor(readonly cardset: Cardset) {}

    staticMode() {
        throw new Error('StaticState: staticMode called, this should not happen');
    }

    selectMode(config: SelectStateConfig) {
        this.cardset.changeState(new SelectState(this.cardset), config);
    }

    getSelectIndexes(): number[] {
        throw new Error('StaticState: getSelectIndexes called, this should not happen');
    }

    removeSelectLastIndex(): void {
        throw new Error('StaticState: removeSelectLastIndex called, this should not happen');
    }

    resetCardsState(): void {
        throw new Error('StaticState: resetCardsState called, this should not happen');
    }

    enable(): void {
        throw new Error('StaticState: enable called, this should not happen');
    }

    disableBattleCards(): void {
        throw new Error('StaticState: disableBattleCards called, this should not happen');
    }

    disablePowerCards(): void {
        throw new Error('StaticState: disablePowerCards called, this should not happen');
    }
}