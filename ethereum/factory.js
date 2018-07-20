import web3 from './web3';
import BetgameFactory from './build/BetgameFactory.json';
const instance = new web3.eth.Contract(
    JSON.parse(BetgameFactory.interface),
    '0x20C1cC8064838291c4D936b17Ac7937F515A9EFE'
);
export default instance;