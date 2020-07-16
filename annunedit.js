const Maths = Math;
const host = 'localhost', port = 1883, iam = 'annun';
let client, annunciators = [], panel, save;

panel = $('#panel');
save = $('#save');
client = new Paho.MQTT.Client(host, port, iam);

function colour_to_css(colour, on = false) {
  switch(colour) {
    case 'red':
      return on ? '#ff0000' : '#800000';
    case 'white':
      return on ? '#fff7d6' : '#ccc5a9';
  }
}

function topic(suffix) {
  return '/annun/' + (GetURLParameter('channel') || 'default') + '/' + suffix;
}

function prompts(name = '', annunciation = '', colour = '') {
  name = prompt("Name", name);
  if (!name) return false;
  annunciation = prompt("Annunciation", annunciation);
  if (!annunciation) return false;
  colour = prompt("Colour", colour);
  if (!colour) return false;

  return [name, annunciation, colour];
}

function update() {
  let rgx = /__\((\d+),(\d+)\)/;
  let name = $(this).attr('id');
  let annunciator;

  if (rgx.test(name)) {
    let [_, row, col] = name.match(rgx);

    let p = prompts();
    if (!p) return;

    annunciators.push({
      name: p[0],
      row: +row,
      column: +col,
      annunciation: p[1],
      colour: p[2]
    });
  } else {
    let annunciator = annunciators.find(a => a.name == name);

    let p = prompts(annunciator.name, annunciator.annunciation, annunciator.colour);
    if (!p) return;

    annunciator.name = p[0];
    annunciator.annunciation = p[1];
    annunciator.colour = p[2];
  }

  draw_panel();
}

function draw_panel() {
  let lrows = Maths.max(...annunciators.map(a => a.row)),
      lcols = Maths.max(...annunciators.map(a => a.column));
  let wrows = Maths.floor(window.innerHeight / 100),
      wcols = Maths.floor(window.innerWidth / 150);
  let rows = Maths.max(lrows, wrows),
      cols = Maths.max(lcols, wcols);

  panel.empty();

  for (let row = 0; row < rows; row++) {
    let rdiv = $('<div class="row"></div>');
    panel.append(rdiv);
    for (let col = 0; col < cols; col++) {
      let annunciator = annunciators.find(a => (a.row - 1) == row && (a.column - 1) == col);
      let adiv = annunciator ? 
        $('<div class="annunciator" id="' + annunciator.name + '" style="background-color:' + colour_to_css(annunciator.colour) + ';">' + annunciator.annunciation + '</div>') :
        $('<div class="annunciator edit-blank" id="__(' + (row+1) + ',' + (col+1) + ')"></div>');
      adiv.click(update);
      rdiv.append(adiv);
    }
  }
}

function publish() {
  client.send(topic('layout'), JSON.stringify(annunciators), 0, true);
}

function on_connect() {
  client.subscribe(topic('layout'));
}

client.onMessageArrived = function(msg) {
  annunciators = JSON.parse(msg.payloadString);
  save.click(publish);
  draw_panel();
}

client.connect({onSuccess: on_connect});
draw_panel();
