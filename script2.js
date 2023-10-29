// TODO rewrite

// TODO allow preloading next number's audio

const play_button = document.querySelector("#play");

var next_number = {
    number: null,
    audio: null,
    settings: null
}
var number = {
    number: null, 
    audio: null
}
var settings = {}

function next() {
    if (settings == next_number.settings) {
        // set number= next_number
        // create new next_number
    } else {
        // create both
    }
}

function generate_number() {
    // TODO add settings to allow zeros, doubles, etc.
    return Math.round(Math.random() * settings.max_num);
}

function get_audio(number) {
    
}