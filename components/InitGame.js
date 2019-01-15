import React, { Component } from "react";
import { Button , View, Text, Image, StyleSheet, Picker, AsyncStorage  } from "react-native";
import Players4 from './Players4.js';
import Players3 from './Players3.js';
import Data from '../json/players.json';
import NewsData from '../json/news.json';
import GameData from '../json/game.json';
import newsArgumentsData from "../json/newsArguments.json";
import argumentsLinksData from "../json/argumentsLinks.json";
import * as serv from "../scripts/services";
//import argumentsData from "./json/arguments.json";


class InitGame extends Component {
  constructor(props) {
    super(props)
    this.state = {
        playerNumber : "4", // TO SUP
        gameNumber: "2", // TO SUP
        players: Data.players,  // store
        news: NewsData.news, // store
        buttonDisable: true, // state
        game: GameData, // store
        newsArguments: newsArgumentsData.newsArguments, // store
        argumentsLinks: argumentsLinksData.argumentsLinks // store
    }
  }

    componentDidMount() {
        //this.initPlayers(); // TO SUP
        //this.initGame(); // TO SUP
        //this.next(); // TO SUP
        console.log("Init Game");
        this.props.setParentState({startUpScreen: false});
    }

    initPlayers = (itemValue) => {
        this.setState({playerNumber: parseInt(itemValue) });
        if ( itemValue == "3") {
            var DataAlt = require('../json/players3.json');
            this.setState({players: DataAlt.players });
        }
        if (itemValue !== "0" && this.state.gameNumber !== "0"){
            this.setState({buttonDisable: false});
        } else {
            this.setState({buttonDisable: true});
        }
    }

    initGame =  (itemValue) => {
        this.setState({gameNumber: parseInt(itemValue) });
        if (itemValue !== "0" && this.state.playerNumber !== "0"){
            this.setState({buttonDisable: false});
        } else {
            this.setState({buttonDisable: true});
        }
        var gameData = this.state.game;
        gameData.newsNb = parseInt(itemValue);
        gameData.roundNb = 1;
        gameData.endGame = false;
        this.setState({game: gameData});
    }

    next = () => {
        // remove all session data 
        this.props.setParentState({players: Data.players});
        serv._removeData('players');
        serv._removeData('news');
        serv._removeData('game');
        serv._removeData('breakingNews');
        serv._removeData('newsArguments');
        serv._removeData('argumentsLinks');
        serv._removeData('IdNews');
        serv._removeData('argPlayed');
        serv._removeData('alert');
        serv._removeData('alertRead');
        serv._removeData('playerToPlay');
        serv._removeData('endRound');
        serv._removeData('endGame');
        //console.log("J'ai pressé le bouton");
        this.init();
        //console.log('end initGame');
    }

    init() {
        var players = this.state.players;
        console.log("players initGame (86): " + players[1].score);
        serv._storeData("players", this.state.players);
        serv._storeData("news", this.state.news);
        serv._storeData("game", this.state.game);
        serv._storeData("newsArguments", this.state.newsArguments);
        serv._storeData("argumentsLinks", this.state.argumentsLinks);
        // test initScreen
        this.props.setParentState({startUpScreen: true});
        this.props.setParentState({infoScreen: true});
        this.props.setParentState({initScreen: false});

    }

  render() {
    return (
        <View>
            <Text style={styles.white}>DESINFOX</Text>
                <View style={styles.line}>
                <Text style={styles.white}>Nombre de joueurs</Text>
                <Picker
                    selectedValue={this.state.playerNumber}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) => this.initPlayers(itemValue)}>
                    <Picker.Item label="0" value="0" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                </Picker>
                <Text style={styles.white}>Nombre de news</Text>
                <Picker
                    selectedValue={this.state.gameNumber}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) => this.initGame(itemValue)}>
                    <Picker.Item label="0" value="0" />
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                </Picker>
                </View>
                
            {
            this.state.playerNumber == 4 ? (
                    <Players4></Players4>
            ) : null 
            }
            {
            this.state.playerNumber == 3 ? (
                <Players3></Players3>
            ) : null 
            }
            <Button
                onPress={() => { this.next() }}
                title="OK"
                color="#731dc0"
                accessibilityLabel="Start Game"
                disabled= {this.state.buttonDisable}
            />
        </View>
    );
  }
}

const styles = StyleSheet.create({
    line: {
        flex: 1,
        flexDirection: "row",
        height: 30,
    },
    white: {
        position: 'relative',
        fontSize: 30,
        color:'white',
        textAlign: "center",
        padding: 20,
    },
    picker: {
        height: 50, 
        width: 100,
        backgroundColor: "#731dc0",
        color: "black",
        borderRadius: .1,
    }
  });

export default InitGame;