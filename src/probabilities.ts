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

flowerProbabilities = new ConstantTrialProbability([0.35, 0.45, 0.55, 0.65]);
delayProbabilities = new ConstantTrialProbability([1, 1, 1, 1]);


flowerProbabilities.getTrialProbability(trialNum)