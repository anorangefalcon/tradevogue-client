import { AbstractControl } from "@angular/forms";
import { type } from "jquery";

export function imageSizeValidator(control: AbstractControl): {[key: string]: any} | null {
    let imageList = control.value;

    let files = imageList.filter((image: any)=>{
        return image.size > 5242880; //5MB
    });

    if(files.length != 0) return { "exceedSize": true, "errorFiles": files}

    return null;
}

export function invalidformat(control: AbstractControl): {[key: string]: any} | null{
    let field = control.value;

    if(/[0-9]/.test(field)){
        return { "invalidName": true }
    }
    return null;
}

