import React, { Component } from 'react';
import { Table, Message } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Betgame from '../../../ethereum/betgame';
import RequestRow from '../../../components/RequestRow';
import BetForm from '../../../components/BetForm';

class BetIndex extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;
        const betgame = Betgame(address);
        const playersCount = await betgame.methods.playersCount().call();
        const players = await Promise.all(
            Array(parseInt(playersCount))
                .fill()
                .map((element, index) => {
                    return betgame.methods.players(index).call()
                })
        );
        const summary = await betgame.methods.getSummary().call();
        console.log(players);
        
        return {
            address: address,
            players: players,
            playersCount: playersCount,
            title: summary[0],
            team1: summary[1],
            team2: summary[2],
            score1: summary[3],
            score2: summary[4],
            close: summary[5],
            finish: summary[6],
            balance: summary[7],
            playersNb: summary[8],
            manager: summary[9]    
        };
    }

    renderRows() {
        return this.props.players.map((player, index) => {
            return (
                <RequestRow
                    key={index}
                    playerName={player.playerName}
                    playerAddress={player.playerAddress}
                    playerBet1={player.bet1}
                    playerBet2={player.bet2}
                    finish={this.props.finish}
                    score1={this.props.score1}
                    score2={this.props.score2}
                />
            );
        })    
    }

    render () {
        return (
            <Layout>
                { !this.props.finish ? <h3>{this.props.title} : <span style={{ color: 'grey' }}> {this.props.team1} vs {this.props.team2}</span></h3> : '' }
                { this.props.finish ? <h3>{this.props.title} : <span style={{ color: 'grey' }}>{this.props.team1}: {this.props.score1} - {this.props.team2}: {this.props.score2}</span></h3> : ''}
                
                { (this.props.close && !this.props.finish) ? <Message warning header='This game temporarily does not accept any bet'/> : '' }
                { this.props.finish ? <Message error header='This game does not accept bets anymore'/> : '' }
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Player Name</Table.HeaderCell>
                            <Table.HeaderCell>Player Address</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">{this.props.team1}</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">{this.props.team2}</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.renderRows()}
                    </Table.Body>
                </Table>

                { (!this.props.finish && !this.props.close) ? <h3>Place a new bet on this Game</h3> : '' }
                { (!this.props.finish && !this.props.close) ? <BetForm team1={this.props.team1} team2={this.props.team2} address={this.props.address} close={this.props.close} finish={this.props.finish}/> : '' }

            </Layout>
        );
    }
}

export default BetIndex;