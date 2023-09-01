import { AbstractControl } from "@angular/forms";

export function imagesValidation(control: AbstractControl): {[key: string]: any} | null{
    let images = control.value;
    
    for(let i=0;i<images.length;i++){
        let [_, ext] = images[i].split('.');

        if(ext === 'jpg' || ext === 'jpeg' || ext === 'png'){
            continue;
        }else{
            return { "invalidExtension": true }
        }
    }

    return null;
}

export function imagesCount(control: AbstractControl): {[key: string]: any} | null{
    let images = control.value;

    if(images.length > 6){
        return { "exceedCount": true }
    }

    return null;
}

export function invalidformat(control: AbstractControl): {[key: string]: any} | null{
    let field = control.value;

    if(/[0-9]/.test(field)){
        return { "invalidName": true }
    }
    return null;
}

