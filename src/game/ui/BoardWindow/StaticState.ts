import BoardWindow from "./BoardWindow";
import { WindowState } from "./WindowState";

export default class StaticState implements WindowState {
    constructor(readonly window: BoardWindow) {}

    create() {
        // nothing to do here
    }

    addTweens() {
        // nothing to do here
    }

    preUpdate() {
        //nothing to do here
    }

    static() {
        this.window.changeState(new StaticState(this.window));
    }

    updating() {
        throw new Error("UpdatingState is not implemented in StaticState.");
    }
}