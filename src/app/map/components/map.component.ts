import {
    EventEmitter, 
    Injectable, 
    Component,
    ElementRef,
    AfterContentInit
} from "angular2/core";
import {Input} from "angular2/core";
import {Output} from "angular2/core";
import 'rxjs/Rx';
import { CORE_DIRECTIVES } from 'angular2/common';

import {Throne} from "../../models/throne";
import {Category} from "../../models/category";
import {ThroneService} from "../../services/thrones";

import {Http, HTTP_PROVIDERS} from 'angular2/http';

declare var $:any;
declare var Microsoft:any;
const BING_KEY:string = 'AiLwEvS31SX94_lNrXV7xsRkiwHLeZNaVSawToRPJ-VolDj46zRLN-Meinej-peV';

@Component({
    selector: 'task',
    templateUrl: './app/map/components/map.html',
    providers: [CORE_DIRECTIVES, HTTP_PROVIDERS, ThroneService]
})
export class MapComponent implements AfterContentInit {
    private thrones: Array<Throne>;
    private map:any;
    private mapLoading:boolean;
    private currentThrone:Throne;
    
    constructor(private throneSvc:ThroneService, private element:ElementRef) {
        this.thrones = [];
        this.throneSvc = throneSvc;
    }
    
    buildMap(latitude:number, longitude:number) {
        let self = this;
        this.mapLoading = true;
        return new Promise((resolve, reject) => {
            if (this.map.getZoom() >= 15) {
                this.throneSvc
                    .getThrones(latitude, longitude)
                    .subscribe(data => {
                        this.thrones = data;
                        this.map.entities.clear(); 
                        let bounds = this.map.getBounds(); 
                        let latDiff = bounds.height / 2;
                        let lonDiff = bounds.width / 2; 
                        this.thrones.forEach((throne) => {
                            let pin = new Microsoft.Maps.Pushpin(
                                new Microsoft.Maps.Location(
                                    throne.Latitude, 
                                    throne.Longitude), 
                                {
                                    icon: (self.currentThrone && self.currentThrone.Id === throne.Id ? 
                                        "images/pin-red.png" : "images/pin-default.png")
                                });
                            pin.__data = throne;
                            throne.__pin = pin;
                            Microsoft.Maps.Events.addHandler(pin, 'click', (evt) => {
                                self.currentThrone = evt.target.__data;
                                self.map.setView({
                                    center: new Microsoft.Maps.Location(
                                        self.currentThrone.Latitude, 
                                        self.currentThrone.Longitude)
                                });
                                evt.target.setOptions({
                                    icon: "images/pin-red.png",
                                });
                            });
                            this.map.entities.push(pin);
                        });
                        this.mapLoading = false;
                    });
                
            } else {
                this.mapLoading = false;
                resolve();
            }
        });
    }
    
    center() {
        return new Promise((resolve, reject) => {
            let geoLocationProvider = new Microsoft.Maps.GeoLocationProvider(this.map);  
            geoLocationProvider.getCurrentPosition({
                showAccuracyCircle: false,
                successCallback: (evt) => {
                    resolve(evt.center);
                },
                errorCallback: (evt) => {
                    reject(evt);
                }
            }); 
        });
    }
    
    ngAfterContentInit() {
        this.map = new Microsoft.Maps.Map(
            $('.map', this.element.nativeElement)[0], 
            {
                credentials: BING_KEY,
                enableClickableLogo: false,
                enableSearchLogo: false,
                showCopyright: false,
                showDashboard: false,
                showMapTypeSelector: true,
                showScalebar: false
            });
        Microsoft.Maps.Events.addHandler(this.map, 'viewchangeend', () => {
            let center = this.map.getCenter();
            this.buildMap(center.latitude, center.longitude);
        });
        this.center().then((center:any) => {
            
        });
    }
}
