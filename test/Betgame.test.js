const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/BetgameFactory.json');
const compiledBetgame = require('../ethereum/build/Betgame.json');

let accounts;
let factory;
let betgame;
let gameAddress;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    //deployment of BetgameFactory contract
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode, arguments: [] })
        .send({ from: accounts[0], gas: '2000000' });

    factory.setProvider(provider);

    //deployment of an instance of Betgame through BetgameFactory contract
    await factory.methods.createGame("WorldCup 2018", "France", "Spain")
        .send({ from: accounts[0], gas: '1000000' });

    //retrieve address of the previously deployed Betgame contract
    const addresses = await factory.methods.getDeployedGames().call();
    gameAddress = addresses[0];

    //creation of a JavaScript representation of the Betgame contract instance
    betgame = await new web3.eth.Contract(JSON.parse(compiledBetgame.interface), gameAddress);
    
    betgame.setProvider(provider);

});

describe('Factory contract', () => {

    it('Factory contract has been deployed', () => {
        assert.ok(factory.options.address);
    });
    it('Addresses of deployed Betgames are recorded in Factory contract', async () => {
        const addresses = await factory.methods.getDeployedGames().call();
        assert.equal(gameAddress, addresses[0]);
    });

});

describe('Betgame contract', () => {

    it('Betgame contract has been deployed', async () => {
        assert.ok(betgame.options.address);
        const agame = await betgame.methods.aGame().call();
        assert.equal("WorldCup 2018", agame.title);
        assert.equal("France", agame.team1);
        assert.equal("Spain", agame.team2);
        assert.equal('0', agame.score1);
        assert.equal('0', agame.score2);
        assert.equal(false, agame.close);
        assert.equal(false, agame.finish);
    });

    it('Betgame contract owner is accounts[0]', async () => {
        const owner = await betgame.methods.manager().call();
        assert(accounts[0], owner);
    });

    it('Enter a game and store data', async () => {
        await betgame.methods.enterGame('Moi', '2', '3').send({ 
            from: accounts[0],
            value: web3.utils.toWei('0.01', 'ether'),
            gas: '1000000'
        });
        const activePlayers = await betgame.methods.playersCount().call();
        assert.equal('1', activePlayers);
        const player = await betgame.methods.players(0).call();
        assert.equal('Moi', player.playerName);
        assert.equal('2', player.bet1);
        assert.equal('3', player.bet2);
    });

    it('Must not pay less than 0.01 ether to enter a game', async () => {
        try {
            await betgame.methods.enterGame('Moi', '2', '3').send({ 
                from: accounts[0],
                value: web3.utils.toWei('0.001', 'ether'),
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Must not pay more than 0.01 ether to enter a game', async () => {
        try {
            await betgame.methods.enterGame('Moi', '2', '3').send({ 
                from: accounts[0],
                value: web3.utils.toWei('0.1', 'ether'),
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Cannot enter a game when closed', async () => {
        await betgame.methods.toggleOnOff().send({
            from: accounts[0],
            gas: '1000000'
        });
        try {
            await betgame.methods.enterGame('Moi', '2', '3').send({ 
                from: accounts[0],
                value: web3.utils.toWei('0.01', 'ether'),
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('Toggle ON', async () => {
        await betgame.methods.toggleOnOff().send({
            from: accounts[0],
            gas: '1000000'
        });
        const agame = await betgame.methods.aGame().call();
        assert.equal(true, agame.close);
    });

    it('Toggle OFF', async () => {
        await betgame.methods.toggleOnOff().send({
            from: accounts[0],
            gas: '1000000'
        });
        let agame = await betgame.methods.aGame().call();
        assert.equal(true, agame.close);

        await betgame.methods.toggleOnOff().send({
            from: accounts[0],
            gas: '1000000'
        });
        agame = await betgame.methods.aGame().call();
        assert.equal(false, agame.close);
    });

    it('Only contract manager can Toggle the button ON / OFF', async () => {
        try {
            await betgame.methods.toggleOnOff().send({
                from: accounts[1],
                gas: '1000000'
            });
            assert(false);
        } catch(err) {
            assert(err);
        }
    });

    it('Finalize a game', async () => {
        await betgame.methods.finalizeGame('3', '5').send({ from: accounts[0] });
        const agame = await betgame.methods.aGame().call();
        assert.equal('3', agame.score1);
        assert.equal('5', agame.score2);
        assert.equal(true, agame.close);
        assert.equal(true, agame.finish);
    });

    it('Must be the contract manager to close a game', async () => {
        try {
            await betgame.methods.finalizeGame('3', '5').send({ from: accounts[1] });
            assert(false);
        } catch(err) {
            assert(err);
        }
    });

    it('A game can only be finalized once', async () => {
        await betgame.methods.finalizeGame('3', '5').send({ from: accounts[0] });
        try {
            await betgame.methods.finalizeGame('3', '5').send({ from: accounts[0] });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('If no any winner money goes to contract manager', async () => {
        await betgame.methods.enterGame('Moi', '0', '1').send({ 
            from: accounts[1],
            value: web3.utils.toWei('0.01', 'ether'),
            gas: '1000000'
        });
        await betgame.methods.enterGame('Toi', '0', '2').send({ 
            from: accounts[2],
            value: web3.utils.toWei('0.01', 'ether'),
            gas: '1000000'
        });
        await betgame.methods.enterGame('Lui', '0', '3').send({ 
            from: accounts[3],
            value: web3.utils.toWei('0.01', 'ether'),
            gas: '1000000'
        });
        let avant = await web3.eth.getBalance(accounts[0]);
        avant = parseFloat(web3.utils.fromWei(avant, 'ether'));
        await betgame.methods.finalizeGame('3', '5').send({ from: accounts[0], gas: '1000000' });
        const winners = await betgame.methods.winCount().call();
        assert.equal('0', winners);
        let apres = await web3.eth.getBalance(accounts[0]);
        apres = parseFloat(web3.utils.fromWei(apres, 'ether'));
        assert((apres - avant) > 0.028);
    });

    it('Money is shared between winners', async () => {
        let avant1 = await web3.eth.getBalance(accounts[1]);
        avant1 = parseFloat(web3.utils.fromWei(avant1, 'ether'));

        let avant3 = await web3.eth.getBalance(accounts[3]);
        avant3 = parseFloat(web3.utils.fromWei(avant3, 'ether'));

        await betgame.methods.enterGame('Moi', '3', '5').send({ 
            from: accounts[1],
            value: web3.utils.toWei('0.01', 'ether'),
            gas: '1000000'
        });
        await betgame.methods.enterGame('Toi', '0', '2').send({ 
            from: accounts[2],
            value: web3.utils.toWei('0.01', 'ether'),
            gas: '1000000'
        });
        await betgame.methods.enterGame('Lui', '3', '5').send({ 
            from: accounts[3],
            value: web3.utils.toWei('0.01', 'ether'),
            gas: '1000000'
        });


        await betgame.methods.finalizeGame('3', '5').send({ from: accounts[0], gas: '1000000' });
        const winners = await betgame.methods.winCount().call();
        assert.equal('2', winners);

        let apres1 = await web3.eth.getBalance(accounts[1]);
        apres1 = parseFloat(web3.utils.fromWei(apres1, 'ether'));

        let apres3 = await web3.eth.getBalance(accounts[3]);
        apres3 = parseFloat(web3.utils.fromWei(apres3, 'ether'));

        assert(apres1 > avant1);
        //console.log('avant1='+avant1+' apres1='+apres1+" = "+(apres1-avant1));
        //console.log('avant3='+avant3+' apres3='+apres3+" = "+(apres3-avant3));
        assert(apres3 > avant3);
    });
});