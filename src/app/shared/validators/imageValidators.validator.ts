import { AbstractControl } from "@angular/forms";

export function imageSizeValidator(control: AbstractControl): {[key: string]: any} | null {
    let imageList = control.value;

    if(imageList.length !=0 ){
        let files = imageList.filter((image: any)=>{
            return image.file.size > 2097152; //2MB
        });
        if (files.length != 0) return { "exceedSize": true, "errorFiles": files}
    } 

    return null;
}

export function invalidformat(control: AbstractControl): {[key: string]: any} | null{
    let field = control.value;

    if(/[0-9]/.test(field) || /[!@#$%^&*(),.?":{}|<>]/.test(field)){
        return { "invalidformat": true }
    }
    return null;
}

