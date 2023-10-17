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
  policy = "eyJleHBpcnkiOjE3MjIzNjc4MDAsImNhbGwiOlsiY29udmVydCIsInJlbW92ZSJdfQ==";
  signature = "89ee78e81fbecd371307f893768d12d46f89c3806bd25d6a76ccf67d31f2deab";

  client = filestack.init(this.apiKey);

  constructor(private http: HttpClient) { }



  fileupload(fileObject: any) {

    return new Promise(async (res, rej) => {
      let imgUrl: any[] = [];
      let errUrl: any[] = [];

      Array.from(fileObject).forEach(async (file: any) => {
        try {
          if (file.file) {
            const uploadedFile = await this.client.upload(file.file);
            imgUrl.push(uploadedFile.url);
          } else {
            imgUrl.push(file);
          }
          if (file == fileObject[fileObject.length - 1]) res(imgUrl);

        } catch (err) {
          console.log(err);
        }
      })
    });
  }

  delete(imageUrl: any): Observable<any> {
    let segment = imageUrl.split('/');
    let uid = segment[segment.length - 1];
    let url = `https://www.filestackapi.com/api/file/${uid}?key=${this.apiKey}&policy=${this.policy}&signature=${this.signature}`;
    return this.http.delete(url);
  }
}