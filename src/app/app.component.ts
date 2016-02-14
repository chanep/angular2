import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {ClientsComponent} from './clients/clients.component'

@Component({
    selector: 'my-app',
	directives: [ROUTER_DIRECTIVES],
    template: `
    	<h1>My First Angular 2 App</h1>
    	<router-outlet></router-outlet>
    `
})
@RouteConfig([
		{ path: '/clients', component: ClientsComponent, name: 'Clients', useAsDefault: true }
	])
export class AppComponent { 
	constructor(){
	}
}