const rp            = require('request-promise');
const keys          = require('./keys');
const Blockchain    = require('./blockchain');

const nickcoin      = new Blockchain();

// Variables
let cycleStop       = false;
let daemon          = false;
const INTERVAL      = 10000;
const timer;

process.argv.forEach((arg) => {
    if (arg === '-d') daemon = true;
});

process.on(SIGTERM, () => {
    console.log('Stopping daemon cleanly.');
    stop();
});

(cycle = () => {
    timer = setTimeout(() => {
        runTask();
        if(!cycleStop) cycle();
    }, INTERVAL);
});

runTask = () => {
    const networkNode = nickcoin.networkNodes
}
