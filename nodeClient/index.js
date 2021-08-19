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


console.log(numCores);