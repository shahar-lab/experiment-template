import 'jspsych/css/jspsych.css'
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

import jsPsych from './initJsPsych';

import { startBlock, fixation_cards, exp_cards, exp_choice, exp_delay, exp_reward } from './procedure';


let block = 0;
const blocks = 1; // 2 blocks


const finishBlock = {
    type: htmlKeyboardResponse,
    stimulus: function () {
        let number_of_coins = '';
        let finish_block_string = '<p>Good job!</p>' + '<p style="text-align: left"><br> Test block ' + (
            block + 1) + ' out of ' + (blocks + 1) + ' is over.'
        if (block != 1) {
            finish_block_string +=
                ' You can stretch a little and take a short break while sitting in front of the screen, if needed.</p><p> <br><br><br><b>Press SPACE to continue</b>  </p>'
            number_of_coins = ' '

        }
        else {
            const number_of_reward1 = jsPsych.data.get().filter({ phase: 'exp', trial_name: 'reward1' }).select('reward').sum()
            number_of_coins = 'You collected' +' '+ number_of_reward1 +' ' + 'coins'

            finish_block_string +=
                '.</p><p> <br><br><br><b>Press SPACE to continue</b>  </p>'
            
         }
         return number_of_coins + finish_block_string 

    },
    post_trial_gap: 1000,
    choices: [' '],
    on_finish: function () {
        block += 1;
        //current_cards_exp_trial = 0;
    }
}


function test() {
   
    const test_procedure_cards = {
        timeline: [fixation_cards, exp_cards, exp_choice, exp_delay, exp_reward],
        repetitions: 2 // TODO: 25 trials
    }

    return {
        timeline: [startBlock, test_procedure_cards, finishBlock],
        repetitions: 2 // 2 blocks
    };
}

export default test;
