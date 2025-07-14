import BoardWindow, { BoardWindowConfig } from "./BoardWindow";
import { UpdatingState, WindowState } from "./WindowState";

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
        throw new Error("StaticState is not implemented in StaticState.");
    }

    updating(toTarget: BoardWindowConfig) {
        this.window.changeState(new UpdatingState(this.window), toTarget);
    }
}