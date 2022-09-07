import 'jspsych/css/jspsych.css'
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

import jsPsych from './initJsPsych';

import {fixation_cards, exp_cards, exp_choice, exp_delay, exp_reward} from './procedure';


let block = 0;
const blocks = 1; // 2 blocks

const set1 = ['../images/flowersSet1/1.png', '../images/flowersSet1/2.png', '../images/flowersSet1/3.png', '../images/flowersSet1/4.png']
const set2 = ['../images/flowersSet2/1.png', '../images/flowersSet2/2.png', '../images/flowersSet2/3.png', '../images/flowersSet2/4.png']
const test_deck_images = [set1, set2];


const test_deck_images_shuffle = jsPsych.randomization.sampleWithoutReplacement(test_deck_images, blocks+1)

function images_for_block_start() {
    return test_deck_images_shuffle[block]
}

const startBlock = {
    type: htmlKeyboardResponse,
    stimulus: function () {
        return `<p><b><u>Test block ${(block + 1)} out of ${blocks + 1}</u></b></p>                     
            <p style="text-align: left"> You will now start a test block. Below are the four flowers that can appear in this round.</p>
            <p style="text-align: left">Use the LEFT or RIGHT response keys (‘s’ or ‘k’, in correspondence) to make your selection. <br> Please do your best to win as many coins as possible!<br> </p>
            <p style="text-align: left">Remember that Only the flowers (not the response key that was used to select them or the waiting time) predict an outcome. </p>
            <p><b>Press SPACE to start</b></p>
            <img src=${images_for_block_start()[0]}> <img src="${images_for_block_start()[1]}">    <img src="${images_for_block_start()[2]}
            ">    <img src="${images_for_block_start()[3]}">  `
    },
    choices: [' '], //space
    post_trial_gap: 1000
}

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
        repetitions: 1 // 25 trials
    }

    return {
        timeline: [startBlock, test_procedure_cards, finishBlock],
        repetitions: 2 // 2 blocks
    };
}

export default test;
