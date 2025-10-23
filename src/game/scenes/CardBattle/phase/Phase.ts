export interface Phase {
    create(params?: any): void;
    addListener(event: string, listener: (params?: any) => void): void;
    publish(event: string, params?: any): void;
    changeToChallengePhase(): void;
    changeToStartPhase(): void;
    changeToDrawPhase(): void;
    changeToLoadPhase(): void;
    changeToTriggerPhase(origin: string): void;
    changeToSummonPhase(): void;
    changeToCompilePhase(): void;
    changeToBattlePhase(): void;
}