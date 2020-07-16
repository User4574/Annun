const Maths = Math;
const host = 'localhost', port = 1883, iam = 'annun';
let client, annunciators, panel;

panel = $('#panel');
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

function draw_panel() {
  let rows = Maths.max(...annunciators.map(a => a.row)),
      cols = Maths.max(...annunciators.map(a => a.column));

  panel.empty();

  for (let row = 0; row < rows; row++) {
    let rdiv = $('<div class="row"></div>');
    panel.append(rdiv);
    for (let col = 0; col < cols; col++) {
      let annunciator = annunciators.find(a => (a.row - 1) == row && (a.column - 1) == col);
      if (annunciator)
        rdiv.append('<div class="annunciator" id="' + annunciator.name + '" style="background-color:' + colour_to_css(annunciator.colour) + ';">' + annunciator.annunciation + '</div>');
      else
        rdiv.append('<div class="annunciator blank"></div>');
    }
  }
}

function on_connect() {
  client.subscribe(topic('layout'));
  client.subscribe(topic('annunciations'));
}

client.onMessageArrived = function(msg) {
  if (msg.destinationName == topic('layout')) {
    console.log('Updating layout...');
    annunciators = JSON.parse(msg.payloadString);
    draw_panel();
  } else if (msg.destinationName == topic('annunciations')) {
    console.log('Annunciation event!');
    let evnt = JSON.parse(msg.payloadString);
    let annunciator = annunciators.find(a => a.name == evnt.annunciator);
    let adiv = $('#' + annunciator.name);
    adiv.css('background-color', colour_to_css(annunciator.colour, evnt.event == 'on'));
  }
}

client.connect({onSuccess: on_connect});
