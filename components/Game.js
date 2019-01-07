import React, { Component } from "react";
import { Button , View, Text, Image, StyleSheet, Picker, 
    AsyncStorage, TouchableHighlight, Icon  } from "react-native";
import Player1 from "./Player1";
import * as serv from "../scripts/services";
import News from "./InfoNews";

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
        players: this.props.players, // store
        //game: [], // store
        dataLoaded: true, //state
        startBtn: "true", // state
        showInfo: true, // state
        top: 22, // state
        tip: 0, // state
        playerToPlay: this.props.toPlay, //store
        buttonPassDisable: []
    }
  }

  componentDidMount() {
    this.props.setParentState({initScreen: false});
       var button = this.state.buttonPassDisable;
       for (x in button) {
           if (this.props.players[x].lock == true) {
                button[x] = true;
           } else {
                button[x] = false; 
           }
       }
       this.setState({buttonPassDisable: button})
      this.props.setParentState({infoScreen: true});
  }

  showInfo = () => {
    this.props.setParentState({infoScreen: true});
    this.props.setParentState({top: 22});
    console.log("press demarrer");
  }


  removeStorage = () => {
      console.log("remove storage");
      //this._removeData('players');
      //this._removeData('news');
      //this._removeData('game');
      serv._removeData('breakingNews');
      //this.props.setParentState({infoScreen: true});
      
  }

  // Player click on pass until the end of the round
  pass = (index) => {
        console.log("je passe " + index);
      this.props.passPlayer(index);
      
      var button = this.state.buttonPassDisable;
      button[index] = true;
      this.setState({ buttonPassDisable: button});
  }
 

  NFCplay = () => {
        //serv._storeData("alertRead", true);
        this.props.checkChange();
  }

  render() {
      //this.props.setParentState({infoScreen: true})
      //console.log("this.state.playerToPlay: " + this.state.playerToPlay);
     // console.log("this.state.b: " + this.state.playerToPlay);
console.log("render game");
      /*console.log("this.props.players[i] : " + this.props.players[0].score
      +" "+ this.props.players[1].score
      +" "+ this.props.players[2].score
      +" "+ this.props.players[3].score
      );    
      */          
    return (
        <View>
              <View style ={{
                            position: "absolute",
                            left: -500,
                            opacity: .9,
                            top: this.props.top
                        }}>
                    <View style={{flex: 1, flexDirection: 'row', content:'strecht'}}>
                        <View style={{width: 310, height: 200, flex: 1, flexDirection: 'row'}}> 
                            <TouchableHighlight onPress={()=>this.removeStorage()}>
                                <View>
                                    <Image style={{width: 50, height: 50, marginLeft: 50}} 
                                        source={require('../assets/img/icons/close.png')}/>
                                    <Text>Tarara</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View  
                            style={this.props.toPlay == 2 ? (styles.halo) : (styles.shadow)}>
                            <Player1 
                                onPress ={ () => this.pass(2)}
                                players = {this.props.players[2]}
                                buttonPassDisable = {this.props.players[2].lock}>
                            </Player1>
                        </View>
                        <View style={{width: 310, height: 200}} >
                            <TouchableHighlight onPress={()=>this.showInfo()}>                                  
                                    <View style={{flex:1, flexDirection:"row", marginLeft: 120}}>
                                        <Text style={styles.force}>Règles</Text>
                                    </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', content:'strecht'}}>
                        <View 
                            style={this.props.toPlay == 1 ? (styles.halo) : (styles.shadow)}>
                            <Player1 onPress ={ () => this.pass(1) }
                                players = {this.props.players[1]}
                                buttonPassDisable = {this.props.players[1].lock}>
                            </Player1>
                        </View>
                        <View style={{width: 310, height: 200}} />
                        <View 
                            style={this.props.toPlay == 3 ? (styles.halo) : (styles.shadow)}>
                            <Player1 onPress ={ () => this.pass(3) }
                                players = {this.props.players[3]}
                                buttonPassDisable = {this.props.players[3].lock}>
                            </Player1>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', content:'strecht'}}>
                        <View style={{width: 310, height: 200, flex: 1, flexDirection: 'row'}}> 
                            
                            <TouchableHighlight onPress={()=>this.showInfo()}>
                                <View>
                                    <Image style={{width: 50, height: 50, marginLeft: 50}} 
                                        source={require('../assets/img/icons/swap-arrows.png')}/>
                                    <Text>Tarara</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View 
                            style={this.props.toPlay == 0 ? (styles.halo) : (styles.shadow)}>
                            <Player1 onPress ={ () => this.pass(0) }
                                players = {this.props.players[0]}
                                buttonPassDisable = {this.props.players[0].lock}>
                            </Player1>
                        </View>
                        <View style={{width: 310, height: 200, flex: 1, flexDirection: 'row'}}> 
                            <View style={{width: 200}}><Text>   </Text></View>
                            <TouchableHighlight onPress={()=>this.NFCplay()}>
                                <View>
                                    <Image style={{width: 50, height: 50}} 
                                        source={require('../assets/img/icons/undo-arrow-blanc.png')}/>
                                    <Text>Tarara</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                    
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    game: {
        position: "absolute",
        top: 0,
        left: -500,
        opacity: .99
    },
    force: {
        fontFamily: 'SofiaProRegular',
        position: 'relative',
        fontSize: 30,
        color:'white',
        backgroundColor: '#731dc0',
        textAlign: "center",
        borderRadius: 9,
        width: 200,
        height: 50,
        margin: 5
      },
    halo: {
        shadowColor: "#fff",
        shadowOffset: {x:0, y:0},
        shadowOpacity: 9,
        width: 310, 
        height: 200, 
        borderTopColor:"red",
        borderTopStartRadius: 9,
        borderTopWidth: 1
    },
    shadow: {
        width: 310, 
        height: 200
    }
  });

export default Game;