export class PowerSlots {
    protected powerSlots: any[] = [];
    #limit: number = 3;

    constructor(powerSlots: any[] = []) {
        this.powerSlots = powerSlots;
    }

    public addPowerSlot(action: any): void {
        this.powerSlots.push(action);
    }

    public getPowerSlots(): any[] {
        return this.powerSlots;
    }

    public hasPower(): boolean {
        return this.powerSlotsTotal() > 0;
    }

    public powerSlotsTotal(): number {
        return this.powerSlots.length;
    }

    public isLimitReached(): boolean {
        return this.powerSlotsTotal() >= this.#limit;
    }
}