import React, { Component } from 'react';
import { Form, Input, Message, Button, Grid } from 'semantic-ui-react';
import Betgame from '../ethereum/betgame';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class BetForm extends Component {
    state = {
        pseudo: '',
        bet1: '',
        bet2: '',
        errorMessage: '',
        loading: false
    }

    onSubmit = async event => {
        event.preventDefault();

        const betgame = Betgame(this.props.address);

        this.setState({ loading: true, errorMessage: '' });

        if (!this.props.close && !this.props.finish) {
            try {
                const accounts = await web3.eth.getAccounts();
                
                await betgame.methods.enterGame(this.state.pseudo, this.state.bet1, this.state.bet2)
                    .send({ from: accounts[0], value: web3.utils.toWei('0.01', 'ether') });
    
                Router.replaceRoute(`/betgames/${this.props.address}`);
            } catch (err) {
                this.setState({ errorMessage: err.message });
            }
        }

        this.setState({ loading: false, pseudo: '', bet1: '', bet2: '' });

        //console.log('Player name is: ', this.state.pseudo);
        //console.log('Bet1: ', this.state.bet1);
        //console.log('Bet2: ', this.state.bet2);
        //console.log('Game Address: ', this.props.address);
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <Input
                        value={this.state.pseudo}
                        onChange={event => this.setState({ pseudo: event.target.value })}
                        label="Player Name"
                        labelPosition="left"
                        placeholder="your pseudonyme"
                    />
                    <Grid>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Input style={{ marginTop: '5px' }}
                                    value={this.state.bet1}
                                    onChange={event => this.setState({ bet1: event.target.value })}
                                    label={this.props.team1}
                                    labelPosition="left"
                                    placeholder="number of goals"
                                />
                            </Grid.Column>
                            <Grid.Column>
                                <Input style={{ marginTop: '5px' }}
                                    value={this.state.bet2}
                                    onChange={event => this.setState({ bet2: event.target.value })}
                                    label={this.props.team2}
                                    labelPosition="left"
                                    placeholder="number of goals"
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button primary loading={this.state.loading}>
                    Bet!
                </Button>
            </Form>
        );
    }
}

export default BetForm;