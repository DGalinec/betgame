import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';


class RequestRow extends Component {
    render() {
        return (
            <Table.Row positive={this.props.finish && (this.props.playerBet1 === this.props.score1) && (this.props.playerBet2 === this.props.score2)}>
                <Table.Cell>{this.props.playerName}</Table.Cell>
                <Table.Cell>{this.props.playerAddress}</Table.Cell>
                <Table.Cell textAlign="center">{this.props.playerBet1}</Table.Cell>
                <Table.Cell textAlign="center">{this.props.playerBet2}</Table.Cell>
            </Table.Row>
        );
    }  
}

export default RequestRow;