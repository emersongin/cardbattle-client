import { Card } from './Card';
import { PowerAction } from './PowerAction';

export class PowerCard extends Card {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly power: number,
        readonly type: string,
        readonly description: string,
        readonly powerAction: PowerAction
    ) {
        super(id, name, power, type, description, powerAction);
    }
}