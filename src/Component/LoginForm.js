import React, { Component } from 'react';
import { Text } from 'react-native';

import { firebaseApp } from './firebaseApp';
import {
    Card,
    CardSection,
    Button,
    Input,
    Spinner
} from './Common';

export default class LoginForm extends Component {
    state = { email: '', password: '', error: '', loading: false, avataUrl: '' };

    onButtonPress() {
        const { email, password } = this.state;

        this.setState({ error: '', loading: true });
        firebaseApp.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                firebaseApp.auth().currentUser.updateProfile({
                    displayName: this.state.email
                }).then(() => this.onLoginSuccess.bind(this));
            })
            .catch(() => {
                firebaseApp.auth().createUserWithEmailAndPassword(email, password)
                    .then(() => firebaseApp.auth().currentUser.updateProfile({
                        displayName: this.state.email
                    }).then(() => this.onLoginSuccess.bind(this))).catch(this.onLoginFail.bind(this));
            });
    }

    onLoginSuccess() {
        console.log(this.state.email);


        this.setState({
            email: '',
            password: '',
            loading: false,
            error: '',
            avataUrl: ''
        });
    }

    onLoginFail() {
        this.setState({
            error: 'Authentication Failed',
            loading: false
        });
    }

    renderButton() {
        if (this.state.loading) {
            return <Spinner size='small' />;
        }

        return (
            <Button onPress={this.onButtonPress.bind(this)}> Login </Button>
        );
    }

    render() {
        return (
            <Card>
                <CardSection>
                    <Input
                        placeholder="user@gmail.com"
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                        label="Email"
                    />
                </CardSection>
                <CardSection>
                    <Input
                        secureTextEntry
                        placeholder="password"
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                        label="Password"
                    />
                </CardSection>

                <Text style={styles.errorTextStyle}>
                    {this.state.error}
                </Text>
                <CardSection>
                    {this.renderButton()}
                </CardSection>
            </Card>
        );
    }
}

const styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
};
