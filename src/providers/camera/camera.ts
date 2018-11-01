import { Injectable } from '@angular/core';
import { Crop } from '@ionic-native/crop';
import { Camera, CameraOptions } from '@ionic-native/camera';

/*
  Generated class for the CameraProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CameraProvider {

  constructor(private camera: Camera, private crop: Crop) {
    console.log('Hello CameraProvider Provider');
  }

  openGallery() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imagePath) => {
      const fileURL = 'data:image/jpeg;base64,' + imagePath;
      const dataURL = imagePath;
    }, (err) => {
      // Handle error
      console.log('openGallery error : ' + err.toString());
    });

    // this.updateProfilePicture();
  }

}
