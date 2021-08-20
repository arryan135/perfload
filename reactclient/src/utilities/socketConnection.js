import io from "socket.io-client"
let socket = io.connect("http://localhost:8181");
socket.emit("clientAuth", "39458fo57o4734o57");
export default socket;