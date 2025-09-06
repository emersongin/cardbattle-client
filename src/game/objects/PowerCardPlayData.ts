import { PowerActionData } from "@objects/PowerActionData";

export type PowerCardPlayData = {
    pass: boolean;
    powerAction: PowerActionData | null;
}