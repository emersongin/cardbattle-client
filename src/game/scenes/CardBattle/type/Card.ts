import { PowerAction } from "./PowerAction";

export class Card {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly power: number,
        readonly type: string,
        readonly description: string,
        readonly powerAction?: PowerAction
    ) {}
}