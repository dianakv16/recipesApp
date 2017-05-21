// Application developed by Diana Vainberg (dkv3@kent.ac.uk)

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DetailsPage } from '../details/details';
import { YummlyService } from '../../providers/yummly-service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  recipes: any;
  images: any;
  attribution: any;

  constructor(public navCtrl: NavController, public recipeService: YummlyService,
    private socialSharing: SocialSharing, private inAppBrowser: InAppBrowser,
    private storage: Storage) {
    }


    ionViewDidLoad(){
      //Subscribing to the service that gets a list of recipes
      //from Yummly's API
      this.recipeService.getRecipes().subscribe(response =>{
        this.recipes = response.matches;
        this.attribution = response.attribution;

        //The function getImage is called for each recipe's id
        //to get its corresponding image
        this.images = [];
        for (let i = 0; i < this.recipes.length; i++) {
          this.getImage(this.recipes[i].id);
        }
      }, null,() => console.log("getRecipes Completed"))
    }

    //Function that subscribes to a service that gets a recipe from
    //Yummly's API by the recipe's id, to be able to get a better
    //quality image of the recipe
    getImage(recipeId){
      this.recipeService.getRecipe(recipeId).subscribe(response =>{
        let image = false;
        //This conditional is to check wheter the recipe has a large,
        //medium or small image. Then it saves the recipe id and the
        //URL of the image in the variable idAndImage, which is pushed
        //to the images array
        if (response.images[0].hostedLargeUrl != null){
          var idAndImage = {id: recipeId, url: response.images[0].hostedLargeUrl};
          this.images.push(idAndImage);
          image = true;
        } else if ((response.images[0].hostedMediumUrl != null) && (image == false)){
          var idAndImage = {id: recipeId, url: response.images[0].hostedMediumUrl};
          this.images.push(idAndImage);
          image = true;
        } else if ((response.images[0].hostedSmallUrl != null) && (image == false)){
          var idAndImage = {id: recipeId, url: response.images[0].hostedSmallUrl};
          this.images.push(idAndImage);
          image = true;
        }
      }, null, () => console.log("getImage Completed"))

    }

    //Function that receives an item that was clicked on the view
    //and pushes the Details Page to the navigation stack and passes
    //the item to it, so the page can use it
    itemSelected(item){
      this.navCtrl.push(DetailsPage, {
        item: item
      });
    }

    //Function to share a recipe through available social networks and
    //messaging services of the phone
    share(item){
      let url = '';
      this.recipeService.getRecipe(item.id).subscribe(response =>{
        url = response.attribution.url;
        this.socialSharing.share('Check out this amazing recipe!', 'Yummly Recipe', null, url).then(() => {
          //The sharing was successful
          console.log("Recipe shared");
        }).catch(() => {
          //An error occurred
          console.log("Error sharing");
        });
      }, null, () => console.log("Recipe was shared"));
    }

    //Function that stores a favourite recipe on the phone,
    //using a storage plugin
    storeFav(item){
      this.storage.ready().then(() => {
        this.storage.get(item.id).then((val) => {
          if (val == null){
            this.storage.set(item.id, item);
          }
        })
      });
    }

    //Function that receives a URL and uses the plugin inAppBrowser
    //to open it inside the app
    launch(url) {
      this.inAppBrowser.create(url);
    }

  }
