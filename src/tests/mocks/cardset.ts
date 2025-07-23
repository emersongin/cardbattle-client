import { Cardset } from "@game/ui/Cardset/Cardset";
import { vi } from "vitest";

const CardBattleMock = {
    Cardset: class {
        add = vi.fn();
    }
}

export default CardBattleMock as unknown as {
    Cardset: typeof Cardset;
}