import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as filestack from 'filestack-js';


@Injectable({
  providedIn: 'root'
})

export class ImageUploadService {

  url = "";
  apiKey = "ARgE3F7qBQjeuAxvR8qLfz";
  client = filestack.init(this.apiKey);

  constructor(private http: HttpClient) { }



  fileupload(productName: string, file: any) {
    console.log("Inside Service", file);

    // return new Promise(async (resolve, reject)=>{
    //   console.log("Inside Promise");
    //   await this.client.upload(file).then((response) => {
    //     console.log("respons is ",response);
        
    //     resolve(response.url);
    //   }).catch((error) => {
    //     reject({"Error" : file.name});
    //   })
    // });

    Array.from(file).forEach((file:any)=>{
      this.client.upload(file).then((response) => {
        console.log(response);
      }).catch((error) => {
        console.log(error);
      })

    }); 
  }
}