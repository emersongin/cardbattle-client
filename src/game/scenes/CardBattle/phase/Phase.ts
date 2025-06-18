export interface Phase {
    create(): void;
    update(): void;
    destroy?(): void;
    changeToChallengePhase(): void;
    changeToStartPhase(): void;
    changeToDrawPhase(): void;
    changeToLoadPhase(): void;
    changeToSummonPhase(): void;
    changeToCompilePhase(): void;
    changeToBattlePhase(): void;
}