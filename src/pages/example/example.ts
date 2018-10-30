import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ExamplePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-example',
  templateUrl: 'example.html',
})
export class ExamplePage {
  searchQuery: string = '';
  items: string[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  
}
