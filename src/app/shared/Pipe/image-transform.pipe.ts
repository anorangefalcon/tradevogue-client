import { Injectable, Pipe, PipeTransform } from '@angular/core';
import * as filestack from 'filestack-js';
import { ImageUploadService } from '../services/image-upload.service';

@Pipe({
  standalone: true,
  name: 'imageTransform'
})

export class ImageTransformPipe implements PipeTransform {

  constructor(private filestackService: ImageUploadService ){}

  transform(value: string, transformOptions: filestack.TransformOptions): string {

    if (!value.includes('https://cdn.filestackcontent.com')) {
      return value;
    }
    
    let segment = value.split('/');
    let handler = segment[segment.length - 1];
    return this.filestackService.transform(handler , transformOptions);
  }

}
