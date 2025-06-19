import { Card } from './Card';

export class BattleCard extends Card {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly power: number,
        readonly type: string,
        readonly description: string
    ) {
        super(id, name, power, type, description);
    }
}