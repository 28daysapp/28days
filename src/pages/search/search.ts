import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  constructor(public navCtrl: NavController) {
    this.generateTopics();
  }

  topics: string[];

  generateTopics() {
    this.topics = [
      "Topic 1",
      "Topic 2",
      "Topic 3",
      "Map1",
      "Hospital",
      "Doctor"
    ];
  }

  getTopics(ev: any) {
    this.generateTopics();
    let serVal = ev.target.value;
    if(serVal && serVal.trim() != '') {
      this.topics = this.topics.filter((topic) => {
        return (topic.toLowerCase().indexOf(serVal.toLowerCase()) > -1);
      })
    }
  }

}
