import React, { Component } from "react";
import { Button , View, Text, Image, StyleSheet } from "react-native";

class Score extends Component {
  constructor(props) {
    super(props)
    this.state = {
        players: this.props.players, // store
    }
  }

  componentDidMount() {
      this.getPercentByPlayer();
  }
  getPercentByPlayer() {
      var players = this.state.players;
      var total = 0;
      var percent = 0;
      for (x in players) {
        total = total + players[x].score;
      }
      for (x in players) {
        players[x].percent = Math.round((players[x].score*100)/total);
        if (players[x].percent > 25) {
            players[x].percentColor = 70 - (Math.round((players[x].score*100)/total));
        } else if (players[x].percent > 10)  {
            players[x].percentColor = 60 - (Math.round((players[x].score*100)/total));
        }
        else {
            players[x].percentColor = 50 - (Math.round((players[x].score*100)/total));
        }
        
        console.log(" x: " + x);
        console.log(" players[x].percent : " + players[x].percent );
        console.log(" players[x].percentColor: " + players[x].percentColor);
        console.log(" players[x].percentColor: " + players[x].percentColor);
      }
      this.setState({players: players});
  }
  nextNews = () => {
console.log( "this.props.game.endGame : " + this.props.game.endGame);
        this.props.removeBreakingNews();
        if (this.props.game.endGame == true) {
            this.props.setParentState({initScreen: true});
            this.props.setParentState({gameScreen: false});
        } else {
            //this.props.setParentState({initScreen: f});
            this.props.setParentState({gameScreen: true});
        }
        this.props.setParentState({scoreScreen: false});
  }

  render() {
                 
    return (
        <View style={{flex:1, flexDirection: 'column'}}>
                <View>
                    { this.props.game.endGame ==true ? (
                        <Text style={styles.white}>Fin de partie</Text>
                    ) : (
                        <Text style={styles.white}>Fin de manche</Text>
                    )}
                </View>
                <View style={{flex:1, flexDirection: 'row', marginTop: 10}}>
                    <View style={{paddingRight:10, paddingLeft:10}}>
                        <Text style={styles.white}>{this.state.players[0].percent}%</Text>
                        <View style={{height:250, backgroundColor:this.state.players[0].color}}>  
                            <View style={{height:(this.state.players[0].percentColor)*5, width: 120, backgroundColor:"black"}}><Text>  </Text></View>
                        </View>  
                        <Image 
                            style={styles.halo}
                            source={require("../assets/img/obama.png")}
                            style={{ height: 120, width: 120, marginTop:20 }} />
                    </View>
                    <View style={{paddingRight:10, paddingLeft:10}}>
                        <Text style={styles.white}>{this.state.players[1].percent}%</Text>
                        <View style={{height:250, backgroundColor:this.state.players[1].color}}>  
                            <View style={{height:(this.state.players[1].percentColor)*5, width: 120, backgroundColor:"black"}}><Text>  </Text></View>
                        </View>
                        <Image source={require("../assets/img/trumpy.png")}
                            style={{ height: 120, width: 120, marginTop:20 }} />
                    </View>
                    <View style={{paddingRight:10, paddingLeft:10}}>
                        <Text style={styles.white}>{this.state.players[2].percent}%</Text>
                        <View style={{height:250, backgroundColor:this.state.players[2].color}}>  
                            <View style={{height:(this.state.players[2].percentColor)*5, width: 120, backgroundColor:"black"}}><Text>  </Text></View>
                        </View>
                        <Image source={require("../assets/img/macron.png")}
                            style={{ height: 120, width: 120, marginTop:20 }} />
                    </View>
                    <View >
                        <Text style={styles.white}>{this.state.players[3].percent}%</Text>
                        <View style={{height: 250, backgroundColor:this.state.players[3].color}}>  
                            <View style={{height:(this.state.players[3].percentColor)*5, width: 120, backgroundColor:"black"}}><Text>  </Text></View>
                        </View>
                        <Image source={require("../assets/img/clinton.png")}
                    style={{ height: 120, width: 120, marginTop:20 }} />
                    </View> 
            </View>
            <View style={{maringTop: 10}}>
                <Button
                        title="Next"
                        onPress={() => { this.nextNews() }}
                        color= "#731dc0"  /> 
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    white: {
        fontFamily: 'SofiaProRegular',
        position: 'relative',
        fontSize: 30,
        color:'white',
        textAlign: "center",
    },
    game: {
        position: "absolute",
        top: 0,
        left: -500,
        opacity: .99
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

export default Score;