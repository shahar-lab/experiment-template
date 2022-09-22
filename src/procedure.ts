import "jspsych/css/jspsych.css";
import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";
import jsPsych from "./initJsPsych";
import { Data } from "./classes";
 import ConstantTrialProbability from './probabilities';

import flower_practice_1 from "../images/flowers/flowerPractice1.png";
import flower_practice_2 from "../images/flowers/flowerPractice2.png";
import flower_practice_3 from "../images/flowers/flowerPractice3.png";
import flower_practice_4 from "../images/flowers/flowerPractice4.png";

import flower_1_1 from "../images/flowers/set1flower1.png";
import flower_1_2 from "../images/flowers/set1flower2.png";
import flower_1_3 from "../images/flowers/set1flower3.png";
import flower_1_4 from "../images/flowers/set1flower4.png";

import flower_2_1 from "../images/flowers/set2flower1.png";
import flower_2_2 from "../images/flowers/set2flower2.png";
import flower_2_3 from "../images/flowers/set2flower3.png";
import flower_2_4 from "../images/flowers/set2flower4.png";

import hourglass from "../images/hourglass.png";
import zeroCoins from "../images/zero_coins.png";
import won1 from "../images/won1-no-back.png";

const fixation = '<div style="font-size:60px;">+</div>';
const set1 = [flower_1_1, flower_1_2, flower_1_3, flower_1_4];
const set2 = [flower_2_1, flower_2_2, flower_2_3, flower_2_4];
const test_deck_images = [set1, set2];
const practice_deck_images = [
  flower_practice_1,
  flower_practice_2,
  flower_practice_3,
  flower_practice_4,
];
const reward_images = [zeroCoins, won1];
const test_deck_images_shuffle = jsPsych.randomization.sampleWithoutReplacement(
  test_deck_images,
  2
);

/*---------------------------------------------------- 
Variabels for card game
------------------------------------------------------*/
//note: different probabilities for each flower (card)
const flowerProbabilities = new ConstantTrialProbability([0.35, 0.45, 0.55, 0.65]);
const delayProbabilities = new ConstantTrialProbability([1, 1, 1, 1]);


const blocks = 1; // 2 blocks in the test
let block = 0; // current block

let current_cards_practice_trial = 0;
let current_cards_exp_trial = 0;


let card_selected: number | undefined;
let card_unselected: number;
let key_selected: number;
let card_to_show;
let prob_chosen: number | undefined;
let prob_unchosen: number;
let prob_unreward: number;
let reward: number;
let reward_to_show: string; // html element
let left_card: string;
let right_card: string;
let selected: number | undefined;
let delay_prob: number;
let random_duration: number;
let delay_prob_random: number;

function images_for_block_start() {
  return test_deck_images_shuffle[block];
}

function show_choice() {
  const last_choice = jsPsych.data.getLastTrialData().values()[0].response;
  if (last_choice == "s") {
    selected = 0;
    card_to_show = `<img class='card_left_with_frame' src='${left_card}'> <img class='card_right' src='${right_card}'>`;
  } else if (last_choice == "k") {
    selected = 1;
    card_to_show = `<img class='card_left' src='${left_card}'> <img class='card_right_with_frame' src='${right_card}'>`;
  } else {
    selected = undefined;
    reward = 0;
    return '<div style="font-size:40px;">Please respond faster!<div>';
  }
  return card_to_show;
}

function linspace(start: number, stop: number, num: number, endpoint = true) {
  const div = endpoint ? num - 1 : num;
  const step = (stop - start) / div;
  return Array.from({ length: num }, (_, i) => start + step * i);
}

function show_delay(current_trial_num: number) {
  card_selected = jsPsych.data
    .get()
    .filter({ phase: "exp", trial_name: "choice1" })
    .last(1)
    .select("card_selected").values[0];
  card_unselected = jsPsych.data
    .get()
    .filter({ phase: "exp", trial_name: "choice1" })
    .last(1)
    .select("card_unselected").values[0];

  if (card_selected == undefined) {
    delay_prob = 0;
  } else {
    // delay_prob = delay_prob_matrix[card_selected][current_trial_num];
    delay_prob = delayProbabilities.getTrialProbability(current_trial_num)[card_selected];
  }

  random_duration = jsPsych.randomization.sampleWithReplacement(
    linspace(0.5, 8, 40),
    1
  )[0];
  delay_prob_random = delay_prob * random_duration * 1000; //converte to ms
  return delay_prob_random;
}

function showHourglass() {
  return `<img class='card_left_reward' src='${hourglass}'>`;
}

function show_reward(current_trial_num: number) {
  card_selected = jsPsych.data
    .get()
    .filter({ phase: "exp", trial_name: "choice1" })
    .last(1)
    .select("card_selected").values[0];
  card_unselected = jsPsych.data
    .get()
    .filter({ phase: "exp", trial_name: "choice1" })
    .last(1)
    .select("card_unselected").values[0];
  key_selected = jsPsych.data
    .get()
    .filter({ phase: "exp", trial_name: "choice1" })
    .last(1)
    .select("key_selected").values[0];
  if (key_selected == 0) {
    card_to_show = `<img class='card_left_reward' src='${left_card}'>`;
    card_selected = jsPsych.data
      .get()
      .filter({ phase: "exp", trial_name: "choice1" })
      .last(1)
      .select("card_selected").values[0];

    prob_chosen = flowerProbabilities.getTrialProbability(current_trial_num)[card_selected];
    prob_unchosen = flowerProbabilities.getTrialProbability(current_trial_num)[card_unselected];
    // prob_chosen = FB_matrix[card_selected][current_trial_num];
    // prob_unchosen = FB_matrix[card_unselected][current_trial_num];
    prob_unreward = 1 - prob_chosen;
    reward = jsPsych.randomization.sampleWithReplacement([0, 1], 1, [
      prob_unreward,
      prob_chosen,
    ])[0];
    reward_to_show = `<img class=reward src='${reward_images[reward]}'>`;
  } else if (key_selected == 1) {
    card_to_show = `<img class='card_right_reward' src='${right_card}'>`;
    card_selected = jsPsych.data
      .get()
      .filter({ phase: "exp", trial_name: "choice1" })
      .last(1)
      .select("card_selected").values[0];    
    prob_chosen = flowerProbabilities.getTrialProbability(current_trial_num)[card_selected];
    prob_unchosen = flowerProbabilities.getTrialProbability(current_trial_num)[card_unselected];
    prob_unreward = 1 - prob_chosen;
    reward = jsPsych.randomization.sampleWithReplacement([0, 1], 1, [
      prob_unreward,
      prob_chosen,
    ])[0];
    reward_to_show = `<img class=reward src='${reward_images[reward]}'>`;
  } else {
    prob_chosen = undefined;
    prob_unchosen = undefined;
    return '<div style="font-size:40px;">Please respond faster!</div>';
  }
  return card_to_show + reward_to_show;
}

function draw_show_cards(deck: string[]) {
  // images list
  const drawn_cards = jsPsych.randomization.sampleWithoutReplacement(deck, 4);
  left_card = drawn_cards[0];
  right_card = drawn_cards[1];
  const left_with_tag = `<img class='card_left' src='${left_card}'>`;
  const right_with_tag = `<img class='card_right' src='${right_card}'>`;
  return left_with_tag + right_with_tag + fixation;
}

//------------------------- practice functions-----

function practice_show_delay(current_trial_num: number) {
  card_selected = jsPsych.data
    .get()
    .filter({ phase: "practice", trial_name: "choice1" })
    .last(1)
    .select("card_selected").values[0];
  card_unselected = jsPsych.data
    .get()
    .filter({ phase: "practice", trial_name: "choice1" })
    .last(1)
    .select("card_unselected").values[0];

  if (card_selected == undefined) {
    delay_prob = 0;
  } else {
    // delay_prob = delay_prob_matrix[card_selected][current_trial_num];
    delay_prob = delayProbabilities.getTrialProbability(current_trial_num)[card_selected];
  }

  random_duration = jsPsych.randomization.sampleWithReplacement(
    linspace(0, 8, 40),
    1
  )[0];
  delay_prob_random = delay_prob * random_duration * 1000; //converte to ms
  return delay_prob_random;
}

function practice_show_reward(current_trial_num: number) {
  card_selected = jsPsych.data
    .get()
    .filter({ phase: "practice", trial_name: "choice1" })
    .last(1)
    .select("card_selected").values[0];
  card_unselected = jsPsych.data
    .get()
    .filter({ phase: "practice", trial_name: "choice1" })
    .last(1)
    .select("card_unselected").values[0];
  key_selected = jsPsych.data
    .get()
    .filter({ phase: "practice", trial_name: "choice1" })
    .last(1)
    .select("key_selected").values[0];
  if (key_selected == 0) {
    card_to_show = `<img class='card_left_reward' src='${left_card}'>`;
    card_selected = jsPsych.data
      .get()
      .filter({ phase: "practice", trial_name: "choice1" })
      .last(1)
      .select("card_selected").values[0];
      
    prob_chosen = flowerProbabilities.getTrialProbability(current_trial_num)[card_selected];
    prob_unchosen = flowerProbabilities.getTrialProbability(current_trial_num)[card_unselected];
    prob_unreward = 1 - prob_chosen;
    reward = jsPsych.randomization.sampleWithReplacement([0, 1], 1, [
      prob_unreward,
      prob_chosen,
    ])[0];
    reward_to_show = `<img class=reward src='${reward_images[reward]}'>`;
  } else if (key_selected == 1) {
    card_to_show = `<img class='card_right_reward' src='${right_card}'>`;
    card_selected = jsPsych.data
      .get()
      .filter({ phase: "practice", trial_name: "choice1" })
      .last(1)
      .select("card_selected").values[0];
    prob_chosen = flowerProbabilities.getTrialProbability(current_trial_num)[card_selected];
    prob_unchosen = flowerProbabilities.getTrialProbability(current_trial_num)[card_unselected];
    prob_unreward = 1 - prob_chosen;
    reward = jsPsych.randomization.sampleWithReplacement([0, 1], 1, [
      prob_unreward,
      prob_chosen,
    ])[0];
    reward_to_show = `<img class=reward src='${reward_images[reward]}'>`;
  } else {
    prob_chosen = undefined;
    prob_unchosen = undefined;
    return '<div style="font-size:40px;">Please respond faster!</div>';
  }

  return card_to_show + reward_to_show;
}

// TODO: maybe split to few files?
/////////// test /////////////
export const startBlock = {
  type: htmlKeyboardResponse,
  stimulus: () => {
    return `<p><b><u>Test block ${block + 1} out of ${
      blocks + 1
    }</u></b></p>                     
            <p style="text-align: left"> You will now start a test block. Below are the four flowers that can appear in this round.</p>
            <p style="text-align: left">Use the LEFT or RIGHT response keys (‘s’ or ‘k’, in correspondence) to make your selection. <br> Please do your best to win as many coins as possible!<br> </p>
            <p style="text-align: left">Remember that Only the flowers (not the response key that was used to select them or the waiting time) predict an outcome. </p>
            <p><b>Press SPACE to start</b></p>
            <img src=${images_for_block_start()[0]}> <img src="${
      images_for_block_start()[1]
    }">    <img src="${images_for_block_start()[2]}
            ">    <img src="${images_for_block_start()[3]}">  `;
  },
  choices: [" "], //space
  post_trial_gap: 1000,
};

export const fixation_cards = {
  type: htmlKeyboardResponse,
  stimulus: fixation,
  choices: "NO_KEYS",
  trial_duration: 1000,
};

export const exp_cards = {
  type: htmlKeyboardResponse,
  stimulus: () => {
    return draw_show_cards(images_for_block_start());
  },
  choices: ["s", "k"],
  trial_duration: 6000,
  response_ends_trial: true,
  data: {
    phase: "exp",
    trial_name: "cards1",
    trial_num: () => {
      return current_cards_exp_trial;
    },
    block: () => {
      return block;
    },
  },
};

export const exp_choice = {
  type: htmlKeyboardResponse,
  stimulus: show_choice,
  choices: "NO_KEYS",
  trial_duration: 500,
  data: {
    phase: "exp",
    trial_name: "choice1",
    trial_num: () => {
      return current_cards_exp_trial;
    },
    block: () => {
      return block;
    },
  },
  on_finish: (data: Data) => {
    data.key_selected = selected;
    if (selected == 0) {
      data.card_selected = images_for_block_start().indexOf(left_card) + 1;
      data.card_unselected = images_for_block_start().indexOf(right_card) + 1;
    } else if (selected == 1) {
      data.card_selected = images_for_block_start().indexOf(right_card) + 1;
      data.card_unselected = images_for_block_start().indexOf(left_card) + 1;
    }

    // return data;
  },
};

export const exp_delay = {
  type: htmlKeyboardResponse,
  stimulus: showHourglass,
  choices: "NO_KEYS",
  trial_duration: () => {
    return show_delay(current_cards_exp_trial);
  },
  post_trial_gap: 0,
  css_classes: ["stimulus"],
  data: {
    phase: "exp",
    trial_name: "exp_delay",
    trial_num: () => {
      return current_cards_exp_trial;
    },
    block: () => {
      return block;
    },
  },
};

export const exp_reward = {
  type: htmlKeyboardResponse,
  stimulus: () => {
    return show_reward(current_cards_exp_trial);
  },
  choices: [" "],
  trial_duration: 2000,
  data: {
    phase: "exp",
    trial_name: "reward1",
    trial_num: () => {
      return current_cards_exp_trial;
    },
    block: () => {
      return block;
    },
    iti_delay: 0,
  },

  on_finish: (data: Data) => {
    data.reward = reward;
    data.delay_prob = delay_prob;
    data.random_duration = random_duration;
    data.delay = delay_prob_random;
    data.prob_chosen = prob_chosen;
    data.prob_unchosen = prob_unchosen;
    data.int_trial_number = current_cards_practice_trial;

    data.prob_flower = [
      flowerProbabilities.getTrialProbability(current_cards_practice_trial)[1],
      flowerProbabilities.getTrialProbability(current_cards_practice_trial)[2],
      flowerProbabilities.getTrialProbability(current_cards_practice_trial)[3],
      flowerProbabilities.getTrialProbability(current_cards_practice_trial)[4]
    ];

    data.left_image = left_card[21];
    data.right_image = right_card[21];
    const setIndex = images_for_block_start()[0].indexOf('set');
    const flowerIndex = images_for_block_start()[0].indexOf('flower');
    data.flower_set = Number(images_for_block_start()[0].substring(setIndex+3, flowerIndex));
    current_cards_exp_trial += 1;
  },
};

export const finishBlock = {
  type: htmlKeyboardResponse,
  stimulus: () => {
    let number_of_coins = "";
    let finish_block_string = `<p>Good job!</p> <p style="text-align: left"><br> Test block ${
      block + 1
    } out of ${blocks + 1} is over.`;
    if (block != 1) {
      finish_block_string +=
        " You can stretch a little and take a short break while sitting in front of the screen, if needed.</p><p> <br><br><br><b>Press SPACE to continue</b>  </p>";
      number_of_coins = " ";
    } else {
      const number_of_reward1 = jsPsych.data
        .get()
        .filter({ phase: "exp", trial_name: "reward1" })
        .select("reward")
        .sum();
      number_of_coins = `You collected ${number_of_reward1} coins`;

      finish_block_string +=
        ".</p><p> <br><br><br><b>Press SPACE to continue</b>  </p>";
    }
    return number_of_coins + finish_block_string;
  },
  post_trial_gap: 1000,
  choices: [" "],
  on_finish: () => {
    block += 1;

    console.log(`block ${block} finished.`);
    console.log(jsPsych.data.get());
  },
};

////////// practice /////////////

export const practice_cards = {
  type: htmlKeyboardResponse,
  stimulus: () => {
    return draw_show_cards(practice_deck_images);
  },
  choices: ["s", "k"],
  trial_duration: 6000,
  data: {
    phase: "practice",
    trial_name: "cards1",
    trial_num: () => {
      return current_cards_practice_trial;
    },
    block: () => {
      return block;
    },
  },
};

export const practice_choice = {
  type: htmlKeyboardResponse,
  stimulus: show_choice,
  choices: "NO_KEYS",
  trial_duration: 500,
  data: {
    phase: "practice",
    trial_name: "choice1",
    trial_num: () => {
      return current_cards_practice_trial;
    },
    block: () => {
      return block;
    },
  },
  on_finish: (data: Data) => {
    data.key_selected = selected;
    if (selected == 0) {
      data.card_selected = practice_deck_images.indexOf(left_card) + 1;
      data.card_unselected = practice_deck_images.indexOf(right_card) + 1;
    } else if (selected == 1) {
      data.card_selected = practice_deck_images.indexOf(right_card) + 1;
      data.card_unselected = practice_deck_images.indexOf(left_card) + 1;
    }
  },
};

export const practice_delay = {
  type: htmlKeyboardResponse,
  stimulus: showHourglass,
  choices: "NO_KEYS",
  trial_duration: () => {
    return practice_show_delay(current_cards_practice_trial);
  },
  post_trial_gap: 0,
  css_classes: ["stimulus"],
  data: {
    phase: "practice",
    trial_name: "practice_delay",
    trial_num: () => {
      return current_cards_practice_trial;
    },
    block: () => {
      return block;
    },
  },
};

export const practice_reward = {
  type: htmlKeyboardResponse,
  stimulus: () => {
    return practice_show_reward(current_cards_practice_trial);
  },
  choices: "NO_KEYS",
  trial_duration: 2000,
  data: {
    phase: "practice",
    trial_name: "reward1",
    trial_num: () => {
      return current_cards_practice_trial;
    },
    block: () => {
      return block;
    },
    iti_delay: 0,
  },
  on_finish: (data: Data) => {
    // TODO: Seems the same as exp_reward.on_finish  this should probably be moved to an external function
    data.reward = reward;
    data.delay_prob = delay_prob;
    data.random_duration = random_duration;
    data.delay = delay_prob_random;
    data.prob_chosen = prob_chosen;
    data.prob_unchosen = prob_unchosen;
    data.int_trial_number = current_cards_practice_trial;
    data.prob_flower = [
      flowerProbabilities.getTrialProbability(current_cards_practice_trial)[1],
      flowerProbabilities.getTrialProbability(current_cards_practice_trial)[2],
      flowerProbabilities.getTrialProbability(current_cards_practice_trial)[3],
      flowerProbabilities.getTrialProbability(current_cards_practice_trial)[4]
    ];

    data.left_image = left_card[29];
    data.right_image = right_card[29];
    const setIndex = images_for_block_start()[0].indexOf('set');
    const flowerIndex = images_for_block_start()[0].indexOf('flower');
    data.flower_set = Number(images_for_block_start()[0].substring(setIndex+3, flowerIndex));
    current_cards_practice_trial += 1;
  },
};
