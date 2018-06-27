import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmotionProvider } from '../../providers/emotion/emotion'

/**
 * Generated class for the EmotionthrowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-emotionthrow',
  templateUrl: 'emotionthrow.html',
})
export class EmotionthrowPage {
	emotionForm: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
  	public emotion: EmotionProvider) {
  	this.emotionForm = formBuilder.group({
      emotion: ['', Validators.required]
    });
  }

  throwemotion() {
  	if (this.emotionForm.valid) {
  		console.log(this.emotionForm.value.emotion.length);
  		this.emotion.updateEmotion(this.emotion.length + this.emotionForm.value.emotion.length).then(() => {
  			this.navCtrl.pop();
  		});
  	}
  }

}
