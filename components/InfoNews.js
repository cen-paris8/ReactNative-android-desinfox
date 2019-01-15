import React, { Component } from "react";
import { Button , View, Text, Image, StyleSheet, 
  AsyncStorage, TouchableHighlight  } from "react-native";
import * as serv from "../scripts/services";

class InfoNews extends Component {
  constructor(props) {
    super(props)
    console.log("in InfoNewConstructor")
    this.state = {
        dataLoaded: false, // state
        news: [], // store
        infoStyles:{
                    flex:1, 
                    //color:"rgba(0,0,0,0)",
                    position: "relative"
                  }, // state
        zIndex: -1, // state
        //breakingNews: -1
    }
  }

  componentDidMount() {
    //console.log("InfoNews mounted")
    //this._retrieveData(false);
    this.getData(this.props.alertDesc !== "");
    this.setState({zIndex: -1});
    this.setState({opacity: 1});
    // infoScreen is true
    this.props.setParentState({top: 22});
    // Change after download = true to test
    //this.props.setParentState(() => ({gameScreen: true}));
}

removeAlert = () => {
  //serv._storeData("alertRead", true);
  //serv._storeData("IdArgument", 1);
  console.log("remove alert");
  console.log("this.props.undo : " + this.props.undo);
  this.props.initAlert();
  if (this.props.undo == true) {
    this.props.undoArg();
    return;
  }
  
  // To Check if usefull...
  if (this.props.endRound == false) {
    console.log("getData in remove alert");
    //this._retrieveData(false);
    // ToDo To test if usefull
    //this.getData(false);
  } else {
    this.props.setParentState({gameScreen: false});
  }
  // To Test => to remove to sup
  this.props.setParentState({infoScreen: false});
  this.props.setParentState({top: -245});
  
}

getDataNews = (newsObject, breakingNews) => {
  console.log("New one : newsObject : " + newsObject);
            var newsJson = JSON.parse(newsObject);
            var infoNews = this.dataLoop(newsJson);
            //this.props.setParentState(() => ({gameScreen: true}));
            // ToDo test if usefull
            //this.props.setParentState(() => ({top: 22}));
            var max = 0;
            for (x in infoNews) {
                max++;
                console.log("max: " + max);
            }
            if (breakingNews > 0) {
              var keyNews = breakingNews;
            } else {
              var keyNews = Math.floor((Math.random() * max) + 0); 
            }
            breakingNews = keyNews;
            console.log("infoNews: " + infoNews);
            console.log("keyNews: " + keyNews);
            //console.log("this.state.breakingNews: " + this.state.breakingNews);
            console.log("score infoNews[keyNews]: " + infoNews[keyNews]);
            console.log("score infoNews[keyNews]: " + infoNews[keyNews].bonus);
            console.log("score infoNews[keyNews]: " + infoNews[keyNews].malus);
            //this.setState({breakingNews: keyNews});
            this.setState({news: infoNews[keyNews]});
            //this.setState({Allnews: infoNews});
            serv._storeData("news", infoNews);
            return breakingNews;
}

getDataGame = (gameObject) => {
  console.log("game : " + gameObject);
          game = JSON.parse(gameObject);
          var news = this.state.news;
          //if ( news.bonus > 0) {
            game.bonus = news.bonus;
            game.malus = news.malus;
          //} 
          console.log ("score game news.bonus : " + game.bonus);
          console.log ("score game news.malus : " + game.malus);
          serv._storeData("game", game);
}

saveData = (breakingNews) => {
  /// Save Data 
         //this.setState({ news: infoNews[keyNews]}); 
         var news = this.state.news;
         //var keyNews = breakingNews;
         console.log("this.state.breakingNews in saveData : " +  breakingNews);
         console.log("IdNews in saveData : " +  news.IdNews);
         this.props.setParentState({IdNews: news.IdNews}); 
         serv._storeData("IdNews", news.IdNews);
         
         // TO test 
         //serv._storeData("breakingNews", breakingNews);
         //serv._storeData("IdNews", infoNews[keyNews].IdNews);
         // Uniquement en fin de manche
         // Com. pour l'instant 
         if (this.props.endRound == true) {
           // delete infoNews[keyNews];
           // this.setState({ news: ""}); 
         } 
}

getData = (alert) => {
    console.log("retreive News");
    console.log("this.props.alertDesc : " + this.props.alertDesc);
  /// if Msg Card
    if ( alert ){
      console.log (" alert Card");
    this.props.setParentState(() => ({top: 22}));
    this.setState({ dataLoaded: true });
      return this.props.alertDesc;
    }

  /// Else
  var breakingNews = 0;
  serv._retrieveData("breakingNews")
            .then((breakingNewsObject) => {
               var breakingNewsData = Number.parseInt(breakingNewsObject, 10);
              if (breakingNewsData > 0) {
                breakingNews = breakingNewsData;
                console.log("breakingNews 11 : " + breakingNews);
              } else {
                breakingNews = -1;
                console.log("breakingNews 11.2 : " + breakingNews);
              }
              return serv._retrieveData("news");
            })
            .then ((newsObject) => {
              console.log("breakingNews 12 : " + breakingNews);
              console.log ("newsObject : " + newsObject);
              breakingNews = this.getDataNews(newsObject, breakingNews);
              console.log("breakingNews save in storage: " + breakingNews);
              serv._storeData("breakingNews", breakingNews);
              console.log("breakingNews 12.2 : " + breakingNews);
              return serv._retrieveData("game");
            })
            .then ((gameObject) => {
              console.log("this.state.news : " + this.state.news);
              console.log("breakingNews 13 : " + breakingNews);
              console.log ("gameObject : " + gameObject);
              this.getDataGame(gameObject);
              this.saveData(breakingNews);
              this.setState({ dataLoaded: true });
              this.props.setParentState({startUpScreen: false});
              this.props.setParentState(() => ({gameScreen: true}));
            })
            .catch((err) => {
              console.log ("no set breakingNews in InfoNews.js l132 " + err)
              // Handle error, Object either doesn't exist, expired or a system error
          }); 
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
  this.props.setParentState({top: -245});

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
                          style={{height: 50, marginTop: 30, backgroundColor:this.props.alertColor, width: 500, borderRadius: 9}}
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