import { Component } from '@angular/core';
import { AuthenticationService } from 'src/authenticaion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public auth: AuthenticationService) { }
}
