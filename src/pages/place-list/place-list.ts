import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  NavController,
  NavParams,
  IonicPage,
  AlertController,
  LoadingController
} from "ionic-angular";

import firebase from "firebase";

import { GoogleProvider } from "../../providers/google/google";
import { PlaceProvider } from "../../providers/place/place";

@IonicPage()
@Component({
  selector: "page-place-list",
  templateUrl: "place-list.html"
})
export class PlaceListPage {
  @ViewChild("map") mapElement: ElementRef;

  map: any;
  latLng: any;

  placeType: String = "center";
  searchQuery: string;
  premiumPlaces: any = [];
  places: any = [];

  adExists: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public googleProvider: GoogleProvider,
    public placeProvider: PlaceProvider
  ) {}

  ionViewWillEnter() {
    console.log("ionViewDidLoad PlaceListPage");

    this.googleProvider.loadMap(this.map, this.mapElement).then(result => {
      console.log(result);
      this.map = result;

      this.searchByText("서울");
    });

    // --------- Getting Premium Place DB ------------

    this.getPlaceList(this.placeType);
  }

  searchByText(userInput) {
    this.googleProvider
      .searchByText(userInput, this.placeType, this.latLng, this.map)
      .then(results => {
        this.places = results;
      });
  }

  countReviews(placeId, i) {
    firebase
      .database()
      .ref("/placeInfo/" + placeId)
      .once("value")
      .then(snapshot => {
        if (snapshot.val() === null) {
          return;
        }
        this.places[i].reviewCount = snapshot.val().reviewCount;
        this.places[i].ratings = snapshot.val().ratings;
      });
  }

  placeDetail(place) {
    this.navCtrl.push("PlaceDetailPage", { place: place });
  }

  showExplanation() {
    let alert = this.alertCtrl.create({
      title: "정신병원과 상담센터?",
      message: `
      <p><strong>정신과</strong>: 약물 치료가 병행될 수 있고 보험 처리가 되어서 상담센터보다 조금 더 저렴한 편이야.</p>

      <p><strong>상담센터</strong>: 상담자와의 대화를 통해 자신을 좀 더 깊게 이해하고 건강한 마음을 회복할 수 있도록 돕는 곳이야.</p>
      `,
      buttons: ["알겠어!"]
    });
    alert.present();
  }

  sort() {
    let alert = this.alertCtrl.create({
      title: "정렬 순서",
      buttons: [{ text: "후기 많은 순" }, { text: "별점 높은 순" }]
    });
    alert.present();
  }

  presentLoading() {
    const loading = this.loadingCtrl.create();
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 300);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  /* ------ Functions for Calling Premium Place DB ------ */

  async getPlaceList(reference) {
    try {
      const placeList = await this.placeProvider.readPlaceList(reference);
      this.premiumPlaces = await this.handlePlaceReviews(placeList);
      console.log("What am i getting here?: ", this.premiumPlaces);
    } catch (e) {
      console.log(e);
    }
  }
  async handlePlaceReviews(placeList) {
    const updatedPlaceList = placeList.map(async place => {
      const placeReview = await this.placeProvider.readPlaceReviews(
        place.placeId
      );
      if (!placeReview) {
        return place;
      }
      return {
        ...place,
        ...placeReview
      };
    });
    return await Promise.all(updatedPlaceList);
  }
}
