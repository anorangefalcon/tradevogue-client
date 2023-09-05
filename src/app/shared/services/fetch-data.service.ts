import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FetchDataService {
  url = '../../../assets/tempDB/products.json';
  userUrl='../../../assets/tempDB/usersData.json';
  sellerUrl='../../../assets/tempDB/seller.json';
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(this.url);
  }

  getUserData():Observable<any>{
    // let x;
    //  const x=this.http.get(this.userUrl).toPromise();

     return this.http.get(this.userUrl);
  }

  getSellerData():Observable<any>{
    return this.http.get(this.sellerUrl);
  }

  //  CHANGE FILTER DATA

  rating: any[] = [1, 2, 3, 4, 5];
  stockStatus: any[] = ['Delivered', 'Pending'];
  options: any[] = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
  ratings: any[] = [5, 4, 3, 2];

  items: any[] = [
    {
        "sku": "SKU123",
        "name": "Pikachu Oversized Jersey",
        "price": 1190,
        "oldPrice": 1999,
        "image": [
            "https://assets.bonkerscorner.com/uploads/2023/05/03103121/Pikachu-25-oversized-jersey-4.jpg",
            "https://assets.bonkerscorner.com/uploads/2023/05/03103143/Pikachu-25-oversized-jersey-6.jpg",
            "https://assets.bonkerscorner.com/uploads/2023/05/03103147/Pikachu-25-oversized-jersey-5.jpg"
        ],
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            "#85f5f5",
            "Yellow"
        ],
        "description": "A comfortable oversized jersey featuring Pikachu design.",
        "stockQuantity": 100,
        "orderQuantity": [
            10,
            20,
            15,
            25
        ],
        "info": {
            "productCode": "PC123",
            "category": "Oversized T-shirt",
            "subTitle": "Pokemon Collection",
            "brand": "Bonkers Corner",
            "weight": "200g",
            "composition": "Cotton",
            "tags": [
                "pokemon",
                "jersey",
                "oversized"
            ]
        },
        "available": true,
        "reviews": [
            {
                "username": "AshKetchum",
                "rating": 3,
                "comment": "Awesome jersey, love it!",
                "date": "2023-08-21"
            },
            {
                "username": "MistyWaterflower",
                "rating": 2,
                "comment": "Nice design and good quality.",
                "date": "2023-08-20"
            }
        ]
    },
    {
        "sku": "SKU38P2",
        "name": "Black Jumper",
        "price": 29.99,
        "oldPrice": 39.99,
        "image": [
            "https://assets.bonkerscorner.com/uploads/2023/04/12151054/1.jpg",
            "https://assets.bonkerscorner.com/uploads/2023/04/12151049/15.jpg",
            "https://assets.bonkerscorner.com/uploads/2023/04/12151041/11.jpg",
            "https://assets.bonkerscorner.com/uploads/2023/04/12151051/2.jpg",
            "https://assets.bonkerscorner.com/uploads/2023/04/12151054/1.jpg",
            "https://assets.bonkerscorner.com/uploads/2023/04/12151049/15.jpg",
            "https://assets.bonkerscorner.com/uploads/2023/04/12151041/11.jpg",
            "https://assets.bonkerscorner.com/uploads/2023/04/12151051/2.jpg"
        ],
        "sizes": [
            "XS",
            "S",
            "M",
            "L"
        ],
        "colors": [
            "Blue",
            "Black",
            "Green"
        ],
        "description": "Stylish patterned canvas sneakers for everyday wear.",
        "stockQuantity": 100,
        "orderQuantity": [
            10,
            15,
            20,
            25,
            30
        ],
        "info": {
            "productCode": "PC123",
            "category": "Jumper",
            "subTitle": "Casual Collection",
            "brand": "Bonkers Corner",
            "weight": "350g",
            "composition": "Canvas",
            "tags": [
                "sneakers",
                "canvas",
                "patterned"
            ]
        },
        "available": true,
        "reviews": [
            {
                "username": "SneakerLover",
                "rating": 4,
                "comment": "This t-shirt is an absolute gem. The fabric is incredibly soft, providing unmatched comfort throughout the day. Its impeccable stitching and ideal fit showcase top-notch craftsmanship. What's more, it's remarkably durable even after several washes. From casual to slightly dressier looks, this t-shirt effortlessly adapts. A must-have wardrobe essential!",
                "date": "2023-08-25"
            },
            {
                "username": "FashionEnthusiast",
                "rating": 5,
                "comment": "These sneakers stand out, love them!",
                "date": "2023-08-24"
            }
        ]
    },
    {
        "sku": "SKU456",
        "name": "Sage Inside Out Oversized T-shirt",
        "price": 19.99,
        "oldPrice": 24.99,
        "image": [
            "https://assets.bonkerscorner.com/uploads/2021/10/08104324/Bonkerscorner_sage_inside_out_oversized_tshirt_02.jpg",
            "https://assets.bonkerscorner.com/uploads/2021/10/08104255/Bonkerscorner_sage_inside_out_oversized_tshirt_06.jpg",
            "https://assets.bonkerscorner.com/uploads/2021/10/08104301/Bonkerscorner_sage_inside_out_oversized_tshirt_05.jpg",
            "https://assets.bonkerscorner.com/uploads/2021/10/08104307/Bonkerscorner_sage_inside_out_oversized_tshirt_04.jpg"
        ],
        "sizes": [
            "XS",
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            "Green"
        ],
        "description": "An inside-out styled oversized t-shirt with a unique sage design.",
        "stockQuantity": 75,
        "orderQuantity": [
            5,
            15,
            10,
            20,
            25
        ],
        "info": {
            "productCode": "PC456",
            "category": "Oversized T-shirt",
            "subTitle": "Urban Collection",
            "brand": "Bonkers Corner",
            "weight": "180g",
            "composition": "Cotton Blend",
            "tags": [
                "t-shirt",
                "oversized",
                "urban"
            ]
        },
        "available": true,
        "reviews": [
            {
                "username": "FashionFanatic",
                "rating": 4,
                "comment": "Love the unique style of this shirt!",
                "date": "2023-08-19"
            },
            {
                "username": "Trendsetter123",
                "rating": 5,
                "comment": "Great fit and comfortable to wear.",
                "date": "2023-08-18"
            }
        ]
    },
    {
        "sku": "SKU789",
        "name": "Stylish Denim Jacket",
        "price": 59.99,
        "oldPrice": 79.99,
        "image": [
            "https://assets.bonkerscorner.com/uploads/2023/09/14115855/20230714_062216152_iOS.jpg",
            "https://assets.bonkerscorner.com/uploads/2023/09/14115904/20230714_062212533_iOS.jpg",
            "https://assets.bonkerscorner.com/uploads/2023/09/14115858/20230714_062204643_iOS.jpg"
        ],
        "sizes": [
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            "Blue"
        ],
        "description": "A stylish denim jacket perfect for casual wear.",
        "stockQuantity": 50,
        "orderQuantity": [
            5,
            10,
            8,
            12
        ],
        "info": {
            "productCode": "PC789",
            "category": "Lower",
            "subTitle": "Denim Collection",
            "brand": "Bonkers Corner",
            "weight": "600g",
            "composition": "Denim",
            "tags": [
                "jacket",
                "denim",
                "stylish"
            ]
        },
        "available": true,
        "reviews": [
            {
                "username": "Fashionista101",
                "rating": 5,
                "comment": "This jacket is a must-have for denim lovers!",
                "date": "2023-08-17"
            },
            {
                "username": "DenimQueen",
                "rating": 4,
                "comment": "Love the fit and quality of the denim.",
                "date": "2023-08-16"
            }
        ]
    },
    {
        "sku": "SKU987",
        "name": "Grey Jordan Pants",
        "price": 44.99,
        "oldPrice": 0,
        "image": [
            "https://assets.bonkerscorner.com/uploads/2023/09/28130623/Bonkerscorner_Grey-jordan-pants_06.jpg",
            "https://assets.bonkerscorner.com/uploads/2023/09/28130637/Bonkerscorner_Grey-jordan-pants_02.jpg",
            "https://assets.bonkerscorner.com/uploads/2023/09/28130630/Bonkerscorner_Grey-jordan-pants_04.jpg"
        ],
        "sizes": [
            "XS",
            "S",
            "M",
            "L"
        ],
        "colors": [
            "Grey"
        ],
        "description": "Comfortable and stylish grey pants with Jordan branding.",
        "stockQuantity": 60,
        "orderQuantity": [
            10,
            15,
            18,
            17
        ],
        "info": {
            "productCode": "PC987",
            "category": "Lower",
            "subTitle": "Athletic Collection",
            "brand": "Bonkers Corner",
            "weight": "350g",
            "composition": "Polyester Blend",
            "tags": [
                "pants",
                "athletic",
                "grey"
            ]
        },
        "available": true,
        "reviews": [
            {
                "username": "SportsEnthusiast",
                "rating": 4,
                "comment": "Perfect pants for workouts and casual wear.",
                "date": "2023-08-15"
            },
            {
                "username": "StreetStyleGuru",
                "rating": 5,
                "comment": "Loving the Jordan branding on these pants!",
                "date": "2023-08-14"
            }
        ]
    },
    {
        "sku": "SKU69",
        "name": "Casual Striped Sweater",
        "price": 39.99,
        "oldPrice": 0,
        "image": [
            "https://assets.bonkerscorner.com/uploads/2023/05/30122658/20230530_063010448_iOS.jpg",
            "https://assets.bonkerscorner.com/uploads/2023/05/30122646/20230530_062955872_iOS.jpg",
            "https://assets.bonkerscorner.com/uploads/2023/05/30122655/20230530_063007040_iOS.jpg"
        ],
        "sizes": [
            "XS",
            "S",
            "M"
        ],
        "colors": [
            "Navy Blue",
            "White"
        ],
        "description": "Stay cozy and stylish with this casual striped sweater.",
        "stockQuantity": 65,
        "orderQuantity": [
            5,
            10,
            8
        ],
        "info": {
            "productCode": "PC789",
            "category": "Oversized T-shirt",
            "subTitle": "Casual Collection",
            "brand": "Bonkers Corner",
            "weight": "300g",
            "composition": "Acrylic Blend",
            "tags": [
                "sweater",
                "casual",
                "striped"
            ]
        },
        "available": true,
        "reviews": [
            {
                "username": "CozyChic",
                "rating": 5,
                "comment": "Love the stripes and how warm it is!",
                "date": "2023-08-11"
            },
            {
                "username": "FashionLover123",
                "rating": 4,
                "comment": "Perfect for chilly evenings, great quality.",
                "date": "2023-08-10"
            }
        ]
    },
    {
        "sku": "SKU456",
        "name": "Sage Inside Out Oversized T-shirt",
        "price": 19.99,
        "oldPrice": 24.99,
        "image": [
            "https://assets.bonkerscorner.com/uploads/2021/10/08104324/Bonkerscorner_sage_inside_out_oversized_tshirt_02.jpg",
            "https://assets.bonkerscorner.com/uploads/2021/10/08104255/Bonkerscorner_sage_inside_out_oversized_tshirt_06.jpg",
            "https://assets.bonkerscorner.com/uploads/2021/10/08104301/Bonkerscorner_sage_inside_out_oversized_tshirt_05.jpg",
            "https://assets.bonkerscorner.com/uploads/2021/10/08104307/Bonkerscorner_sage_inside_out_oversized_tshirt_04.jpg"
        ],
        "sizes": [
            "XS",
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            "Green"
        ],
        "description": "An inside-out styled oversized t-shirt with a unique sage design.",
        "stockQuantity": 75,
        "orderQuantity": [
            5,
            15,
            10,
            20,
            25
        ],
        "info": {
            "productCode": "PC456",
            "category": "Oversized T-shirt",
            "subTitle": "Urban Collection",
            "brand": "Bonkers Corner",
            "weight": "180g",
            "composition": "Cotton Blend",
            "tags": [
                "t-shirt",
                "oversized",
                "urban"
            ]
        },
        "available": true,
        "reviews": [
            {
                "username": "FashionFanatic",
                "rating": 4,
                "comment": "Love the unique style of this shirt!",
                "date": "2023-08-19"
            },
            {
                "username": "Trendsetter123",
                "rating": 5,
                "comment": "Great fit and comfortable to wear.",
                "date": "2023-08-18"
            }
        ]
    },

    {
        "sku": "SKU456",
        "name": "Sage Inside Out Oversized T-shirt",
        "price": 19.99,
        "oldPrice": 24.99,
        "image": [
            "https://assets.bonkerscorner.com/uploads/2021/10/08104324/Bonkerscorner_sage_inside_out_oversized_tshirt_02.jpg",
            "https://assets.bonkerscorner.com/uploads/2021/10/08104255/Bonkerscorner_sage_inside_out_oversized_tshirt_06.jpg",
            "https://assets.bonkerscorner.com/uploads/2021/10/08104301/Bonkerscorner_sage_inside_out_oversized_tshirt_05.jpg",
            "https://assets.bonkerscorner.com/uploads/2021/10/08104307/Bonkerscorner_sage_inside_out_oversized_tshirt_04.jpg"
        ],
        "sizes": [
            "XS",
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            "Green"
        ],
        "description": "An inside-out styled oversized t-shirt with a unique sage design.",
        "stockQuantity": 75,
        "orderQuantity": [
            5,
            15,
            10,
            20,
            25
        ],
        "info": {
            "productCode": "PC456",
            "category": "Oversized T-shirt",
            "subTitle": "Urban Collection",
            "brand": "Bonkers Corner",
            "weight": "180g",
            "composition": "Cotton Blend",
            "tags": [
                "t-shirt",
                "oversized",
                "urban"
            ]
        },
        "available": true,
        "reviews": [
            {
                "username": "FashionFanatic",
                "rating": 4,
                "comment": "Love the unique style of this shirt!",
                "date": "2023-08-19"
            },
            {
                "username": "Trendsetter123",
                "rating": 5,
                "comment": "Great fit and comfortable to wear.",
                "date": "2023-08-18"
            }
        ]
    },
    {
        "sku": "SKU456",
        "name": "Sage Inside Out Oversized T-shirt",
        "price": 19.99,
        "oldPrice": 24.99,
        "image": [
            "https://assets.bonkerscorner.com/uploads/2021/10/08104324/Bonkerscorner_sage_inside_out_oversized_tshirt_02.jpg",
            "https://assets.bonkerscorner.com/uploads/2021/10/08104255/Bonkerscorner_sage_inside_out_oversized_tshirt_06.jpg",
            "https://assets.bonkerscorner.com/uploads/2021/10/08104301/Bonkerscorner_sage_inside_out_oversized_tshirt_05.jpg",
            "https://assets.bonkerscorner.com/uploads/2021/10/08104307/Bonkerscorner_sage_inside_out_oversized_tshirt_04.jpg"
        ],
        "sizes": [
            "XS",
            "S",
            "M",
            "L",
            "XL"
        ],
        "colors": [
            "Green"
        ],
        "description": "An inside-out styled oversized t-shirt with a unique sage design.",
        "stockQuantity": 75,
        "orderQuantity": [
            5,
            15,
            10,
            20,
            25
        ],
        "info": {
            "productCode": "PC456",
            "category": "Oversized T-shirt",
            "subTitle": "Urban Collection",
            "brand": "Bonkers Corner",
            "weight": "180g",
            "composition": "Cotton Blend",
            "tags": [
                "t-shirt",
                "oversized",
                "urban"
            ]
        },
        "available": true,
        "reviews": [
            {
                "username": "FashionFanatic",
                "rating": 4,
                "comment": "Love the unique style of this shirt!",
                "date": "2023-08-19"
            },
            {
                "username": "Trendsetter123",
                "rating": 5,
                "comment": "Great fit and comfortable to wear.",
                "date": "2023-08-18"
            }
        ]
    }
]


  data = new BehaviorSubject<any>(this.items);
  // actual data lies here
  cart$ = this.data.asObservable();

  filtered_data(value: any, filtered_arr: any) {
    filtered_arr = {
      colors: ['Yellow', 'Green'],
      sizes: [
        "S"]
    };

    
const transformedArray = Object.entries(filtered_arr)



console.log(transformedArray);

let x= transformedArray.map((el)=>{
    console.log("el is ",el);
    
    if(Array.isArray(el[1])){
       
        return el[1].map((v)=>{
             return ({[el[0]]:v})
        })
    }

    else{
        return {[el[0]]:el[1]} 
    }

})

x=x.flat();
console.log("X is ",x);

let key=Object.keys(x[0])[0];
console.log("key is ",key);

let result:any=[];
const last= x.map((a:any)=>{

    //  if OR CONDITION 
  if(key==Object.keys(a)[0]){

    
    
   return result.push(this.items.filter((el:any)=>{
    //   console.log("el.key is ",el[key]);
      console.log("el coming is ",el);
      
    //    item found direct => not inside info
     if(el[key]){
      if(Array.isArray(el[key])){
        console.log("inside controll ",el, " a keu is ",a[key]);
        if(el[key].includes(a[key])){
            return el;
        }
        
      }
      else{return el[key]==a[key]}

     }
      
     // item found inside info
     else{
        // console.log("inside controll ",el, " key is ",key," a keu is ",a[key]);
        console.log("el infoe is ",el);
        
        if(el.info[key].includes(a[key])){
            return el;
        }
        
      
      else{return 0;} }

    //  key=Object.keys(a)[0];
    }) )

   
  }


//    AND CONDTION
  else{

    this.items=result.flat();
    console.log("this.item si coming is  ",this.items);
    
    return result.push(this.items.filter((el:any)=>{
        //   console.log("el.key is ",el[key]);
          
        //    item found direct => not inside info
         if(el[key]){
          if(Array.isArray(el[key])){
            console.log("inside controll ",el, " a keu is ",a[key]);
            if(el[key].includes(a[key])){
                return el;
            }
            
          }
          else{return el[key]==a[key];
          }
         }
          
         // item found inside info
         else{
           
            console.log("el infoe is ",el," info is ",el[0]["info"] , " keu is ",key);
            //  array present 
            if(el.info[key].includes(a[key])){
                return el;
            }

            // not array 
            else{return el[key]==a[key]}

         }
          
        

        key=Object.keys(a)[0];
        }) )
  }
//  return 10;

})


console.log("last  is ",result.flat());


}



}
