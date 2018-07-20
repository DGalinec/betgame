import React, { Component } from 'react';
import { Card, Button, Message } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class BetgameIndex extends Component {
    static async getInitialProps() {
        const betgames0 = await factory.methods.getDeployedGames().call();
        const betgames = betgames0.reverse();

        let aGames = [];
        let i=0;
        while (i<betgames.length) {
            const element4 = await factory.methods.idGames(betgames[i]).call();
            aGames.push(element4);
            i++;
        }

        return { betgames, aGames }
    }

    renderBetgames() {
        const items = this.props.betgames.map((address, index) => {
            return {
                header: address,
                description: (
                    <Link route={`/betgames/${address}`}>
                        <a>{this.props.aGames[index].title}</a>
                    </Link>
                ),
                meta: `${this.props.aGames[index].team1} vs. ${this.props.aGames[index].team2}`,
                fluid: true
            };
        });
        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <Message info
                    header='Bet game on Rinkeby network'
                    content='List of games on which you are invited to bet 0.01 ether. Players share the amount of bets minus the cost of transactions in case of 100% accurate prognostic. In the absence of winners all bets are paid to the creator of the contract / bet. You must enable MetaMask and log on before you can place a bet.'
                />
                <h1>List of Games</h1>
                <div>

                    {this.renderBetgames()}
                    
                    <Link route="/betgames/new">
                        <a>
                            <Button 
                                style={{ marginTop: '10px' }}
                                floated="right"
                                content="Create Game"
                                icon="add circle"
                                primary={true}
                            />
                        </a>
                    </Link>
                </div>
            </Layout>
        );
    }
}

export default BetgameIndex;