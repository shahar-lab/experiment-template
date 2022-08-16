import {initJsPsych} from 'jspsych';
import 'jspsych/css/jspsych.css'
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import practice from './practice';
import test from './test';

const jsPsych = initJsPsych();
console.debug('jsPsych initialized: ', jsPsych);

// The timeline is an array that contains the set of trials we want to run in the experiment.
const timeline = [];

  
const practiceTimeline = practice();
timeline.push(practiceTimeline);

const testTimeline = test();
timeline.push(testTimeline);



// timeline.push({
//   type: 'fullscreen',
//   fullscreen_mode: true,
//   message: '<p style="text-align: center"> After pressing the button you will switch to full screen mode</p>',
//   button_label: 'Continue to full screen mode'
// });
// timeline.push(full_procedure_cards);


jsPsych.run(timeline);
