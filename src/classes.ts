export class Data {
    block: number;
    card_selected: number;
    card_unselected: number;
    key_selected: number;
    delay: number;
    delay_prob: number;
    flower_set: number;
    int_trial_number: number;
    internal_node_id: string;
    iti_delay: number;
    left_image: string;
    phase: "exp" | "practice";
    prob_chosen: number;
    prob_flower: number[]; // this is an array of 4 numbers
    prob_unchosen: number;
    random_duration: number;
    response: string | undefined;
    reward: number;
    right_image: string;
    rt: number | undefined;
    stimulus: string;
    time_elapsed: number;
    trial_index: number;
    trial_name: string;
    trial_num: number;
    trial_type: string;
}