interface TrialProbability {
    getTrialProbability(trial: number): number[];
}

class ConstantTrialProbability implements TrialProbability {
    private _probs: number[];

    constructor(probs: number[]) {
        this._probs = probs;
    }

    getTrialProbability(trial: number): number[] {
        return this._probs;
    }
}


export default ConstantTrialProbability;
