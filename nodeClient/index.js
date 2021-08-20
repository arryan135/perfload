// node program that captures local performance data
const os = require("os");
const io = require("socket.io-client");
let socket = io("http://127.0.0.1:8181");
const cpus = os.cpus();

socket.on("connect", () => {
  // use unique MAC address to identify this machine
  const nI = os.networkInterfaces();
  let macAddress;
  // loop through all the machine's network interfaces and fine a non-interval MAC address
  for (let key in nI){
    if (!nI[key][0].interval){
      macA = nI[key][0].mac;
      break;
    }
  }

  // client auth with single key value
  socket.emit("clientAuth", "35ot8efoet7eofhu");

  // get performance data every 1 second
  let perfDataInterval = setInterval(() => {
    performanceData().then(allPerformanceData => {
      socket.emit("perfData", allPerformanceData);
    });
  }, 1000);
});

const performanceData = () => {
  return new Promise(async (resolve, reject) => {
    const osType = os.type() == "Darwin"? "Mac" : os.type();
    const upTime = os.uptime();
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;
    const memUsage = Math.floor(usedMem/totalMem*100)/100;
    // Cpu type
    const cpuModel = cpus['0'].model;
    // Clock Speed
    const cpuSpeed = cpus['0'].speed;
    // number of cores
    const numCores = cpus.length;
    const cpuLoad = await getCpuLoad();

    resolve({
      freeMem, 
      totalMem, 
      usedMem,
      memUsage,
      osType,
      upTime,
      cpuModel,
      numCores,
      cpuSpeed,
      cpuLoad
    });
  });
}

const cpuAverage = () => {
  // refresh the cpu data
  const cpus = os.cpus();

  let idleMs = 0;
  let totalMs = 0;

  // loop through each core
  cpus.forEach(core => {
    // loop through each property of the current core
    for (type in core.times){
      totalMs += core.times[type];
    }
    idleMs += core.times.idle;
  });

  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length
  }
}

// current cpu load
const getCpuLoad = () => {
  return new Promise((resolve, reject) => {
    const start = cpuAverage();
    setTimeout(() => {
      const end = cpuAverage();
      const idleDifference = end.idle - start.idle;
      const totalDifference = end.total - start.total;

      // calculate the percentage of used cpu
      const percentageCpu = 100 - Math.floor(100 * idleDifference / totalDifference)
      resolve(percentageCpu);
  }, 100);
  });
}
