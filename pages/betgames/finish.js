import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Betgame from '../../ethereum/betgame';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class BetFinish extends Component {
    static async getInitialProps(props) {
        const betgame = Betgame(props.query.address);
        const summary = await betgame.methods.getSummary().call();
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
        score1: '',
        score2: '',
        loading: false,
        errorMessage: ''
    }

    onSubmit = async (event) => {
        event.preventDefault();

        let accounts;

        this.setState({ loading: true, errorMessage: '' });

        if (isNaN(this.state.score1)) {
            this.setState({ errorMessage: `score of ${this.props.team1} is not a number`});
        } else {
            if (isNaN(this.state.score2)) {
                this.setState({ errorMessage: `score of ${this.props.team2} is not a number`});
            } else {
                try {
                    accounts = await web3.eth.getAccounts();

                    if (this.props.manager === accounts[0]) {
                        const betgame = Betgame(this.props.address);

                        await betgame.methods.finalizeGame(this.state.score1, this.state.score2)
                            .send({ from: accounts[0] });
                        
                        Router.pushRoute(`/betgames/${this.props.address}`);  
                    } else {
                        this.setState({ errorMessage: 'You are not the manager of this betgame. You are not allowed to finalize the bet.'});
                    }      
                } catch (err) {
                    this.setState({ errorMessage: err.message });
                }
            }
        }

        this.setState({ loading: false });
    }

    render() {
        return (
            <Layout>
                <h1>Finalize {this.props.title}</h1>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <Input 
                            label={`score of ${this.props.team1}`}
                            labelPosition="left"
                            placeholder={`enter the final score of ${this.props.team1}`}
                            value={this.state.score1}
                            onChange={event => this.setState({ score1: event.target.value })} 
                        />
                    </Form.Field>

                    <Form.Field>
                        <Input 
                            label={`score of ${this.props.team2}`}
                            labelPosition="left"
                            placeholder={`enter the final score of ${this.props.team2}`}
                            value={this.state.score2}
                            onChange={event => this.setState({ score2: event.target.value })} 
                        />
                    </Form.Field>

                    <Message error header="Ooops!" content={this.state.errorMessage} />

                    <Button loading={this.state.loading} primary>Finalize!</Button>
                </Form>
            </Layout>
        );
    }
}

export default BetFinish;