import { FormControl } from '@angular/forms';

export class PasswordValidator {

  static isValid(control: FormControl){
  	const re = /\d/.test(control.value) && /[a-zA-Z]/.test(control.value);

    if (re){
      return null;
    }

    return {
      "invalidPassword": true
    };
  }

}
