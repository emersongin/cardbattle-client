import { vi } from "vitest";
import { Cardset } from "@game/ui/Cardset/Cardset";
class CardsetMock {
    add = vi.fn();
}

export default CardsetMock as unknown as Cardset;