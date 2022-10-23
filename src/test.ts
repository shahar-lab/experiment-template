import 'jspsych/css/jspsych.css';

import { startBlock, fixation_cards, finishBlock, getState, cards, choice, delay, rewardState } from './procedure';


function test() {
    const practiceElement = getState("exp");
   
    const test_procedure_cards = {
        timeline: [fixation_cards, cards(practiceElement), choice(practiceElement), delay(practiceElement), rewardState(practiceElement)],
        repetitions: 2 // TODO: 25 trials
    };

    return {
        timeline: [startBlock, test_procedure_cards, finishBlock],
        repetitions: 2 // 2 blocks
    };
}

export default test;
