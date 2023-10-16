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



  fileupload(fileObject: any) {

    return new Promise(async (res, rej) => {
      let imgUrl: any[] = [];
      let errUrl: any[] = [];

      Array.from(fileObject).forEach(async (file: any) => {
        try {
          const uploadedFile = await this.client.upload(file.file);
          imgUrl.push({
            'image': uploadedFile.url,
            'file': file.file
          });
          if (file == fileObject[fileObject.length - 1]) res(imgUrl);

        } catch (err) {
          console.log(err);
        }
      })
    });
  }
}