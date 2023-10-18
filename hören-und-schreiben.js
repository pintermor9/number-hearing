var AUTOPLAY = true;
var MAX_NUM = 999;
var PLAY_ON_SPACE = true;
var number;
var number_audio;
var play_button = document.getElementById("play");
var play_button_spinner = document.querySelector("#play > span.spinner-border");
var field_example = document.querySelector("#field-example");
var inputs = document.querySelector(".inputs");
var feedback = document.getElementById("feedback");
var check_button = document.querySelector("button#check");

var checked = false;

document.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    if (checked) generate_new();
    else check();
  }
});

check_button.addEventListener("click", check);

function get_field_by_index(i) {
  return inputs.children[i].firstElementChild;
}

function field_keydown(event) {
  var field_index = parseInt(event.target.dataset.index);
  if (event.code == "Backspace") {
    event.preventDefault();
    if (event.target.value != "") {
      event.target.value = "";
    } else if (event.target.dataset.index > 0) {
      var field = get_field_by_index(field_index - 1);
      field.value = "";
      field.focus();
    }
  } else if (event.code == "Delete") {
    event.preventDefault();
    event.target.value = "";
  } else if (event.code == "ArrowRight") {
    event.preventDefault();
    get_field_by_index(field_index + 1).focus();
  } else if (event.code == "ArrowLeft") {
    event.preventDefault();
    get_field_by_index(field_index - 1).focus();
  } else if (parseInt(event.key).toString() == event.key) {
    if (field_index < inputs.children.length - 1 && event.target.value) {
      get_field_by_index(field_index + 1).focus();
    }
  } else if (event.code == "Space") {
    event.preventDefault();
    if (PLAY_ON_SPACE) play();
  } else {
    event.preventDefault();
  }
}

function generate_new() {
  number = Math.round(Math.random() * MAX_NUM);
  console.log("current number: " + number);

  for (let i = inputs.children.length; i > 0; i--) {
    inputs.children[i - 1].remove();
  }

  for (let i = 0; i < number.toString().length; i++) {
    let input_field = field_example.cloneNode(true);
    input_field.hidden = false;
    input_field.firstElementChild.dataset.index = i;
    input_field.firstElementChild.addEventListener("keydown", field_keydown);
    input_field.firstElementChild.addEventListener("input", (event) => {
      event.target.classList.remove("text-success");
    });
    inputs.appendChild(input_field);
  }

  inputs.firstElementChild.firstElementChild.focus();

  checked = false;
  check_button.disabled = false;
  play_button.disabled = true;
  play_button_spinner.hidden = false;
  tts(number);
}

function check() {
  var number_string = number.toString();
  var correct = true;

  for (let i = 0; i < inputs.children.length; i++) {
    if (number_string[i] == get_field_by_index(i).value) {
      get_field_by_index(i).classList.add("text-success");
    } else {
      correct = false;
    }
  }

  if (correct) {
    for (let i = 0; i < inputs.children.length; i++) {
      get_field_by_index(i).disabled = true;
    }
    checked = true;
    check_button.disabled = true;
  }
}

function tts(text) {
  number_audio = new Audio("https://utils.pintermor9.repl.co/tts?text=" + text);
  number_audio.addEventListener("canplaythrough", () => {
    play_button.disabled = false;
    play_button_spinner.hidden = true;
    if (AUTOPLAY) number_audio.play();
  });
}

function play() {
  number_audio.play();
}

generate_new();
