/* @flow */
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Dimensions,
  Picker,
  Button,
  TouchableHighlight,
  ListView
} from "react-native";

import Swipeout from "react-native-swipeout";
import API_KEY from "./API_KEY";
import * as firebase from "firebase";
import firebaseConfig from "./firebaseConfig";

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class Main extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      inputString: "",
      language: "",
      pickershown: false,
      output: [],
      dataSource: ds.cloneWithRows([])
    };
    this.itemsRef = this.getRef().child("items");
    this.selectLanguage = this.selectLanguage.bind(this);
    this.showPicker = this.showPicker.bind(this);
    this.getTranslation = this.getTranslation.bind(this);
    this.retrieveTranslation = this.retrieveTranslation.bind(this);
  }

  showPicker() {
    this.setState({ pickershown: true });
  }
  selectLanguage(lang) {
    this.setState({ language: lang }, () => {
      //alert(lang);
    });
  }
  getTranslation() {
    this.textInput.clear();
    fetch(
      `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${API_KEY}&lang=${
        this.state.language
      }&text=${this.state.inputString}`
    ).then(res => {
      let translation = JSON.parse(res._bodyText);
      this.setState({ output: translation.text });
      console.log(res);
      this.itemsRef.push({
        translation: translation.text + " " + this.state.inputString
      });
    });
  }
  getRef() {
    return firebase.database().ref();
  }

  componentWillMount() {}
  retrieveTranslation(itemsRef) {
    itemsRef.on("value", snapshot => {
      let items = [];
      for (let key in snapshot.val()) {
        console.log(snapshot.val()[key].translation);
        items.push(snapshot.val()[key].translation);
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      });
    });
  }

  componentDidMount() {
    this.retrieveTranslation(this.itemsRef);
  }
  render() {
    return (
      <ScrollView horizontal={true} pagingEnabled={true}>
        <View style={styles.main}>
          <Text style={styles.maintext}> Welcome </Text>
        </View>

        <View style={styles.inputpage}>
          <Button
            style={styles.selectlang}
            title="Select language"
            color="#4c323c"
            onPress={this.showPicker}
          />

          <TextInput
            style={styles.textInput}
            ref={input => {
              this.textInput = input;
            }}
            onChangeText={value =>
              this.setState({ inputString: value }, () => console.log(value))
            }
          />

          <TouchableHighlight
            style={styles.goButton}
            onPress={this.getTranslation}
            underlayColor="#baa1ab"
          >
            <Text style={styles.maintext}>Go</Text>
          </TouchableHighlight>
          <Text style={styles.textOutput}>{this.state.output}</Text>

          <Picker
            selectedValue={this.state.language}
            style={this.state.pickershown ? styles.picker : { display: "none" }}
            onValueChange={lang => {
              this.selectLanguage(lang);
              this.setState({ pickershown: false });
            }}
          >
            <Picker.Item label="" value="" />
            <Picker.Item label="Chinese" value="zh" />
            <Picker.Item label="English" value="en" />
            <Picker.Item label="French" value="fr" />
            <Picker.Item label="German" value="de" />
            <Picker.Item label="Spanish" value="es" />
          </Picker>
        </View>

        <View style={styles.listview}>
          <Text style={styles.liHeader}> Your past translations </Text>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={rowData => (
              <Swipeout
                right={[
                  {
                    text: "Delete",
                    backgroundColor: "red",
                    //  underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                    onPress: () => {
                      /*console.log(firebase.database().ref().child('items').child('translation').child(rowData));*/
                    }
                  }
                ]}
                autoClose={true}
                backgroundColor="transparent"
              >
                <View style={styles.li}>
                  <Text style={styles.liText}>{rowData}</Text>
                </View>
              </Swipeout>
            )}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#775764",
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  inputpage: {
    flex: 1,
    backgroundColor: "#baa1ab",
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  maintext: {
    color: "#ffffff",
    fontSize: 40
  },
  text: {
    color: "#4c323c",
    fontSize: 20,
    marginBottom: 10
  },
  selectlang: {
    color: "#4c323c",
    fontSize: 20,
    marginBottom: 10
  },
  textInput: {
    height: 36,
    width: 250,
    marginTop: 30,
    marginBottom: 15,
    fontSize: 18,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    color: "#4c323c"
  },
  textOutput: {
    marginTop: 10,
    fontSize: 18,
    color: "#4c323c"
    //backgroundColor: '#ead7df',
    //borderRadius: 8
  },
  picker: {
    height: 1,
    width: 100,
    borderRadius: 5,
    color: "#ffffff"
  },
  goButton: {
    width: 50,
    height: 50,
    backgroundColor: "#ead7df",
    borderRadius: 25,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  listview: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  li: {
    width: 300,
    backgroundColor: "#baa1ab",
    borderBottomColor: "#eee",
    borderColor: "transparent",
    borderWidth: 1,
    marginLeft: 37,
    paddingRight: 16,
    paddingTop: 14,
    paddingBottom: 16,
    alignItems: "center"
  },
  liText: {
    color: "#775764",
    fontSize: 16
  },
  liHeader: {
    marginVertical: 50,
    marginLeft: 37,
    color: "#775764",
    fontSize: 20
  }
});
