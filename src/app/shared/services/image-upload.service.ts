import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as filestack from 'filestack-js';

@Injectable({
  providedIn: 'root'
})

export class ImageUploadService {

  url = "";
  apiKey = "AjWhTOs3lSdmypsuHOHmTz";
  policy = "eyJjYWxsIjpbInJlbW92ZSJdLCJleHBpcnkiOjE3MDY2Mzk0MDB9";
  signature = "76fae110e2fde5dffeda73c606d7aabd48de8a9c7937e1a0a6641915b37c5265";

  transformOptions!: filestack.TransformOptions;
  fileSecurity!: filestack.Security;

  client = filestack.init(this.apiKey);

  constructor(private http: HttpClient, ) { }



  fileupload(fileObject: any) {

    return new Promise(async (res, rej) => {

      let imgUrl: any[] = [];
      // let x = Array.from(fileObject);

      await Promise.all(fileObject.map(async (file: any) => {
          if (file.file) {
            const uploadedFile = await this.client.upload(file.file);
            imgUrl.push(uploadedFile.url);
          } else {
            imgUrl.push(file);
          }
          return file;
      }));

      res(imgUrl)
    });
  }

  delete(imageUrl: any): Promise<any> {
    let segment = imageUrl.split('/');
    let uid = segment[segment.length - 1];

    this.fileSecurity = {
      policy: this.policy,
      signature:  this.signature
    }
    return this.client.remove(uid, this.fileSecurity);
  }

  // preview(url: string){
  //   let segment = url.split('/');
  //   let uid = segment[segment.length - 1];

  //   this.transformOptions = {
  //     resize: {
  //       // width: 1200,
  //       height: 1000
  //     },
  //     pjpg: {
  //       quality: 60,
  //       metadata: true,
  //     }

  //   };

  //   return this.client.transform(url, this.transformOptions, true);
  // }

  transform( url: string | string[], options: filestack.TransformOptions, b64?: boolean ): string {
    return this.client.transform(url, options, b64);
  }
}