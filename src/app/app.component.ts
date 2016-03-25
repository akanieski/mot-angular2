import {Component, OnInit} from "angular2/core";
import {RouteConfig, RouterLink, ROUTER_DIRECTIVES} from "angular2/router";

import {TaskListComponent} from "./todo/components/task-list.component";
import {MapComponent} from "./map/components/map.component";
import {AboutComponent} from "./about/components/about.components";

@Component({
    selector: "app",
    templateUrl: "./app/app.html",
    directives: [TaskListComponent, MapComponent, AboutComponent, RouterLink, ROUTER_DIRECTIVES],
    providers: []
})
@RouteConfig([
    {path: '/', component: MapComponent, as: "Map"},
    {path: '/tasks', component: TaskListComponent, as: 'TaskList'},
    {path: '/map', component: MapComponent, as: 'Map'},
    {path: '/about', component: AboutComponent, as: 'About'}
])
export class AppComponent implements OnInit {
    ngOnInit() {
        console.log("Application component initialized ...");
    }
}