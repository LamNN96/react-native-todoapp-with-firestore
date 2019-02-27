import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from "react-native";
import firebase from "react-native-firebase";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      names: []
    };
    this.ref = firebase.firestore().collection("tran");
  }

  componentDidMount() {
    this.ref.onSnapshot(querySnapshot => {
      let data = [];
      querySnapshot.forEach(doc => {
        data.push({
          id: doc.id,
          name: doc.data().name
        });
      });
      this.setState({
        names: data,
        name: ""
      });
    });
  }

  onAddClick = () => {
    this.ref
      .add({
        name: this.state.name
      })
      .then(doc => {
        this.setState({
          name: ""
        });
      })
      .catch(err => {
        console.log("err");
      });
  };

  render() {
    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={{ flex: 4 }}
            value={this.state.name}
            underlineColorAndroid="#000"
            onChangeText={text => {
              this.setState({
                name: text
              });
            }}
          />
          <TouchableHighlight
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={this.onAddClick}
          >
            <Text>ADD</Text>
          </TouchableHighlight>
        </View>
        <FlatList
          data={this.state.names}
          renderItem={({ item, index }) => <Item index={index} item={item} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

class Item extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.ref = firebase.firestore().collection("tran");
  }

  onItemPress = () => {
    this.ref
      .doc(this.props.item.id)
      .delete()
      .then(() => {
        console.log("done");
      })
      .catch(err => {
        console.log("err", err);
      });
  };

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.onItemPress}>
          <Text style={{ fontSize: 16, marginTop: 8 }}>
            {this.props.item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
