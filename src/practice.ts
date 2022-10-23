import 'jspsych/css/jspsych.css';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

import { cards, choice, delay, fixation_cards, getState, rewardState } from './procedure';


 const startPractice = {
    type: htmlKeyboardResponse,
    stimulus: '<div>We will now start a few practice trials with both the cards and the squares. <br> Please be ready with your fingers on <b>"s"</b> and <b>"k"</b> <br><br> <b> Press any key to begin</b></div>',
    post_trial_gap: 1000,
    on_finish: () => { document.querySelector('head').insertAdjacentHTML('beforeend', '<style id="cursor-toggle"> html { cursor: none; } </style>'); },
};

const practiceCompleted = {
    type: htmlKeyboardResponse,
    stimulus: `<p>Good job! Practice completed.</p>
    <p>We will now move on to the real game. Do your best to remember the flowers to figure out which ones are better. Good luck!</p>
    <b>Press any key to continue.</b
    `,
    post_trial_gap: 1000
};



function practice() {
    const practiceElement = getState("practice");

    const demo_procedure_only_cards = {
        timeline: [fixation_cards, cards(practiceElement), choice(practiceElement), delay(practiceElement), rewardState(practiceElement)],
        repetitions: 2 // TODO: 6 
    };

    return {
        timeline: [startPractice, demo_procedure_only_cards, practiceCompleted],
        repetitions: 1
    };
}

export default practice;
