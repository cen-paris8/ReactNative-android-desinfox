import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const Button = (props) => {
  return (
    <TouchableOpacity
        onPress = { props.onPress } 
        style = {styles.smallBox}>
      <Text>{ props.children }</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBody: {
    backgroundColor: 'black',
    width: '100%' ,
    padding: '20',
    alignItems: 'center',
    borderRadius: 1
  },
  buttonText:{
    color: 'white',
    fontSize: 10,
    fontWeight: '600'
  },
  smallBox: {
      backgroundColor : 'blue',
      width: '100%',
      height: 10,
      padding: 20,
      borderRadius: 5,
      color: 'white',
      justifContent: 'center',
  }
})

export { Button };