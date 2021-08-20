const socketMain = (io, socket) => {
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
  })
  socket.on("perfData", data => {
    console.log(data);
  });
}

module.exports = socketMain;