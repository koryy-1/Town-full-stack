import { Component, OnInit } from '@angular/core';
import { AboutInfo } from '../models/about-model';

@Component({
  selector: 'about-app',
  templateUrl: './about.component.html',
//   styleUrls: ['./about.component.css']
})
export class AboutComponent {
  // title = 'about';

  aboutInfo: AboutInfo | null = JSON.parse(localStorage.getItem('aboutInfo') as string)


}
