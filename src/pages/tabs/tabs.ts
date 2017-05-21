import { Component } from '@angular/core';
import { SearchPage } from '../search/search';
import { FavouritesPage } from '../favourites/favourites';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = SearchPage;
  tab3Root = FavouritesPage;

  constructor() {

  }
}
