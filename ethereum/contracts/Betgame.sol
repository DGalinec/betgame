pragma solidity ^0.4.17;

contract BetgameFactory {
    address[] public deployedGames;

    struct idGame {
        string title;
        string team1;
        string team2;
    }

    mapping(address => idGame) public idGames; 

    function createGame(string title, string team1, string team2) public {
        address newGame = new Betgame(title, team1, team2, msg.sender);
        deployedGames.push(newGame);

        idGame memory newIdGame = idGame ({
            title: title,
            team1: team1,
            team2: team2
        });
        
        idGames[newGame] = newIdGame;
    }

    function getDeployedGames() public view returns (address[]) {
        return deployedGames;
    }
}

contract Betgame {
    address public manager;
    
    struct Game {
        string title;
        string team1;
        string team2;
        uint score1;
        uint score2;
        bool close;
        bool finish;
    }
    
    Game public aGame;
    
    struct Player {
        address playerAddress;
        string playerName;
        uint bet1;
        uint bet2;
    }
    
    Player[] public players;
    
    address[] public winners;
    uint public winCount = 0;
    
    constructor(string title, string team1, string team2, address creator) public {
        manager = creator;
        
        Game memory newGame = Game ({
            title: title,
            team1: team1,
            team2: team2,
            score1: 0,
            score2: 0,
            close: false,
            finish: false
        });
        
        aGame = newGame;
    }
    
    function enterGame(string name, uint bet1, uint bet2) public payable {
        require(!aGame.close);
        require(!aGame.finish);
        require(msg.value == 0.01 ether);
        
        Player memory newPlayer = Player ({
            playerAddress: msg.sender,
            playerName: name,
            bet1: bet1,
            bet2: bet2
        });
        
        players.push(newPlayer);
    }
    function toggleOnOff() public restricted {
        require(!aGame.finish);
        aGame.close = !aGame.close;
    }
    
    function finalizeGame(uint score1, uint score2) public restricted {
        require(!aGame.finish);
        
        aGame.score1 = score1;
        aGame.score2 = score2;
        aGame.close = true;
        aGame.finish = true;
        
        for (uint i = 0; i < players.length; i++) {
            if (players[i].bet1 == score1 && players[i].bet2 == score2) {
                winCount += 1;
                winners.push(players[i].playerAddress);
            }
        }
        
        if (winCount > 0) {
            for (uint j = 0; j < winCount; j++) {
                winners[j].transfer(address(this).balance / (winCount - j));
            }
        } else {
            manager.transfer(address(this).balance);
        }
    }
    
    function playersCount() public view returns (uint) {
        return players.length;
    }

    function getSummary() public view returns (string, string, string, uint, uint, bool, bool, uint, uint, address) {
        return (
            aGame.title,
            aGame.team1,
            aGame.team2,
            aGame.score1,
            aGame.score2,
            aGame.close,
            aGame.finish,
            address(this).balance,
            players.length,
            manager
        );
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
}