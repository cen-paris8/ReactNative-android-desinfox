import React, { Component } from "react";
import { View, Text, ImageBackground, StyleSheet} from "react-native";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';

class Startup extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      timeToWait: 3000,
      curTime: '',

    }
  }

  componentWillMount(){
    
  }

  componentDidMount() {
      //setInterval( () => {
        this.props.setParentState({initScreen: false});
        //this.props.setParentState({fontLoaded: false});
      //},3000)
  }

  render() {
    return (
      <View>
      {this.state.timeToWait > 0 ? 
        <View  style={styles.start}>
            <ImageBackground  
                source={require('../assets/img/backgroundStart.jpg')} 
                style={styles.backgroundImage}>
            </ImageBackground>
            <Text style={styles.white}>DESINFOX</Text>
            <BarIndicator color='white' />
        </View> :
        <View></View>
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
    backgroundImage: {
        //flex: 1,
        //resizeMode: 'stretch', // cover
        //opacity: 0.9,
        width: '50%',
        height: '50%',
    },
    start: {
        flex: 1,
        //flexDirection: 'column',
        //textAlign: "center",
        //position: 'absolute',
        //top: 0,
        //left: 0,
        //width: '100%',
        //height: '100%',
    },
    white: {
        position: 'relative',
        fontSize: 50,
        color:'white',
        textAlign: "center",
    }
  });

export default Startup;