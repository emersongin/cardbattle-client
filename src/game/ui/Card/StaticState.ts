import { Card } from "./Card";
import { CardState } from "./CardState";

export default class StaticState implements CardState {
    constructor(
        readonly card: Card
    ) {}

    create() {
        //nothing to do here
    }

    update() {
        //nothing to do here
    }

    stopped() {
        throw new Error('StaticState: stopped called, this should not happen');
    }
}