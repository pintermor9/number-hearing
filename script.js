const play_button = document.querySelector("#play");
const play_button_spinner = document.querySelector("#play>span.spinner-border");
const field_example = document.querySelector("#field-example");
const inputs = document.querySelector(".inputs");
const feedback = document.querySelector("#feedback");
const check_button = document.querySelector("#check");
const settings_elements = document.querySelectorAll("[data-setting]");

var number;
var number_audio;

var checked_input = false;

const searchParams = new URLSearchParams(window.location.search);

// this is temporary
if (searchParams.has("redirectedToUpdated")) {
  alert(
    "A weboldal címe megváltozott. Automatikusan át lett irányítva. // The link to this site has changed. You have been redirected."
  );
  window.location.replace("/number-hearing");
}

// ANCHOR - settings
var settings = JSON.parse(localStorage.getItem("settings"));

if (settings == null) {
  settings = {};
  readSettings();
} else {
  settings_elements.forEach((element) => {
    if (element.type == "number") {
      element.value = settings[element.id];
    } else if (element.type == "select-one") {
      element.value = settings[element.id];
    } else if (element.type == "checkbox") {
      element.checked = settings[element.id];
    }
  });
}

function readSettings() {
  var old = JSON.parse(JSON.stringify(settings));
  settings_elements.forEach((element) => {
    if (element.type == "number") {
      settings[element.id] = parseInt(element.value);
    } else if (element.type == "select-one") {
      settings[element.id] = element.value;
    } else if (element.type == "checkbox") {
      settings[element.id] = element.checked;
    }
  });
  localStorage.setItem("settings", JSON.stringify(settings));

  if (old.display_lang != settings.display_lang) reloadDisplayLanguage();
  if (old.lang != settings.lang) generate_new();
}

function reloadDisplayLanguage() {
  var req = new XMLHttpRequest();
  req.open("get", "languages.json", false);
  req.addEventListener("readystatechange", (event) => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      // TODO
    }
  });
  req.send();
}

// ANCHOR - add event listeners
document.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    if (checked_input) generate_new();
    else check();
  }
});

check_button.addEventListener("click", check);

settings_elements.forEach((element) =>
  element.addEventListener("input", readSettings)
);

// ANCHOR - functions
function get_field_by_index(i) {
  return inputs.children[i].firstElementChild;
}

function field_keydown(event) {
  var field_index = parseInt(event.target.dataset.index);
  if (event.code == "Backspace") {
    event.preventDefault();
    if (event.target.value != "") {
      event.target.value = "";
      event.target.classList.remove("text-success");
    } else if (event.target.dataset.index > 0) {
      var field = get_field_by_index(field_index - 1);
      field.value = "";
      field.focus();
      field.classList.remove("text-success");
    }
  } else if (event.code == "Delete") {
    event.preventDefault();
    event.target.value = "";
    event.target.classList.remove("text-success");
  } else if (event.code == "ArrowRight") {
    event.preventDefault();
    get_field_by_index(field_index + 1).focus();
  } else if (event.code == "ArrowLeft") {
    event.preventDefault();
    get_field_by_index(field_index - 1).focus();
  } else if (parseInt(event.key).toString() == event.key) {
    event.preventDefault();
    if (event.target.value == "") {
      event.target.value = event.key;
      // focus next if available
      if (field_index < inputs.children.length - 1)
        get_field_by_index(field_index + 1).focus();
    } else if (field_index < inputs.children.length - 1) {
      get_field_by_index(field_index + 1).value = event.key;

      // focus next if available
      if (field_index < inputs.children.length - 2)
        get_field_by_index(field_index + 2).focus();
      else get_field_by_index(field_index + 1).focus();
    }
  } else if (event.code == "Space") {
    event.preventDefault();
    if (settings.play_on_space) play();
  } else {
    event.preventDefault();
  }
}

function generate_new() {
  number = Math.round(Math.random() * settings.max_num);
  console.log("current number: " + number);

  for (let i = inputs.children.length; i > 0; i--) {
    inputs.children[i - 1].remove();
  }

  for (let i = 0; i < number.toString().length; i++) {
    let input_field = field_example.cloneNode(true);
    input_field.hidden = false;
    input_field.firstElementChild.dataset.index = i;
    input_field.firstElementChild.addEventListener("keydown", field_keydown);
    inputs.appendChild(input_field);
  }

  inputs.firstElementChild.firstElementChild.focus();

  checked_input = false;
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
    checked_input = true;
    check_button.disabled = true;
  }
}

function tts(text) {
  audio_url = "https://utils.pintermor9.repl.co/tts";
  audio_url +=
    "?" +
    new URLSearchParams([
      ["text", text],
      ["lang", settings.lang],
    ]).toString();

  number_audio = new Audio(audio_url);

  number_audio.addEventListener("error", () => {
    alert(
      "TTS ENGINE RETURNED AN ERROR:\n" +
        number_audio.error.message +
        "\nTry again."
    );
    window.location.reload();
  });

  number_audio.addEventListener("canplaythrough", () => {
    play_button.disabled = false;
    play_button_spinner.hidden = true;
    if (settings.autoplay) number_audio.play();
  });
}

function play() {
  number_audio.play();
}

generate_new();
