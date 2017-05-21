// Application developed by Diana Vainberg (dkv3@kent.ac.uk)

import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { YummlyService } from '../../providers/yummly-service';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-detail',
  templateUrl: 'details.html',
})
export class DetailsPage {
  item: any;
  itemDetails: any;
  ingredientList: String[];
  recipeTime: String;
  rating: Number[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public recipeService: YummlyService, private inAppBrowser: InAppBrowser) {
    this.item = navParams.get('item');
    this.getDetails(this.item.id);
  }

  //Function that subscribes to a service that gets a recipe from
  //Yummly's API by the recipe's id, to be able to get all the details
  //of the recipe
  getDetails(recipeId){
    this.recipeService.getRecipe(recipeId).subscribe(response =>{
      this.itemDetails = response;
      this.ingredientList = this.itemDetails.ingredientLines;
      //Conditional that checks the amount of time that the
      //recipe needs to be done
      if (this.itemDetails.totalTimeInSeconds != null){
        var recipeTime = this.itemDetails.totalTimeInSeconds/60;
        if (recipeTime >= 120 && recipeTime < 180){
          let minutes = recipeTime - 120;
          if (minutes == 0){
            this.recipeTime = "2 hours";
          } else {
            this.recipeTime = "2 hours and " + minutes + "minutes";
          }
        } else if (recipeTime >= 60 && recipeTime < 120){
          let minutes = recipeTime - 60;
          if (minutes == 0){
            this.recipeTime = "1 hour";
          }else{
            this.recipeTime = "1 hour and " + minutes + "minutes";
          }
        } else {
          this.recipeTime = recipeTime + " minutes";
        }
      }
      if (this.itemDetails.rating != null){
        this.rating = new Array(this.itemDetails.rating);
      }

    }, null, () => console.log("getDetails Completed"))
  }

  //Function that receives a URL and uses the plugin inAppBrowser
  //to open it inside the app
  launch(url) {
    this.inAppBrowser.create(url);
  }


}
