import { Card } from "./Card";
import { CardState } from "./CardState";

export default class StaticState implements CardState {
    constructor(
        readonly card: Card
    ) {}

    create() {
        console.log('StaticState: create called');
    }

    update() {
        //nothing to do here
    }

    stopped() {
        throw new Error('StaticState: stopped called, this should not happen');
    }
}