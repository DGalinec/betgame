const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
const betgamePath = path.resolve(__dirname, 'contracts', 'Betgame.sol');

fs.removeSync(buildPath); //delete existing 'build' folder

const source = fs.readFileSync(betgamePath, 'utf8');

const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath); //create new 'build' folder if does not exist already

//console.log(output);

for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}