export class productData {
    sku: string = '';
    name: string = '';
    price: any = undefined;
    oldPrice: any = undefined;

    image: string[] =  [];

    sizes: string[] = [];
    colors: string[] = [];
    description: string = '';
    stockQuantity: number = 0;
    orderQuantity: number[] = [];

    info: any = {
        productCode: '',
        category: '',
        subTitle: '',
        brand: '',
        weight: '',
        composition: '',
        tags: [],
    }

    available: boolean = true;
    reviews: any[] = [
        {
            username: '',
            rating: 0,
            comment: '',
            date: ''
        }
    ];

    constructor(data?: Partial<productData>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}

