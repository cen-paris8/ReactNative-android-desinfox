import { AsyncStorage } from "react-native";

const services = {

    // remove Item
    _removeData: async (key) => {
        try {
          await AsyncStorage.removeItem(key);
          console.log("remove Data : " + key);
          return true;
        }
        catch(exception) {
            console.log("error removeData " + key + " error " + exception);
          //return false;
          
        }
    },

    _retrieveData: async (index) => {
        
        try {
        const value = await AsyncStorage.getItem(index)
        
            if (value !== null) {

                // We have data!!
                console.log("We have data "+ index);
                return value;
            }
        } catch (error) {

        // Error retrieving data
        console.log("Error retrieving " + index + " in services.js l31 " + error);

        }
    },

    _retrieveDataArray: async (index) => {
        
        try {
        const value = await AsyncStorage.getItem(index)
        
            if (value !== null) {

                // We have data!!
                
                var res = JSON.parse(value);
                var dataJson = [];
                res.map(function(obj, index){
    
                    dataJson[index] = obj;
                    //console.log(" dataJson[index] = obj : " + index);
            
                });
                //console.log("We have data "+ index + " : " + dataJson); 
                return dataJson;
            }
        } catch (error) {

        // Error retrieving data
        console.log("Error retrieving " + index + " data services.js l19 " + error);

        } finally {
            //console.log("res"+ res);
            //return res;
        }
    },



    _storeData: async (item, data) => {
        try {
        await AsyncStorage.setItem(item, JSON.stringify(data));
        console.log("Success saving data " + item + " - service.js l72");
        } catch (error) {
        // Error saving data
        console.log("Erreur saving " + index + " - Services.js l75" + error);
        }
    }

}
module.exports = services
