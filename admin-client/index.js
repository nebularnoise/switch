const get = require("axios").get;
const jwt = require("jsonwebtoken");
const readFileSync = require("fs").readFileSync;

const { SERVER_URL, API_PORT, WEBSOCKET_PORT } = require("../config.js");

const clientName = "switch";
const cert = readFileSync("./jwtRS256.key");

const token = jwt.sign(
  {
    name: "switch",
    admin: true
  },
  cert,
  { algorithm: "RS256" }
);

var buttons = require("rpi-gpio-buttons")([11], { debounce: 500 });

// bind to the clicked event and check for the assigned pins when clicked
buttons.on("clicked", function(pin) {
  get(`http://${SERVER_URL}:${API_PORT}/api/is-open`).then(function(isOpen) {
    isOpen ? close() : open();
  });
});

function open() {
  console.log("OPENING");
  get(`http://${SERVER_URL}:${API_PORT}/api/open`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`
    }
  });
}

function close() {
  console.log("CLOSING");
  get(`http://${SERVER_URL}:${API_PORT}/api/close`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`
    }
  });
}

module.exports.open = open;
module.exports.close = close;
