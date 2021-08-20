const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/perfData", {useNewUrlParser: true, useUnifiedTopology: true});
const machine = require("./models/Machine.js");

const socketMain = (io, socket) => {

  let macA;

  // console.log("A socket connected!", socket.id);

  socket.on("clientAuth", key => {
    if (key === "35ot8efoet7eofhu"){
      // valid node client
      socket.join("clients");
    } else if (key === "39458fo57o4734o57"){
      // a valid ui client has joined
      socket.join("ui");
    } else{
      // an invalid client has joined. GoodBye
      socket.disconnect(true);
    }
  });

  // check to see if new machine has connected, also add it
  socket.on("initPerfData", data => {
    macA = data.macA;
    
  });

  socket.on("perfData", data => {
    console.log(data);
  });
}

module.exports = socketMain;