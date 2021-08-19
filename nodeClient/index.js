// node program that captures local performance data
const os = require("os");
const cpus = os.cpus();

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
  const start = cpuAverage();
  setTimeout(() => {
    const end = cpuAverage();
    const idleDifference = end.idle - start.idle;
    const totalDifference = end.total - start.total;

    // calculate the percentage of used cpu
    const percentageCpu = 100 - Math.floor(100 * idleDifference / totalDifference)
    console.log(percentageCpu);
  }, 100);
}

setInterval(() => {
  getCpuLoad();  
}, 1000);
