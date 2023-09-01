import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css']
})
export class ExcelComponent {


  data:any=[];
  message:any;
  handleFileInput(event:any){
    // messasge=
    this.message='show';
    let file=event.target.files[0];
    // console.log("file is ",file)
    let fileReader=new FileReader();
    fileReader.readAsBinaryString(file);

    
    fileReader.onload=(e)=>{
      // console.log("e is ",e);
      
      const fileContent = e?.target?.result;
      // console.log("fileContent is ",(fileContent));
      
      const workbook = XLSX.read(fileContent,{type:'binary'});

      // console.log("workbook is ",workbook);

      
      const firstSheetName = workbook.SheetNames[0];
      // console.log("firstSheet Name is ",firstSheetName);
      
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      this.message='done';
      // console.log(jsonData);
      this.data=jsonData;

    }

    // console.log("outside content");
    

  }


  error_ocured:any=0;

  error(){
    // console.log(dat);
    let given_length=5;
    console.log('data is ',this.data);
 for(let i=0;i<this.data.length;i++){
     if( Object.keys(this.data[i]).length!=given_length){
      return  this.error_ocured=this.data[i].__rowNum__;
    
     }
    }
    
  }


}
;