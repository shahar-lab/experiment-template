import 'jspsych/css/jspsych.css';

import { startBlock, fixation_cards, exp_cards, exp_choice, exp_delay, exp_reward, finishBlock } from './procedure';


function test() {
   
    const test_procedure_cards = {
        timeline: [fixation_cards, exp_cards, exp_choice, exp_delay, exp_reward],
        repetitions: 2 // TODO: 25 trials
    };

    return {
        timeline: [startBlock, test_procedure_cards, finishBlock],
        repetitions: 2 // 2 blocks
    };
}

export default test;
