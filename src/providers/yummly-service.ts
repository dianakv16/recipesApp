// Application developed by Diana Vainberg (dkv3@kent.ac.uk)

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class YummlyService {
  searchUrl: String;
  getUrl: String;
  apiId: String;
  apiKey: String;
  searchParam: String;


  constructor(public http: Http) {
    this.searchUrl = 'http://api.yummly.com/v1/api/recipes?_'
    this.getUrl = 'http://api.yummly.com/v1/api/recipe/'
    this.apiId = 'Use your api Id';
    this.apiKey = 'User your api key';
  }

  //Function that gets recent recipes from Yummly's API that have
  //a picture
  getRecipes() {
    return this.http.get(this.searchUrl + 'app_id=' + this.apiId +
    '&_app_key=' + this.apiKey + "&requirePictures=true")
    .map(res => res.json());
  }

  //Function that gets recipes from Yummly's API that have the
  //word(s) in 'value' in any of their fields, such as title,
  //author, ingredient list, among others, and have a picture
  getRecipesByValue(value) {
    return this.http.get(this.searchUrl + 'app_id=' + this.apiId +
    '&_app_key=' + this.apiKey + "&requirePictures=true&q=" + value)
    .map(res => res.json());
  }

  //Function that gets a recipe from Yummly's API by its ID
  getRecipe(id) {
    return this.http.get(this.getUrl + id + '?_app_id=' + this.apiId +
    '&_app_key=' + this.apiKey)
    .map(res => res.json());
  }

}
