import React, { Component } from 'react';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import {
    View, Text, Image, Platform, YellowBox
} from 'react-native';
import {
    Button, Card, CardSection
} from './Common';
import { firebaseApp } from './firebaseApp';
YellowBox.ignoreWarnings(['Setting a timer']);

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;
const uploadImage = (uri, mime = 'application/octet-stream') => new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    let uploadBlob = null;
    const imageRef = firebaseApp.storage().ref('Images');
    fs.readFile(uploadUri, 'base64')
        .then((data) => Blob.build(data, { type: `${mime};BASE64` }))
        .then((blob) => {
            uploadBlob = blob;
            return imageRef.put(blob, { contentType: mime });
        })
        .then(() => {
            uploadBlob.close();
            return imageRef.getDownloadURL();
        })
        .then((url) => {
            resolve(url);
        })
        .catch((error) => {
            reject(error);
        });
});

class ProfileForm extends Component {
    state = { displayName: '', avataUrl: '', user: null };
    componentWillMount() {
        const curentUser = firebaseApp.auth().currentUser;
        console.log(curentUser);
        this.setState({ user: curentUser, avataUrl: curentUser.photoURL, displayName: curentUser.email });
    }

    _pickImage() {
        ImagePicker.launchImageLibrary({}, response => {
            uploadImage(response.uri)
                .then(url => {
                    firebaseApp.auth().currentUser.updateProfile({
                        photoURL: url
                    }).then(() => this.setState({ avataUrl: url }));
                })
                .catch(error => console.log(error));
        });
    }

    renderprofile() {
        const { displayName, avataUrl, user } = this.state;
        if (user != null) {
            return (
                <Card>
                    <CardSection>
                        <View style={styles.headerContentStyle}>
                            <Text style={styles.headerTextStyle}>{displayName}</Text>
                        </View>
                    </CardSection>
                    <CardSection>
                        <Image
                            style={styles.imageStyle}
                            source={{ uri: avataUrl }}
                        />
                    </CardSection>
                    <CardSection>
                        <Button onPress={this._pickImage.bind(this)}> Upload </Button>
                    </CardSection>
                    <CardSection>
                        <Button onPress={() => firebaseApp.auth().signOut()}>
                            Log Out
                 </Button>
                    </CardSection>
                </Card>
            );
        }
        return (
            <Card>
                <CardSection>
                    <Button onPress={() => firebaseApp.auth().signOut()}>
                        Log Out
                        </Button>
                </CardSection>
            </Card>
        );
    }
    render() {
        return (
            this.renderprofile()
        );
    }
}

const styles = {
    headerContentStyle: {
        flexDirection: 'column',
        justifyContent: 'space-around'
    },

    headerTextStyle: {
        fontSize: 18
    },

    thumbnailStyle: {
        height: 50,
        width: 50
    },

    thumbnailcontainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10
    },

    imageStyle: {
        height: 300,
        flex: 1,
        width: null
    }
};

export default ProfileForm;
