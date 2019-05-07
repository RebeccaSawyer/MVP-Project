import React from "react";
import { StyleSheet, Text, View, TextInput, ScrollView } from "react-native";
import Main from "./Main";

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Main />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#baa1ab",
    alignItems: "center",
    justifyContent: "center"
  }
});
