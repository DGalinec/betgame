import web3 from './web3';
import Betgame from './build/Betgame.json';

export default (address) => {
    return new web3.eth.Contract(
        JSON.parse(Betgame.interface),
        address
    );
};