export type PhaseEvents = { eventName: string, listeners: ((params?: any) => void)[] };
export interface Phase {
    create(params?: any): void;
    addListener(eventName: string, listener: (params?: any) => void): void;
    publishEvent(eventName: string, params?: any): void;
    changeToChallengePhase(): void;
    changeToStartPhase(): void;
    changeToDrawPhase(): void;
    changeToLoadPhase(): void;
    changeToTriggerPhase(origin: string): void;
    changeToSummonPhase(): void;
    changeToCompilePhase(): void;
    changeToBattlePhase(): void;
}