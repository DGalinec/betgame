import React, { Component } from 'react';
import { Card, Message, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Betgame from '../../ethereum/betgame';
import web3 from '../../ethereum/web3';
import BetForm from '../../components/BetForm';
import { Link, Router } from '../../routes';

class BetgameShow extends Component {
    static async getInitialProps(props) {
        const betgame = Betgame(props.query.address);
        const summary = await betgame.methods.getSummary().call();
        //console.log(summary);
        return {
            address: props.query.address,
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

    state = {
        errorMessage: '',
        errorCode: '',
        closeLoading: false
    }

    renderCards() {
        const {
            address,
            balance,
            playersNb,
            manager
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this game and can temporarily close or finalize it',
                style: { overflowWrap: 'break-word' } //cause the really long address to break down into 2
            },
            {
                header: address,
                meta: 'Address of the Game',
                description: 'Address of the Betgame contract on the Rinkeby network',
                style: { overflowWrap: 'break-word' } //cause the really long address to break down into 2
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Game Balance (ether)',
                description: 'The balance is how much money this game has to share between winners'
            },
            {
                header: playersNb,
                meta: 'Number of Players',
                description: 'Number of people who have already bet 0.01 ether on this game'
            }
        ];

        return <Card.Group items={items} itemsPerRow={2} />;
    }

    activateClose = async event => {
        event.preventDefault();

        const betgame = Betgame(this.props.address);

        this.setState({ closeLoading: true, errorMessage: '', errorCode: '' });

        try {
            const accounts = await web3.eth.getAccounts();

            if (this.props.manager === accounts[0]) {
                await betgame.methods.toggleOnOff().send({ from: accounts[0] });

                Router.replaceRoute(`/betgames/${this.props.address}`);
            } else {
                this.setState({ errorMessage: 'You are not the manager of this betgame. You are not allowed to temporarily close the game.'});
                this.setState({ errorCode: '1' });
            }
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        //console.log(betgame);
        this.setState({ closeLoading: false });
    }

    activateFinalize() {
        console.log('FINALIZE was clicked');
    }

    render() {
        return (
            <Layout>
                { !this.props.finish ? <h3>{this.props.title} : <span style={{ color: 'grey' }}> {this.props.team1} vs {this.props.team2}</span></h3> : '' }
                { this.props.finish ? <h3>{this.props.title} : <span style={{ color: 'grey' }}>{this.props.team1}: {this.props.score1} - {this.props.team2}: {this.props.score2}</span></h3> : ''}

                { (this.props.close && !this.props.finish) ? <Message warning header='This game temporarily does not accept any bet'/> : '' }
                { this.props.finish ? <Message error header='This game does not accept bets anymore'/> : '' }

                { this.state.errorCode === '1' ? <Message error header="Ooops!" content={this.state.errorMessage} /> : null }

                {this.renderCards()}

                <Link route={`/betgames/${this.props.address}/bets`}>
                    <a><Button primary style={{ marginTop: '10px' }}>View Bets</Button></a>
                </Link>

                { !this.props.finish ? <Button loading={this.state.closeLoading} color='orange' onClick={this.activateClose}>Close ON/OFF</Button> : '' }

                { !this.props.finish ? <Link route={`/betgames/${this.props.address}/finish`}><a><Button color='red'>Finalize Game</Button></a></Link> : '' }
                
                { (!this.props.finish && !this.props.close) ? <h3>Place a new bet on this Game</h3> : '' }
                { (!this.props.finish && !this.props.close) ? <BetForm team1={this.props.team1} team2={this.props.team2} address={this.props.address} close={this.props.close} finish={this.props.finish} /> : '' }
            </Layout>
        );
    }   
}

export default BetgameShow;