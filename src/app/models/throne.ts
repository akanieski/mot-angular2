import {Category} from './category';

export class Throne {
    public __pin:any;
    
    constructor(public Id:number,
                public Name:string,
                public Latitude:number,
                public Longitude:number,
                public CategoryId:number,
                public Category:Category) {
    }
    
    static fromJson(json) {
        return new Throne(json.Id, json.Name, json.Latitude, json.Longitude, json.CategoryId, json.Category);
    }
}