export interface Phase {
    create(params?: any): void;
    destroy?(): void;
    changeToChallengePhase(): void;
    changeToStartPhase(): void;
    changeToDrawPhase(): void;
    changeToLoadPhase(): void;
    changeToTriggerPhase(origin: string): void;
    changeToSummonPhase(): void;
    changeToCompilePhase(): void;
    changeToBattlePhase(): void;
}