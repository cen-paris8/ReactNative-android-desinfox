//import { Font } from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Startup from './components/Startup';
import InitGame from './components/InitGame';
import Game from './components/Game';
import News from "./components/InfoNews";
import Score from "./components/Score";
import * as serv from "./scripts/services";
import newsArgumentsData from "./json/newsArguments.json";
import argumentsData from "./json/arguments.json";
import Data from './json/players.json';
import { startNFC, stopNFC } from "./helpers/NFCHelper";

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fontLoaded: false,
      initScreen: true,
      gameScreen: false,
      top: 22,
      infoScreen: false,
      scoreScreen: false,
      startUpScreen: false,
      IdNews: 1, // store
      IdArgument: 1, //store
      argPlayed: [], //store
      alertTitle: "",  // state .. à voir => store
      alertDesc: "",
      alertColor: "#008a01", //green gstate if alert Ok or NOK
      alertRead: false, // state ... à voir => store
      toPlay: 0, // store
      playerLast: 0, // state
      players: Data.players, // store && state
      endRound: false, // store
      endGame: false, // store   
      newsArguments: newsArgumentsData.newsArguments,
      argumentsData: argumentsData.arguments
    }
  }
  /*
  Initialise les data du storage
  */
  init() {
    serv._storeData("IdNews", this.state.IdNews);
    serv._storeData("IdArgument", this.state.IdArgument);
    serv._storeData("argPlayed", this.state.argPlayed);
    serv._storeData("alert", this.state.alert);
    serv._storeData("alertRead", this.state.alertRead);
    serv._storeData("toPlay", this.state.toPlay);
    serv._storeData("endRound", this.state.endRound);
    serv._storeData("endGame", this.state.endGame);
  }

  componentDidMount() {
      this.init();
      this.setState({gameScreen: false});
      this._loadAssetsAsync();
      // ToDo Check if usefull // To Sup for test
      //this.checkChange();
  }

  componentWillMount() {
    startNFC(this.handleNFCTagReading);
  }

  componentWillUnmount() {
    stopNFC();
    this.setState({gameScreen: true});
  }

  handleNFCTagReading = nfcResult => {
    
    if (nfcResult.Error) {
      console.error(nfcResult.Error.Title);
      console.error(nfcResult.Error.Message);
    } else {
      console.log("NFC tag id " + nfcResult.tagId);
      this.setState({IdArgument: nfcResult.tagId});
      //this.setState({IdArgument: 1});
      this.checkChange();
    }
  };
  /*
  Manage new argument played
  */
  checkChange = () => {
    console.log("this.state.infoScreen :" + this.state.infoScreen);
    console.log("this.state.top1 : " + this.state.top);
          //console.log("this.state.gameScreen : " + this.state.gameScreen);
          if (this.state.gameScreen === false) {
            return false;
          }
          this.setState({gameScreen: false});
          this.setState({endRound : false});
          //console.log("checkChange");
          //console.log("this.state.alertRea : " + this.state.alertRead);
          var game = [];

          serv._retrieveData("game")
                  .then((retrievedObjectGame) => {
                    game = JSON.parse(retrievedObjectGame);
                    this.setState({game: game});
                    console.log ("retreive game");
  console.log("this.state.infoScreen :" + this.state.infoScreen);
  console.log("this.state.top2 : " + this.state.top);
                    this.checkChangeArgument();
  console.log("this.state.infoScreen :" + this.state.infoScreen);
  console.log("this.state.top3 : " + this.state.top);
                    this.setState({gameScreen: true});
                  })
                  .catch((err) => {
                    console.log ("no game in App.js l157" + err)
                    // Handle error, Object either doesn't exist, expired or a system error
                }); 
          
        }
  checkChangeArgument = () => {
    if ( this.state.newsArguments == [] ){
      // change store for state
      var newsArguments = this.state.newsArguments;
    }
    if (this.state.players == []){
      // change store for state
      var players = this.state.players;
    }

    // manage end game
    //manage NFC
    //check Argument is available with news
    //console.log("argumentId : " + this.state.IdArgument);
    if (this.state.IdArgument !== 0){

      console.log("argumentId : " + this.state.IdArgument);
      // start process
      //is carte piège ?

      // is argument available with news
      console.log("this.state.infoScreen :" + this.state.infoScreen);
      console.log("this.state.top4 : " + this.state.top);
      var isArgumentAvailable = this.isArgumentAvailable();
      console.log("this.state.infoScreen :" + this.state.infoScreen);
      console.log("this.state.top5 : " + this.state.top);
      if (isArgumentAvailable === false){
        console.log("!this.isArgumentAvailable()");
      }
      this.isArgumentCanceled();
          
    }

  }
 /*
  At the end of a round
  Update score
  Update lock
  Update Round Nb
  Reset game in storage
 */
  endRound = () => {
    console.log("endRound");
    // calcul du score par joueur
    // Ajoute le bonus aux gagnants
    this.setState({endRound : true});
    var game = [];
    var bonus = 0;
    var malus = 0;
    var winner = "";
    var winnerNb = 0;
    var looserNb = 0;
    var players = this.state.players;
    var breakingNews = -1;
    var winnerPseudo = "";
    var winnerScore = 0;

    /*
    serv._retrieveData("breakingNews")
            .then((retrievedBNews) => {
              breakingNews = retrievedBNews;
              //this.endRoundProcess();
            })
            .catch((err) => {
              console.log ("no game in App.js l157" + err)
              // Handle error, Object either doesn't exist, expired or a system error
          }); 
          */

    serv._retrieveData("game")
            .then((retrievedObjectGame) => {
              game = JSON.parse(retrievedObjectGame);
              bonus = game.bonus;
              malus = game.malus;
              console.log("game.totalArgumentPO : " + game.totalArgumentPO);
              console.log("game.totalArgumentCO : " + game.totalArgumentCO);
              if ((game.totalArgumentPO >=6 || game.totalArgumentCO >=6)
                && game.totalArgumentPO > game.totalArgumentCO) {
                winner = "PO";
              } else if (game.totalArgumentCO >=6){
                winner = "CO";
              }
              console.log("so winner is : "+ winner);
              for(x in players) {
                if (players[x].type == winner && winner !== "" ) {
                  winnerNb++;
                } else if ( players[x].type == "" ) {
                  // nothing player don't win don't loose
                } else if (winner !== "" ) {
                  looserNb++;
                }
              }
              // Set Alert to get show winner name :
              if (winner !== "" ) {

              }
              var  alertDescWin = "Six étoiles ont été jouées ce tour. C'est ";
              var alertDescWinPseudo = "";
              this.setState({alertTitle: "Manche terminée"});
              //this.setState({alertDesc: alertDescWin});
              this.setState({alertRead: false});
              this.setState({alertColor: "#008a01"}); //green
              for(x in players) {
                console.log("players[x].pseudo : " + players[x].pseudo);
                console.log("players[x].type : " + players[x].type);
                console.log("winnerNb : " + winnerNb);
                if (players[x].type == winner && winnerNb > 0) {
                  players[x].score = Math.round(players[x].score + (bonus/winnerNb));
                  // Get winner name
                  //alertDescWin = this.state.alertDesc;
                  alertDescWinPseudo = alertDescWinPseudo + " " + players[x].pseudo;
                  //this.setState({alertDesc: alertDescWin });
                } else if (players[x].type == "") {
                  // still nothing
                } else if (looserNb !== 0) {
                  players[x].score = Math.round(players[x].score - (malus/looserNb));
                }
                players[x].type = "";
                // Get Winner end Game
                if (players[x].score > winnerScore) {
                    winnerPseudo = players[x].pseudo;
                    winnerScore = players[x].score;
                }
                
                //console.log("x2 : " + x);
                //console.log("players[x].lock : " + players[x].lock);
                //console.log("players[x].lockType : " + players[x].lockType);
                if(players[x].lockType == "M") {
                  players[x].lock = false;
                  players[x].lockType = "";
                }
                if(players[x].lockType == "GA") {
                  players[x].Nb--;
                  if (players[x].Nb <= 0) {
                    players[x].lock = false;
                    players[x].lockType = "";
                  }
                }
                //console.log("x3 : " + x);
                //console.log("players[x].lock : " + players[x].lock);
                //console.log("players[x].lockType : " + players[x].lockType);
              }
              if (winnerNb > 1) {
                alertDescWin = alertDescWin + alertDescWinPseudo + " qui remportent la manche et se partagent un bonus de " + bonus + ".";
                this.setState({alertDesc: alertDescWin });
              } else {
                alertDescWin = alertDescWin + alertDescWinPseudo + " qui remporte la manche et gagne un bonus de " + bonus + ".";
                this.setState({alertDesc: alertDescWin });
              }
              this.setState({players: players});
              serv._storeData("players", players);
              game.roundNb++;
              if (game.roundNb > game.newsNb){
                this.setState({alertTitle: "Partie terminée"});
                this.setState({alertDesc: "Le gagnant est " + winnerPseudo + " avec un score de " + winnerScore });
                game.endGame = true;
              }
              // Clean Data
              game.totalArgumentPO = 0;
              game.totalArgumentCO = 0;
              game.bonus = 0;
              game.malus = 0;
              console.log("ER - 0 update game store");
              this.setState({game: game});
              serv._storeData("game", game);
              // clean breakingNews
              serv._removeData("breakingNews");
              console.log("ER - 3 scoreScreen to show");
              // Show Score screen
              this.setState({infoScreen: true});
              this.setState({scoreScreen: true});
              this.setState({gameScreen: false});
              //this.setState({infoScreen: false});
            })  
            .catch((err) => {
              console.log ("no game in App.js l157" + err)
              // Handle error, Object either doesn't exist, expired or a system error
          }); 
 
  }
/*
Reset alert when already red
*/
  initAlert = () => {
    this.setState({alertTitle: ""});
    this.setState({alertDesc: ""});
    this.setState({alertRead: false});
    this.setState({alertColor: "#008a01"}); //green
  }
  /*
  Check if arguement is available with the news
  Manage Alert msg for trick card.

  */
  isArgumentAvailable = () => {
    console.log("isArgumentAvailable");
    var IdArgument = this.state.IdArgument;
    var IdBreakingNews = this.state.IdNews;
    console.log("IdBreakingNews : " + IdBreakingNews);
 
    // Is argument available for news ?
    var newsArguments = this.state.newsArguments;
    console.log ("newsArguments : " + newsArguments)
    var argPlayed = [];
    var index;
    console.log("this.state.infoScreen :" + this.state.infoScreen);
    console.log("this.state.top6 : " + this.state.top);
    // check GA & Ally
    var argumentsData = this.state.argumentsData;
    for (x in argumentsData) {
      console.log("perc IdArgument : " + IdArgument);
      console.log(" perc argumentsData[x].IdArgument : "+ argumentsData[x].IdArgument );
      console.log(" perc argumentsData[x].IdArgument == IdArgument :" + (argumentsData[x].IdArgument == IdArgument));
       console.log(" perc argumentsData[x].category " + argumentsData[x].category );
       console.log(" perc coucou");
      if (argumentsData[x].IdArgument == IdArgument && argumentsData[x].category == "POL"){
          console.log ("joueur perc")
          this.setState(() => ({alertDesc: "Choisis le joueur à mettre en garde à vue."}));
          this.setState(() => ({alertColor: "#731dc0"})); //violet
          //this.setState({top: 22});
          this.setState({infoScreen: true});
          //this.setPOL();
            console.log("Carte piège");
            return false;
        } else if (argumentsData[x].IdArgument == IdArgument && argumentsData[x].category == "ALI"){
          this.setState(() => ({alertDesc: "Choisis ton allié"}));
          this.setState(() => ({alertColor: "#008a01"})); //green
          //this.setState({top: 22});
          this.setState({infoScreen: true});
          //this.setAlly();
            console.log("Carte piège");
            this.setState({gameScreen: true});
            return false;
        } 
    }
    
    for (x in newsArguments) {
          //console.log("newsArguments[x].IdNews: " + newsArguments[x].IdNews );
          //console.log("newsArguments[x].IdArgument: " +newsArguments[x].IdArgument); 
          if (newsArguments[x].IdNews == IdBreakingNews &&
              newsArguments[x].IdArgument == IdArgument){
            console.log("IdArgument : " + IdArgument);
            console.log("Argument valide");
            this.setState(() => ({argPlayed: newsArguments[x]}));
            serv._storeData("argPlayed", newsArguments[x]);
            argPlayed = newsArguments[x];
            index = x;
          } 
    }
    console.log("argPlayed : " + argPlayed);
    if (argPlayed == [] || argPlayed == ""){
        this.setState({alertDesc: "L'argument joué n'est pas valide. Sélectionnez un autre argument ou passez votre tour."});
        this.setState(() => ({alertColor: "#731dc0"})); // violet
        //this.setState({top: 22});
        this.setState({infoScreen: true});
        return false;
    }
        console.log("this.state.infoScreen :" + this.state.infoScreen);
    console.log("this.state.top7 : " + this.state.top);
    console.log("argPlayed : " + argPlayed);
    if (argPlayed === [] || argPlayed === "") {
      this.setState(() => ({alertDesc: "L'argument joué n'est pas valide. Sélectionnez un autre argument ou passez votre tour."}));
      this.setState(() => ({alertColor: "#731dc0"})); // violet
      //this.setState({top: 22});
      this.setState({infoScreen: true});
      console.log("L'argument joué n'est pas valide. Sélectionnez un autre argument ou passez votre tour.");
      this.setState({gameScreen: true});
      return false;
    }
    // ----------------------------A remettre apres test
    //delete  newsArguments[index]; 
    console.log("this.state.infoScreen :" + this.state.infoScreen);
    console.log("this.state.top8 : " + this.state.top);
    serv._storeData("newsArguments", newsArguments);
    this.setState({newsArguments: newsArguments});
    console.log("this.state.infoScreen :" + this.state.infoScreen);
    console.log("this.state.top9 : " + this.state.top);
    // Check type player with type argument
    var players = this.state.players;
    console.log("players : " + players);
    var toPlay = 0;
    toPlay = this.state.toPlay;
    console.log("Player toPlay : " + toPlay);
    console.log("argPlayed.type : " + argPlayed.type);
    console.log("argPlayed.force : " + argPlayed.force);
    console.log("argPlayed.value : " + argPlayed.value);
    console.log("argPlayed : " + argPlayed);
    console.log("toPlay : " + toPlay);
    console.log("players : " + players);
    console.log("playeplayers[toPlay].type  : " + players[toPlay].type );
    var game = this.state.game;
    

    if (argPlayed.type == players[toPlay].type ||
      (players[toPlay].type == "" && argPlayed.type !== "undefined")) {
        // manage type player
        players[toPlay].type = argPlayed.type;
        // manage score player
        console.log(" players[toPlay].score avant :" + players[toPlay].score);
        console.log(" argPlayed.value :" + argPlayed.value);
        players[toPlay].score = players[toPlay].score + argPlayed.value;
        console.log(" players[toPlay].score apres :" + players[toPlay].score);
        console.log(" players[toPlay].type apres :" + players[toPlay].type);
        this.setState({players: players});
        serv._storeData("players", players);
        // Update game force 
        if (argPlayed.type == 'PO') {
          game.totalArgumentPO = game.totalArgumentPO + argPlayed.force;
        } else {
          game.totalArgumentCO = game.totalArgumentCO + argPlayed.force;
        }
        console.log("game.totalArgumentPO : " + game.totalArgumentPO);
        console.log("game.totalArgumentCO : " + game.totalArgumentCO);
        console.log("this.state.infoScreen :" + this.state.infoScreen);
        console.log("this.state.top10 : " + this.state.top);
        //console.log("argPlayed.force : " + argPlayed.force);
        //console.log("game.totalArgumentPO : " + game.totalArgumentPO);
        //console.log("game.totalArgumentCO : " + game.totalArgumentCO);
        // Check if all argument are played
        if (game.totalArgumentPO >= 6 || game.totalArgumentCO >= 6 ){ 
          console.log ("End Round");  
        //this.setState({top: 22});
        
          serv._storeData("game", game);
          this.endRound();
        } else {
          this.setState({alertTitle: "Carte validée"});
          this.setState({alertDesc: "Bonus: " 
                + argPlayed.value + "  Force: "
                + argPlayed.force });
          this.setState(() => ({alertColor: "#008a01"})); //green
          //this.setState({top: 22});
          this.setState({infoScreen: true});
        }
        // Update players data storage
        this.setState({game: game});
        serv._storeData("game", game);
        console.log("this.state.infoScreen :" + this.state.infoScreen);
        console.log("this.state.top11 : " + this.state.top);
        // Next player
        this.nextPlayer(toPlay);
        console.log("this.state.infoScreen :" + this.state.infoScreen);
        console.log("this.state.top12 : " + this.state.top);
        return true;
      } else {
        this.setState({alertDesc: "L'argument joué n'est pas valide. Sélectionnez un autre argument ou passez votre tour."});
        this.setState(() => ({alertColor: "#731dc0"})); // violet
        //this.setState({top: 22});
        this.setState({infoScreen: true});
        return false;
      }

  }
  // ToDo canceld link argument on the previous player
  isArgumentCanceled = () => {
    // send msg as isArgumentAvailable
    // ok end continue process
    // supprime alert alertRead = true
  }
  
  async _loadAssetsAsync() {
    try {
      await Font.loadAsync({
       'SofiaProRegular': require('./assets/fonts/SofiaProRegular.ttf'),
      });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ fontLoaded: true });
    }
  }
/*
  Found next player 

*/
  nextPlayer = (toPlay, option="") => {
    toPlay = Number.parseInt(toPlay, 10);
    console.log(" nextPlayer");
    var players = this.state.players;
    // Pass turn
    if (option == "lock") {
      players[toPlay].lock = true;
      players[toPlay].lockType = "M";
      this.setState({players: players});
    }

    this.setState({playerLast: toPlay});
    var allPlayerLock = true;
    var newPlayer =  toPlay + 1;
    if ( toPlay == 3){
      newPlayer = 0;
    }
    //console.log("newPlayer1: " + toPlay);
    
    // change store for state
    
    for (x in players){
      //console.log ("x : " + x);
      //console.log ("players[x].lock : " + players[x].lock);
      if (players[x].lock === false){
        //console.log ("xlock : " + x);
        allPlayerLock = false;
        if ( x >= newPlayer ){
          //console.log ("x >=newPlayer : " + x);
          newPlayer = x;
          break;
        }
      }
      //console.log("x : " + x);
      //console.log("players[x].lock : " + players[x].lock);
    }
    //console.log("allPlayerLock : " + allPlayerLock);
    if (allPlayerLock === true) {
      this.endRound();
      return;
    }
    console.log("this.state.infoScreen :" + this.state.infoScreen);
    console.log("this.state.top13 : " + this.state.top);
  //serv._storeData("toPlay", newPlayer);
  this.setState({toPlay: newPlayer});
  console.log("newPlayer2: " + newPlayer);
  serv._storeData("IdArgument", 1); // To sup replace by 0
  serv._storeData("argPlayed", this.state.IdArgument);
  serv._storeData("alert", "");
  serv._storeData("alertRead", false);
  }

/*
  Player pass turn during the round
  Called from Game Child
*/
  passPlayer(index){
    console.log ("passPlayer inde :" + index);
    // change store for state
    this.nextPlayer(index, "lock");
    /*
    var players = [];
    serv._retrieveDataArray("players")
            .then((retrievedData) => {
              players = retrievedData;
              console.log("players[index] : " + players[index]);
              console.log("index : " + index);
              players[index].lock = true;
              console.log("players[index].lock : " + players[index].lock);
              players[index].lockType = "M";
                    // this.setState({players: players});
              serv._storeData("players", players);
              //this.setState({players: players});
              
        })  
        .catch((err) => {
          console.log ("no players in App.js l54" + err)
          // Handle error, Object either doesn't exist, expired or a system error
      });
      */
    /*

    serv._retrieveDataArray("players")
            .then((retrievedData) => {
              players = retrievedData;
              console.log("players[index] : " + players[index]);
              console.log("index : " + index);
              players[index].lock = true;
              console.log("players[index].lock : " + players[index].lock);
              players[index].lockType = "M";
                    // this.setState({players: players});
              serv._storeData("players", players);
              this.setState({players: players});
              this.nextPlayer(index);
        })  
        .catch((err) => {
          console.log ("no players in App.js l54" + err)
          // Handle error, Object either doesn't exist, expired or a system error
      });
      */
      
  }
  
  // return NFC ID
  playArgument = () => {
      this.setState(() => ({IdArgument: 1}));
      this.checkChange();
  }

  // force remove Breaking News
  removeBreakingNews = () =>{
    console.log ("force remove breakingNews 1");
    serv._removeData('breakingNews');
    console.log ("force remove breakingNews 2");
  }
/*
Static management of "Garde à vue"
ToDo dynamic management
*/
  setPOL = (index) => {
    console.log("je mets en garde à vue :" + index);
      var players = this.state.players;
      players[index].lock = true;
      players[index].lockType = "GA";
      players[index].lockNb = 3;
      this.setState({players: players});
      serv._storeData("players", players);
  }
/*
Static management of "Alliance"
ToDo dynamic management
*/
  setAlly = (index) => {
    console.log("je m'allie avec :" + index);
      var players = this.state.players;
      players[this.state.toPlay].ally = "FI";
      players[index].ally = "SE";
      this.setState({players: players});
      serv._storeData("players", players);
  }

  render() {
    console.log("this.state.alertDesc : " + this.state.alertDesc);
    console.log("this.state.infoScreen: " + this.state.infoScreen);
    console.log("this.state.gameScreen: " + this.state.gameScreen);
    console.log("this.state.initScreen: " + this.state.initScreen);
    console.log("this.state.scoreScreen: " + this.state.scoreScreen);

    return (
      <View style={styles.container}>
        {
          this.state.scoreScreen ? (
            <Score 
                style={styles.scoreScreen}
                setParentState={newState=>this.setState(newState)}
                players = {this.state.players}
                game = {this.state.game}
                removeBreakingNews = {this.removeBreakingNews}
                infoSceen = {this.state.infoScreen}>
            </Score>
            ) : null
        }
        
        {
          this.state.gameScreen ? (
            <Game 
                style={styles.gameScreen}
                setParentState={newState=>this.setState(newState)}
                checkChange = {this.checkChange}
                nextPlayer = {this.nextPlayer}
                passPlayer = {this.passPlayer}
                setPOL = {this.setPOL}
                setAlly = {this.setAlly}
                players = {this.state.players}
                toPlay = {this.state.toPlay}
                top = {this.state.top}>
            </Game>
            ) : null
        }
        {
          this.state.infoScreen ? (
            <News 
                style={styles.infoScreen}
                setParentState={newState=>this.setState(newState)}
                initAlert = {this.initAlert}
                alertTitle = {this.state.alertTitle}
                alertDesc = {this.state.alertDesc}
                alertColor = {this.state.alertColor}>
                endRound = {this.state.endRound}
            </News>
            ) : null
        }
        {
          this.state.initScreen ? (
            <InitGame 
              style={styles.initGame}
              setParentState={newState=>this.setState(newState)}>
            </InitGame>
          ) : null
        }
        {
          this.state.fontLoaded && this.state.startUpScreen ? (
            <Startup 
                style={styles.startStyle}
                setParentState={newState=>this.setState(newState)}>
                StartUp
            </Startup>
            ) : null
        }
        
      </View> 
    );
  }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        color: 'white',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    startStyle: {
        fontFamily: 'SofiaProRegular',
        color:'white',
    },
    white: {
        fontFamily: 'SofiaProRegular',
        position: 'relative',
        fontSize: 50,
        color:'white',
        textAlign: "center",
    },
    initGame: {
      paddingTop: 50,
    }
});
