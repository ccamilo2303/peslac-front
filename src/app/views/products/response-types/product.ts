export class Product{
    
    constructor(
        public id?:number,
        public name?:string, 
        public quantity?:number,
        public type_product?:string,
        public price?:number,
        public iva?:string,
        public supplier?:string,
        public description?:string,
        public type?:string,
        public image_url?:string,
        public state_product?:boolean,
        public inventary_min?:boolean,
        public code?:string,
        
    ){}
}