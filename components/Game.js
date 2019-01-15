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
        buttonPassDisable: [], 
        rules: false
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

  showRules = () => {
      console.log("showRules ");
        //var boolRules = !this.state.rules;
        //this.setState({rules: true});
        //this.props.setParentState({infoScreen: false});
  }


  removeStorage = () => {
      console.log("remove storage");
      //force clean Breaking news ID if not already remove
      serv._removeData('breakingNews');
      //this.props.setParentState({infoScreen: true});
      
  }

  setPOL = (index) => {
      console.log("setPol : " + index);
      this.props.setPOL(index);
  }
  setAlly = (index) => {
        this.props.setAlly(index);
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
        console.log("j'appelle checkChange");
        this.props.checkChange();
  }

  undo = () => {
      console.log("j'appelle undo")
      this.props.undo();
  }

  render() {
      //this.props.setParentState({infoScreen: true})
      //console.log("this.state.playerToPlay: " + this.state.playerToPlay);
     // console.log("this.state.b: " + this.state.playerToPlay);
        console.log("render game");      
        //console.log("this.state.rules : " + this.state.rules); 

    return (
        <View>
            {this.state.rules == true ? (
                <View>
                    <TouchableHighlight onPress={()=> this.showRules()}>
                        <Image style={{width: 1900, height: 1080, marginLeft: 50}} 
                        source={require('../assets/img/regles.png')}/>
                    </TouchableHighlight>
                </View>
            ) : (

            
              <View style ={{
                            position: "absolute",
                            left: -500,
                            opacity: .9,
                            top: this.props.top
                        }}>
                    <View style={{flex: 1, flexDirection: 'row', content:'strecht'}}>
                        <View style={{width: 310, height: 180, flex: 1, flexDirection: 'row'}}> 
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
                                buttonPassDisable = {this.props.players[2].lock}
                                setPOL = {() => this.setPOL(2)}
                                setAlly = {() => this.setAlly(2)}>
                            </Player1>
                        </View>
                        <View style={{width: 310, height: 180}} >
                            <TouchableHighlight onPress={()=>this.showRules()}>                                  
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
                                buttonPassDisable = {this.props.players[1].lock}
                                setPOL = {() => this.setPOL(1)}
                                setAlly = {() => this.setAlly(1)}>
                            </Player1>
                        </View>
                        <View style={{width: 310, height: 180}} />
                        <View 
                            style={this.props.toPlay == 3 ? (styles.halo) : (styles.shadow)}>
                            <Player1 onPress ={ () => this.pass(3) }
                                players = {this.props.players[3]}
                                buttonPassDisable = {this.props.players[3].lock}
                                setPOL = {() => this.setPOL(3)}
                                setAlly = {() => this.setAlly(3)}>
                            </Player1>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', content:'strecht'}}>
                        <View style={{width: 310, height: 180, flex: 1, flexDirection: 'row', paddingTop:80}}> 
                            
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
                                buttonPassDisable = {this.props.players[0].lock}
                                setPOL = {() => this.setPOL(0)}
                                setAlly = {() => this.setAlly(0)}>
                            </Player1>
                        </View>
                        <View style={{width: 310, height: 180, flex: 1, flexDirection: 'row', paddingTop:80}}> 
                            <View style={{width: 200}}><Text>   </Text></View>
                            <TouchableHighlight onPress={()=>this.undo()}>
                                <View>
                                    <Image style={{width: 50, height: 50}} 
                                        source={require('../assets/img/icons/undo-arrow-blanc.png')}/>
                                    <Text>Tarara</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>                    
            </View>
            )}
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
        height: 180, 
        borderTopColor:"red",
        borderTopStartRadius: 9,
        borderTopWidth: 1
    },
    shadow: {
        width: 310, //310, 
        height: 180 //200
    }
  });

export default Game;