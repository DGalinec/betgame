import React from 'react';
import { Container, Message } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';

export default (props) => {
    return (
        <Container>
            <Head>
                <link
                    rel="stylesheet"
                    href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
                />
            </Head>
            
            <Header />
            {props.children}
            <p style={{ marginTop: '10px' }}>&copy; David Galinec 2018 - play on Rinkeby network</p>
        </Container>
    );
};