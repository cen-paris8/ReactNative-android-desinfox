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
      argumentsData: argumentsData.arguments,
      lastPlayer: -1,
      undo: false
    }
  }
  /*
  Initialise les data du storage
  */
  init() {
    //serv._storeData("IdNews", this.state.IdNews);
    /*serv._retrieveData("IdNews")
    .then((IdNewsObject) => {
      console.log("retreive data IdNewsObject : " + IdNewsObject);
      this.setState({IdNews: IdNewsObject});
    })
    .catch((err) => {
      console.log("Retreive Id News failed in App.js init " + err):
    });
    */
    serv._storeData("IdArgument", this.state.IdArgument);
    serv._storeData("argPlayed", this.state.argPlayed);
    serv._storeData("alert", this.state.alert);
    serv._storeData("alertRead", this.state.alertRead);
    serv._storeData("toPlay", this.state.toPlay);
    serv._storeData("endRound", this.state.endRound);
    serv._storeData("endGame", this.state.endGame);
  }

  componentDidMount() {
      //this.init();
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
          serv._retrieveData("IdNews")
            .then ((IdNewsObject) => {
              IdBreakingNews = IdNewsObject;
            console.log ("IdBreakingNews first in checkchange: " + IdBreakingNews);
            this.setState({IdNews: IdBreakingNews});
            })
            .catch((err) => {
              console.log("no Id news in IsArgementAvailable in App.js " + err);
            })

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
    console.log("checkChangeArgument");

      var newsArguments = this.state.newsArguments;
      var players = this.state.players;

    console.log("Avant  save played for Undo");
    console.log("this.state.toPlay : " + this.state.toPlay);
    console.log("this.state.IdArgument : " + this.state.IdArgument);
    console.log("players[lastPlayer].score : " + players[0].score);
    console.log("players[lastPlayer].IdArgument : " + players[0].IdArgument);

    console.log("players[lastPlayer].IdArgument : " + players[this.state.toPlay].IdArgument);

        // Save last played for Undo 
        var lastPlayer = this.state.toPlay;
        this.setState({lastPlayer: lastPlayer });
        players[lastPlayer].IdArgument = this.state.IdArgument;
        //played can be value, Id Ally or Id POL
        // players[lastPlayer].played = "";

        console.log("Ok save played for Undo");
    

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

    serv._retrieveData("game")
            .then((retrievedObjectGame) => {
              console.log(" score retrievedObjectGame : " + retrievedObjectGame);
              game = JSON.parse(retrievedObjectGame);
              console.log()
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
                if (players[x].type == winner && winner !== "" && players[x].lockType !== "GA") {
                  winnerNb++;
                } else if ( players[x].type == "" ) {
                  // nothing player don't win don't loose
                } else if (winner !== "" && players[x].lockType !== "GA") {
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
                console.log("score players[x].pseudo : " + players[x].pseudo);
                console.log("score players[x].type : " + players[x].type);
                console.log("score winnerNb : " + winnerNb);
                console.log("score bonus : " + bonus);
                console.log("score malus : " + malus);
                console.log("score players[x].score avant partage news: " + players[x].score);
                if (players[x].type == winner && winnerNb > 0 && players[x].lockType !== "GA") {
                  players[x].score = Math.round(players[x].score + (bonus/winnerNb));
                  // Get winner name
                  //alertDescWin = this.state.alertDesc;
                  alertDescWinPseudo = alertDescWinPseudo + " " + players[x].pseudo;
                  //this.setState({alertDesc: alertDescWin });
                } else if (players[x].type == "") {
                  // still nothing
                } else if (looserNb !== 0 && players[x].lockType !== "GA") {
                  players[x].score = Math.round(players[x].score - (malus/looserNb));
                }
                console.log("players[x].score apres " + players[x].score);
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
              console.log ("winnerNb : " + winnerNb);
              if (winnerNb > 1) {
                alertDescWin = alertDescWin + alertDescWinPseudo + " qui remportent la manche et se partagent un bonus de " + bonus + ".";
                this.setState({alertDesc: alertDescWin });
              } else if( allPlayerLock === false) {
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
  At the end of a round
  Update score
  Update lock
  Update Round Nb
  Reset game in storage
 */
endRoundForLockPlayers = () => {
  console.log("endRound");
  // calcul du score par joueur
  // Ajoute le bonus aux gagnants
  this.setState({endRound : true});
  var game = [];
  //var bonus = 0;
  //var malus = 0;
  //var winner = "";
  //var winnerNb = 0;
  //var looserNb = 0;
  var players = this.state.players;
  var breakingNews = -1;
  var winnerPseudo = "";
  var winnerScore = 0;

  serv._retrieveData("game")
          .then((retrievedObjectGame) => {
            game = JSON.parse(retrievedObjectGame);
            //bonus = game.bonus;
            //malus = game.malus;
            //console.log("game.totalArgumentPO : " + game.totalArgumentPO);
            //console.log("game.totalArgumentCO : " + game.totalArgumentCO);
            /*if ((game.totalArgumentPO >=6 || game.totalArgumentCO >=6)
              && game.totalArgumentPO > game.totalArgumentCO) {
              winner = "PO";
            } else if (game.totalArgumentCO >=6){
              winner = "CO";
            }*/
            //console.log("so winner is : "+ winner);
            for(x in players) {
            /*  if (players[x].type == winner && winner !== "" && players[x].lockType !== "GA") {
                winnerNb++;
              } else if ( players[x].type == "" ) {
                // nothing player don't win don't loose
              } else if (winner !== "" && players[x].lockType !== "GA") {
                looserNb++;
              }
            }*/
            // Set Alert to get show winner name :
            
            //var allPlayerLock = this.state.allPlayerLock;

            /**/
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
            
              //allPlayerLock === true
                this.setState({allPlayerLock: false});
                this.setState({alertTitle: "Manche terminée"});
                this.setState({alertDesc: "Personne ne remporte la manche"});
                this.setState({alertRead: false});
                this.setState({alertColor: "#008a01"}); //green
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
            console.log("ERLP - 0 update game store");
            this.setState({game: game});
            serv._storeData("game", game);
            // clean breakingNews
            serv._removeData("breakingNews");
            console.log("ERLP - 3 scoreScreen to show");
            // Show Score screen
            this.setState({infoScreen: true});
            this.setState({scoreScreen: true});
            this.setState({gameScreen: false});
            //this.setState({infoScreen: false});
          })  
          .catch((err) => {
            console.log ("no game in App.js/endRoundForLockPlayer l415" + err)
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
    var toPlay = 0;
    toPlay = this.state.toPlay;
    for (x in argumentsData) {
      if (argumentsData[x].IdArgument == IdArgument && argumentsData[x].category == "POL"){
          console.log ("joueur perc")
          this.setState(() => ({alertDesc: "Choisis le joueur à mettre en garde à vue."}));
          this.setState(() => ({alertColor: "#731dc0"})); //violet
          //this.setState({top: 22});
          this.setState({infoScreen: true});
          this.nextPlayer(toPlay);
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
    var isTricksCard = true;
    for (x in newsArguments) {
           if (newsArguments[x].IdNews == IdBreakingNews &&
              newsArguments[x].IdArgument == IdArgument){
            console.log("IdArgument : " + IdArgument);
            console.log("Argument valide");
            this.setState(() => ({argPlayed: newsArguments[x]}));
            serv._storeData("argPlayed", newsArguments[x]);
            argPlayed = newsArguments[x];
            index = x;
          } 
          if (newsArguments[x].IdArgument == IdArgument) {
            isTricksCard = false;
          }
    }
    
    if (isTricksCard == true) {
      this.setState({alertTitle: "Carte Atout"});
      this.setState({alertDesc: "Tout est dit sur carte."});
      this.setState(() => ({alertColor: "#731dc0"})); // violet
      //this.setState({top: 22});
      this.setState({infoScreen: true});
      this.nextPlayer(toPlay);
      return;
    }
    console.log("argPlayed : " + argPlayed);
    console.log("this.state.infoScreen :" + this.state.infoScreen);
    console.log("this.state.top7 : " + this.state.top);
    console.log("argPlayed : " + argPlayed);
    if (argPlayed == [] || argPlayed == ""){
      console.log ("failed argPlayed vide argument ne corespond pas à la news");
      console.log("IdArgument : " + IdArgument);
      console.log("IdBreakingNews : " + IdBreakingNews);

        this.setState({alertDesc: "L'argument joué n'est pas valide. Sélectionnez un autre argument ou passez votre tour."});
        this.setState(() => ({alertColor: "#731dc0"})); // violet
        //this.setState({top: 22});
        this.setState({infoScreen: true});
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
        if ( players[toPlay].ally == "SE" ){
          players[players[toPlay].allyPart].score = players[players[toPlay].allyPart].score + (argPlayed.value/2);
          players[toPlay].score = players[toPlay].score + (argPlayed.value/2);
        } else {
          players[toPlay].score = players[toPlay].score + argPlayed.value;
        }
        console.log(" players[toPlay].score apres :" + players[toPlay].score);
        console.log(" players[toPlay].type apres :" + players[toPlay].type);
        players[toPlay].played = argPlayed.value;
        this.setState({players: players});
        serv._storeData("players", players);
        // Update game force 
        if (argPlayed.type == 'PO') {
          game.totalArgumentPO = game.totalArgumentPO + argPlayed.force;
        } else {
          game.totalArgumentCO = game.totalArgumentCO + argPlayed.force;
        }
        // Save data for undo 
        game.lastArgForce = argPlayed.force;
        game.lastArgPart = argPlayed.type ;
          
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
        console.log ("Erreur inconnue ")
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

  undo = () => {
      this.setState({alertTitle: ""});
      this.setState({alertDesc: "Etes-vous sûr de vouloir annuler votre action"});
      this.setState({alertRead: false});
      this.setState(() => ({alertColor: "#731dc0"})); //violet
      this.setState({undo: true});
      this.setState({infoScreen: true});
  }

  undoArg = () => {
    this.setState({undo: false});
    var players = this.state.players;
    var index = this.state.lastPlayer;
    console.log("index : " + index);
    var IdArg = players[index].IdArgument;
    var argArray = this.state.argumentsData;
    console.log("argArray : " + argArray);
    console.log("players[index].played : " + players[index].played);
    console.log("score avant le undo : " + players[index].score);
    console.log("IdArg : " + IdArg);
    var game = this.state.game;
    if (game.lastArgForce > 0 ){
      if (game.lastArgPart == "PO") {
        game.totalArgumentPO = game.totalArgumentPO - game.lastArgForce;
      }
      if (game.lastArgPart == "CO") {
        game.totalArgumentCO = game.totalArgumentCO - game.lastArgForce;
      }
    }
    this.setState({game: game});
    serv._storeData("game", game);
    for ( x in argArray) {
      if (argArray[x].IdArgument == IdArg){
        if (argArray[x].category == "ARG") {
          players[index].score = players[index].score - players[index].played;
        } else if ( argArray[IdArg].category == "POL" ) {
          players[players[index].played].lock = false;
          players[players[index].played].lockType = "false";
          players[players[index].played].lockNb = 0;
        } else if ( argArray[IdArg].category == "ALI" ) {
          players[index].ally = "";
          var ally = players[index].played;
          players[ally].ally = "";
        }
      }
    }
    console.log("score avant le apres : " + players[index].score);
    this.setState({players: players});
    this.setState({lastPlayer: -1});
    this.setState({top: -245});
    this.setState({infoScreen: false});
    this.setState({toPlay: index});
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
      console.log ("lock x : " + x);
      console.log ("lock players[x].lock : " + players[x].lock);
      if (players[x].lock == false){
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
      this.endRoundForLockPlayers();
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

  }
  
  // return NFC ID
  playArgument = () => {
      this.setState(() => ({IdArgument: 1}));
      this.checkChange();
  }

  // force remove Breaking News
  removeBreakingNews = () =>{
    console.log ("force remove breakingNews 1");
    //already done in endRound
    serv._removeData('breakingNews');
    serv._removeData("IdNews");
    this.setState({endRound: false});
    this.setState({IdNews: -1}); 
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
      players[index].played = index;
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
      var toPlay = this.state.toPlay;
      players[this.state.toPlay].ally = "FI";
      players[this.state.toPlay].allyPart = index;
      players[index].ally = "SE";
      players[index].allyPart = this.state.toPlay;
      players[index].played = index;
      this.setState({players: players});
      serv._storeData("players", players);
      this.nextPlayer(toPlay);
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
                undo = {this.undo}
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
                undoArg = {this.undoArg}
                undo = {this.state.undo}
                alertTitle = {this.state.alertTitle}
                alertDesc = {this.state.alertDesc}
                alertColor = {this.state.alertColor}
                endRound = {this.state.endRound}>
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
