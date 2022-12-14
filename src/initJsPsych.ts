import {initJsPsych} from 'jspsych';
import 'jspsych/css/jspsych.css';

const jsPsych = initJsPsych({
    on_finish: () => {
        // jsPsych.data.displayData('csv');
        const data = jsPsych.data.get();

        const urlParams = new URLSearchParams(window.location.search);
        const createCsv = urlParams.get('csv');
        if (createCsv && createCsv !== "false") {
            data.localSave('csv','flowers.csv');
        }

        // save embedded data
        const processed_data = data.json();
        window.parent.postMessage({ id: 'embeddedDataId', answer: data }, '*');	
    }
});


console.debug('jsPsych initialized: ', jsPsych);

export default jsPsych;
