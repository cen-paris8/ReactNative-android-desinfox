import React, { Component } from "react";
import { Button , View, Text, Image, StyleSheet, TouchableHighlight } from "react-native";


  const Player1 = (props) => {
    return (
        <View style={{flex:1, flexDirection: 'row', width: 310, height: 200}}>
        {
            props.players.idPlayer == 1 && props.players.lockType == "GA" ? (
                <Image 
                    style={styles.halo}
                    source={require("../assets/img/obamaPrison.png")}
            style={{ height: 120, width: 120 }} />
            ) : null
        }
        {
            props.players.idPlayer == 1 && props.players.lockType !== "GA" ? (
                <Image 
                    style={styles.halo}
                    source={require("../assets/img/obama.png")}
            style={{ height: 120, width: 120 }} />
            ) : null
        }
        {
            props.players.idPlayer == 2 && props.players.lockType == "GA" ? (
                <Image source={require("../assets/img/trumpPrison.png")}
            style={{ height: 120, width: 120 }} />
            ) : null
        }
        {
            props.players.idPlayer == 2 && props.players.lockType !== "GA" ? (
                <Image source={require("../assets/img/trumpy.png")}
            style={{ height: 120, width: 120 }} />
            ) : null
        }
        {
            props.players.idPlayer == 3 && props.players.lockType == "GA" ? (
                <Image source={require("../assets/img/macronPrison.png")}
            style={{ height: 120, width: 120 }} />
            ) : null
        }
        {
            props.players.idPlayer == 3 && props.players.lockType !== "GA" ? (
                <Image source={require("../assets/img/macron.png")}
            style={{ height: 120, width: 120 }} />
            ) : null
        }
        {
            props.players.idPlayer == 4 && props.players.lockType == "GA" ? (
                <Image source={require("../assets/img/clintonPrison.png")}
            style={{ height: 120, width: 120 }} />
            ) : null
        }
        {
            props.players.idPlayer == 4 && props.players.lockType !== "GA" ? (
                <Image source={require("../assets/img/clinton.png")}
            style={{ height: 120, width: 120 }} />
            ) : null
        }
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.white}>Joueur {props.players.idPlayer}</Text>
            <Text style={styles.white}>{props.players.score}</Text>
            <Button
                title="Passer"
                onPress = { props.onPress } 
                disabled= {props.buttonPassDisable}  
                color= {props.players.color}   /> 
            <View style={{flex:1, flexDirection: "row"}}>
                <TouchableHighlight onPress={ props.setPOL }>
                        { props.players.lockType == "GA" ? (
                            <View style ={{backgroundColor: "#731dc0"}}>
                                <Image source={require("../assets/img/icons/handcuffs.png")} 
                                    style={{ height: 30, width:30, marginLeft:20, marginRight:20, marginTop:5 }}/>
                            </View>
                        ) : (
                            <View>
                                <Image source={require("../assets/img/icons/handcuffs.png")} 
                                    style={{ height: 30, width: 30, marginLeft:20, marginRight:20, marginTop:5 }}/>
                            </View>
                        )}
                </TouchableHighlight> 
                <TouchableHighlight onPress={ props.setAlly }>
                    { props.players.ally == "SE" || props.players.ally == "FI" ? (
                        <View style={{backgroundColor: "#731dc0"}}>
                            <Image source={require("../assets/img/icons/ally.png")} 
                                style={{ height: 30, width: 30, marginLeft:20, marginRight:20, marginTop:5 }}/>
                        </View>
                    ) : (
                        <View>
                            <Image source={require("../assets/img/icons/ally.png")} 
                                style={{ height: 30, width: 30, marginLeft:20, marginRight:20, marginTop:5 }}/>
                        </View>
                    )}
                </TouchableHighlight> 
            </View> 
        </View>
    </View>
    );
  }




const styles = StyleSheet.create({
    white: {
        fontFamily: 'SofiaProRegular',
        position: 'relative',
        fontSize: 20,
        color:'white',
        textAlign: "center",
    }

  });

export default Player1;