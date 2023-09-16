import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DemoService {

  constructor() { }




  // ItemFinder(el:any,key:any,a:any){

  //   console.log("inside controll ",el, " key is ",key, " a is ",a);

  //   if(!el[key]){
  //     el=el.info;
  //   }

  //   // console.log('el is ',el);
    
  //   if(Array.isArray(el[key])){
          
  //     if(el[key].includes(a[key])){
  //        return el;
  //     }
      
  //   }
  //   else{
  //     // console.log("inside controll ",el, " a keu is ",a[key]);
  //     // return el[key]==a[key]
  //     if(el[key]==a[key]){
  //       return el;
  //     }


  //   }
  // }


  // ItemChecker(result:any,OriginalArray:any,key:any){
  //     result.array.forEach((el:any)=>{
  //         this.ItemChecker(el,key,a)
  //     });

  // }

//   filterFunction(filterApplied:any,OriginalArray:any,result:any){
//     // console.log('hello ', (filterApplied));
    
//  let x=Object.keys(filterApplied).map((el)=>{
//       // console.log('el is ',el);
      
//   if(Array.isArray(filterApplied[el])){
//     return filterApplied[el].map((v:any)=>{
//       return ({[el]:v})
//  })
//   }


//   else{

//     return ({[el]:filterApplied[el]})
    
//   }

//    })




//    x=x.flat();
//   //  let result:any=[];

   
//    let key=Object.keys(x[0])[0];
//   //  console.log('key is ',key);
   
//   //  console.log("X is ",x," orgianla rray ",OriginalArray);
//    let yy=x.forEach((a:any)=>{
   
//     if(key==Object.keys(a)[0]){


//         // console.log('result before is ',result," ---------------------------------------------- " );
       


//       result.map((element:any)=>{
//         // console.log('hello ');
        
       
        
        
//         let ab=this.ItemFinder(element,key,a);
//         console.log('el  is ',element,'AB IS s ',ab, ' key is ',a[key]);

//         if(ab==undefined){
//           console.log('inserted value');
//           alert('inserted value')
//           result.push(
//             OriginalArray.filter((el:any)=>{
//              return  this.ItemFinder(el,Object.keys(a)[0],a)
    
//           }))
//         }
        
//       });
      
//       console.log('result length is ',result.length);
      
//       if(result.length==0){
//         console.log('inserted 0');
//         // console.log();
//         alert('inserted again ')
//         result.push(
//           OriginalArray.filter((el:any)=>{
//            return  this.ItemFinder(el,Object.keys(a)[0],a)
  
//         }))
//       }
     
//       result=result.flat();

//       // console.log('result is ',result," ---------------------------------------------- " );
//     }

  
    


//     //  IF AND CONDTION 
//     else{
      
      
//       OriginalArray=result.flat();
//       // console.log('Origainl array inside AND CONDITON ',OriginalArray);
      
//       // console.log('AND CONDITION OCCURS-----------------------------------------');
      
//       result=(OriginalArray.filter((el:any)=>{
//         // console.log('el is ',el," key is ",Object.keys(a)[0])
//         return  this.ItemFinder(el,Object.keys(a)[0],a)
       
//       }))
//     }
//     key=Object.keys(a)[0];
//    })


//    console.log('Yy is ',result);
   

//   }  






  FilterFunction2(filterApplied:any,originalData:any){
    // console.log(filterApplied, " is ");
    originalData.forEach((el:any)=>{
      console.log('el ios ',el);
      // el.includes()
      Object.keys(filterApplied).forEach((filter)=>{
        console.log('filter i ',filter);

        //  DIRECT FILTER
        if(el[filter]){
          console.log('el[filter] ',el[filter]);
          
        if(  el[filter].includes(filterApplied[filter])){
            console.log('filter exist');
            
          }
        }

        // INSIDE INFO
        else{

        }

      })
      
    })
    
  }



  

}
