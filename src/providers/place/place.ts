import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class PlaceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello PlaceProvider Provider');
  }

}
