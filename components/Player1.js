import React, { Component } from "react";
import { Button , View, Text, Image, StyleSheet } from "react-native";


  const Player1 = (props) => {
    return (
        <View style={{flex:1, flexDirection: 'row', width: 310, height: 200}}>
        {
            props.players.idPlayer == 1 ? (
                <Image 
                    style={styles.halo}
                    source={require("../assets/img/obama.png")}
            style={{ height: 120, width: 120 }} />
            ) : null
        }
        {
            props.players.idPlayer == 2 ? (
                <Image source={require("../assets/img/trumpy.png")}
            style={{ height: 120, width: 120 }} />
            ) : null
        }
        {
            props.players.idPlayer == 3 ? (
                <Image source={require("../assets/img/macron.png")}
            style={{ height: 120, width: 120 }} />
            ) : null
        }
        {
            props.players.idPlayer == 4 ? (
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