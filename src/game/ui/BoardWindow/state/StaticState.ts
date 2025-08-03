import { BoardWindowData } from "@game/types";
import { UpdatingState, WindowState } from "./WindowState";
import BoardWindow from "../BoardWindow";

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

    updating(toTarget: BoardWindowData) {
        this.window.changeState(new UpdatingState(this.window), toTarget);
    }
}