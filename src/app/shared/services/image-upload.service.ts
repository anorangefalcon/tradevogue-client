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
  policy = "eyJleHBpcnkiOjE3MjIzNjc4MDAsImNhbGwiOlsiY29udmVydCIsInJlbW92ZSJdfQ==";
  signature = "89ee78e81fbecd371307f893768d12d46f89c3806bd25d6a76ccf67d31f2deab";

  client = filestack.init(this.apiKey);

  constructor(private http: HttpClient) { }



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

  delete(imageUrl: any): Observable<any> {
    let segment = imageUrl.split('/');
    let uid = segment[segment.length - 1];
    let url = `https://www.filestackapi.com/api/file/${uid}?key=${this.apiKey}&policy=${this.policy}&signature=${this.signature}`;
    return this.http.delete(url);
  }
}