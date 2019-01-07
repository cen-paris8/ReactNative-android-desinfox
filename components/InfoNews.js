import React, { Component } from "react";
import { Button , View, Text, Image, StyleSheet, 
  AsyncStorage, TouchableHighlight  } from "react-native";
import * as serv from "../scripts/services";

class InfoNews extends Component {
  constructor(props) {
    super(props)
    this.state = {
        dataLoaded: false, // state
        news: [], // store
        infoStyles:{
                    flex:1, 
                    //color:"rgba(0,0,0,0)",
                    position: "relative"
                  }, // state
        zIndex: -1, // state
    }
  }

  componentDidMount() {
    //console.log("InfoNews mounted")
    this._retrieveData(false);
    this.setState({zIndex: -1});
    this.setState({opacity: 1});
}

removeAlert = () => {
  //serv._storeData("alertRead", true);
  //serv._storeData("IdArgument", 1);
  this.props.setParentState({infoScreen: false});
  this.props.setParentState({top: -255});
  // To Check if usefull...
  // this._retrieveData(false);
  // To Test => to remove to sup
  this.props.initAlert();
}

_retrieveData = async (alert) => {
  try {
    // get news from storage if already running
   console.log("retreive News");
   if ( alert == true && this.props.alertDesc !== undefined && this.props.alertDesc !== ""){
    this.props.setParentState(() => ({alertDesc: ""}));
    //this.setState({zIndex: 11});
    //this.props.setParentState(() => ({IdArgument: 0}));
     return this.props.alertDesc;
   }
   
    var breakingNews = await AsyncStorage.getItem('breakingNews');
    breakingNews = Number.parseInt(breakingNews, 10);
    const valueNews = await AsyncStorage.getItem('news');
    //breakingNews = str.replace('\\\"', '');
    console.log("breakingNews: " + breakingNews);  
      // else get a new one
      //const valueNews = await AsyncStorage.getItem('news');

      if (valueNews !== null) {

        // We have data!!
        console.log("We have data valueNews : "+ valueNews);
        var infoNews = this.dataLoop(JSON.parse(valueNews));

        if ( breakingNews >= 0 ){
          console.log("we have data breakingNews");
            var keyNews = breakingNews;
        } else {
          console.log("New one");
            this.props.setParentState(() => ({gameScreen: true}));
            this.props.setParentState(() => ({top: 22}));
            var max = 0;
            for (x in infoNews) {
                max++;
                console.log("max: " + max);
                var keyNews = Math.floor((Math.random() * max) + 0);  
                console.log("infoNews[keyNews]: " + infoNews[keyNews]);
            }
                    // set game store bonus/malus
            serv._retrieveData("game")
            .then((gameObject) => {
              game = JSON.parse(gameObject);
              game.bonus = infoNews[keyNews].bonus;
              game.malus = infoNews[keyNews].malus;
              serv._storeData("game", game);
            })
            .catch((err) => {
              console.log ("no set game in InfoNews.js l99 " + err)
              // Handle error, Object either doesn't exist, expired or a system error
          }); 
        }
        
        this.setState({ news: infoNews[keyNews]});  
        //delete infoNews[keyNews];
        //this._storeData("news", infoNews);

        //console.log("breakingNews : " + keyNews);
        serv._storeData("breakingNews", keyNews);
        serv._storeData("IdNews", infoNews[keyNews].IdNews);
        
        this.props.setParentState({IdNews: infoNews[keyNews].IdNews});
      }

   } catch (error) {

     // Error retrieving data
     console.log("Error retrieving data InfoNews.js l68 : " + error );

   } finally {
      this.setState({ dataLoaded: true });
      this.props.setParentState({startUpScreen: false});
      //this.props.setParentState({gameScreen: true});
      //this.props.setParentState({ IdNews: infoNews[keyNews].IdNews});
   }
}

dataLoop = (value) => {
  var dataJson = [];

  value.map(function(obj, index){

      dataJson[index] = obj;

  });
  
  //console.log ("dataJson : " + dataJson);
  //console.log ("dataJson[0].description: " + dataJson[0].description);
  return dataJson;
}

_storeData = async (item, data) => {
  try {
    await AsyncStorage.setItem(item, JSON.stringify(data));
    //console.log("Success saving data " + item + " - Game.js l76");
  } catch (error) {
    // Error saving data
    console.log("Erreur saving player - InitGame l45");
  }
}

infoStyles = (value) => {
    console.log("je change zIndex");
    this.setState({zIndex: -this.state.zIndex});
}

hideNews = () => {
  console.log("cache la news");
  this.props.setParentState({infoScreen: false});
  this.props.setParentState({top: -255});

}

render() {
  return (
      <View>
          {
          this.state.dataLoaded ? (
            <View style={styles.info}>      
              <View style={styles.container}></View>
              <View style={styles.container}>
                <View style={styles.infoNews}></View>
            
            {
              this.props.alertDesc!== "" ? (
                <View style={styles.infoCardGreen}>
                  <Text style={styles.whiteTitle}>{this.props.alertTitle}</Text>
                  
                  <Text style={styles.white}>{this.props.alertDesc}</Text>
                <View>
                      <TouchableHighlight 
                          style={{height: 50, marginTop: 5, backgroundColor:this.props.alertColor, width: 500, borderRadius: 9 }}
                          onPress={()=>this.removeAlert()}>
                          <Text style={styles.white}>OK</Text>
                      </TouchableHighlight>
                  </View>
              </View>
              ) : (
                <View style={styles.infoCard}>
                  <View>
                      <Text style={styles.white}>Selon {this.state.news.source}</Text>
                      <Text style={styles.white}>{this.state.news.description}</Text>
                  </View>
                  <View style={{flex:1, flexDirection:"row"}}>
                      <Text style={styles.green}>+ {this.state.news.bonus}</Text>
                      <Text>     </Text>
                      <Text style={styles.orange}>- {this.state.news.malus}</Text>
                  </View>
                  <View>
                      <TouchableHighlight 
                          style={{height: 50, marginTop: 5, backgroundColor:"#731dc0", width: 500, borderRadius: 9 }}
                          onPress={()=>this.hideNews()}>
                          <Text style={styles.white}>OK</Text>
                      </TouchableHighlight>
                  </View>

              </View>
              )
            }
              <View style={styles.infoNews}></View>
          </View>
          <View style={styles.container}></View>
        </View>
        
        ) : null
      }
      </View>
      
    );
  }
}


const styles = StyleSheet.create({
  info: {
    flex:1, 
    backgroundColor: "#000000",
    opacity: .7,
    flexDirection: "row"
  },
  container: {
      //flex:3, 
      //position: "relative",
      //opacity: .8,
      //flexDirection: "row",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
      width: 500,
      justifyContent: "center",
      alignItems: "center",
      //backgroundColor:"#000000",
  },
  infoNews: {
    //flex:6, 
    //flexDirection: "column",
    //backgroundColor: "#000000",
    height: 100,
    //opacity: .7,
    //justifyContent: "center"
  },
  infoCard: {
    flex: 2, 
    flexDirection: "column", 
    //width: 500, 
    height: 300, 
    justifyContent: "center",
    alignItems: "center", 
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 9,
    backgroundColor: "#000000",
    //opacity: .9
  },
  infoCardGreen: {
    flex: 2, 
    flexDirection: "column", 
    //width: 500, 
    height: 300, 
    justifyContent: "center",
    alignItems: "center", 
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 9,
    backgroundColor: "#000000",
    //padding: 150,
    //opacity: .9
  },
  
  white: {
    fontFamily: 'SofiaProRegular',
    position: 'relative',
    fontSize: 30,
    color:'white',
    textAlign: "center",
  },
  whiteTitle: {
    fontFamily: 'SofiaProRegular',
    position: 'relative',
    fontSize: 50,
    color:'white',
    textAlign: "center",
  },
  green: {
    fontFamily: 'SofiaProRegular',
    position: 'relative',
    fontSize: 30,
    color:'#008a01',
    textAlign: "center",
  },
  orange: {
    fontFamily: 'SofiaProRegular',
    position: 'relative',
    fontSize: 30,
    color:'#ff5626',
    textAlign: "center",
  },
  force: {
    fontFamily: 'SofiaProRegular',
    position: 'relative',
    fontSize: 30,
    color:'white',
    backgroundColor: '#731dc0',
    textAlign: "center",
    borderRadius: 60,
    width: 50,
    height: 50,
    margin: 5
  },

  });

export default InfoNews;