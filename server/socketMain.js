const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/perfData", {useNewUrlParser: true, useUnifiedTopology: true});
const Machine = require("./models/Machine.js");

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
      console.log("A react client has joined!");
      Machine.find({}, (err, docs) => {
        docs.forEach(aMachine => {
          aMachine.isActive = false;
          io.to("ui").emit("data", aMachine);
        });
      });
    } else{
      // an invalid client has joined. GoodBye
      socket.disconnect(true);
    }
  });

  socket.on("disconnect", () => {
    Machine.find({macA: macA}, (err, docs) => {
      if (docs.length > 0){
        docs[0].isActive = false;
        io.to("ui").emit("data", docs[0]);
      }
    });
  });

  // check to see if new machine has connected, also add it
  socket.on("initPerfData", async (data) => {
    macA = data.macA;
    // check the mongodb
    const mongooseResponce = await checkAndAdd(data);
    console.log(mongooseResponce);
  });

  socket.on("perfData", data => {
    console.log(data);
    io.to("ui").emit("data", data);
  });
}

const checkAndAdd = (data) => {
  return new Promise((resolve, reject) => {
    Machine.findOne(
      {macA: data.macA},
      (err, doc) => {
        if (err){
          throw err;
          reject(err);
        } else if (doc === null){
          // add to the db 
          let newMachine = new Machine(data);
          newMachine.save();
          resolve("added");
        } else{
          // machine exists in the database
          resolve("found");
        }
      }
    );
  });
}

module.exports = socketMain;