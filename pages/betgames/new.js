import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';

class BetgameNew extends Component {
    state = {
        errorMessage: '',
        loading: false,
        gameTitle: '',
        gameTeam1: '',
        gameTeam2: ''
    };

    onSubmit = async (event) => {
        event.preventDefault();

        let accounts;

        this.setState({ loading: true, errorMessage: '' });

        try {
            accounts = await web3.eth.getAccounts();
            
            await factory.methods
                .createGame(this.state.gameTitle, this.state.gameTeam1, this.state.gameTeam2)
                .send({ from: accounts[0] });
            
            Router.pushRoute('/');
        } catch (err) {
            if (accounts.length == 0) {
                this.setState({ errorMessage: 'MetaMask is enabled but user is not logged in to it.' });
            } else {
                this.setState({ errorMessage: err.message });
            }
        } 
        
        this.setState({ loading: false });
    };

    render() {
        return (
            <Layout>
                <h1>Create a Betgame</h1>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <Input 
                            label="Game Title"
                            labelPosition="left"
                            placeholder='FIFA World Cup 2018 in Russia'
                            value={this.state.gameTitle}
                            onChange={event => this.setState({ gameTitle: event.target.value })} 
                        />
                    </Form.Field>

                    <Form.Field>
                        <Input
                            label="Team 1" 
                            labelPosition="left"
                            placeholder='France' 
                            value={this.state.gameTeam1}
                            onChange={event => this.setState({ gameTeam1: event.target.value })}
                        />
                    </Form.Field>

                    <Form.Field>
                        <Input 
                            label="Team 2"
                            labelPosition="left"
                            placeholder='Russia'
                            value={this.state.gameTeam2}
                            onChange={event => this.setState({ gameTeam2: event.target.value })}
                        />
                    </Form.Field>

                    <Message error header="Ooops!" content={this.state.errorMessage} />

                    <Button loading={this.state.loading} primary>Create!</Button>
                </Form>

            </Layout>
        );
    }
}

export default BetgameNew;