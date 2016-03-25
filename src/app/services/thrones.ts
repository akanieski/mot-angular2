import {Injectable} from "angular2/core";
import {Throne} from "../models/throne";
import {Category} from "../models/category";
import {Http} from 'angular2/http';
import 'rxjs/Rx';

@Injectable()
export class ThroneService {
    
    constructor(private http:Http) {
    }

    getThrones(latitude:number, longitude:number):any {
        
        return this.http
            .get(`https://mot-server.azurewebsites.net/api/thrones/${latitude}/${longitude}`)
            .map(response => response.json())
            .map(respone => {
                let result:Array<Throne> = [];
                if (respone) {
                    respone.data.forEach((t) => {
                        result.push(Throne.fromJson(t));
                    });
                }
                return result;
            });
    }


}