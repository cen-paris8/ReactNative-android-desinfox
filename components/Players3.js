import React, { Component } from "react";
import { View, Text, Image, StyleSheet, 
    FlatList,
    Picker,
} from "react-native";
import Data from '../json/players.json';


class Players4 extends Component {
  constructor(props) {
    super(props) 
    this.state = {
    }
  }

    componentDidMount() {
    }

  render() {
    return ( 
        <View>
             <View style={styles.playersGroup}>
                <View style={styles.player}>
                    <Image 
                        source={require("../assets/img/trumpy.png")} 
                        style={styles.imgPlayer}/>
                    <Text style={styles.text}>Trump</Text>
                </View>
                <View style={styles.player}>
                    <Image 
                        source={require("../assets/img/clinton.png")} 
                        style={styles.imgPlayer}/>
                    <Text style={styles.text}>Clinton</Text>
                </View>
            </View>
            <View style={styles.playersGroup}>
                <View style={styles.player}>
                    <Image 
                        source={require("../assets/img/macron.png")} 
                        style={styles.imgPlayer}/>
                    <Text style={styles.text}>Macron</Text>
                </View>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    playersGroup: {
        flex: 0, 
        flexDirection: 'row', 
        backgroundColor: 'red',
        alignContent: 'center'
    },
    player: {
        width: '50%', height: 150, 
        backgroundColor: 'black',
        flex:1,
        flexDirection: 'row',
        padding: 10,
    },
    imgPlayer: {
        height: 120, 
        width:120
    },
    text: {
        //position: 'relative',
        fontSize: 30,
        color:'#731dc0',
        textAlign: "center",
        padding: 5,
        paddingBottom: 20,
        textAlignVertical : "center",
        textDecorationLine: 'underline'
    }
  });

export default Players4;