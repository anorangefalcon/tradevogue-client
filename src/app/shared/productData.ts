export class productData {
    sku: string = '';
    name: string = '';
    price: number = 0;
    oldPrice: number = 0;
    image: string = '';
    sizes: string[] = [];
    colors: string[] = [];
    description: string = '';
    stockQuantity: number = 0;

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

