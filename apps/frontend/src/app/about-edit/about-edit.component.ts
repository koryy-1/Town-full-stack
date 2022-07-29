import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AboutInfo } from '../models/about-model';

@Component({
  selector: 'app-about-edit',
  templateUrl: './about-edit.component.html',
  styleUrls: ['./about-edit.component.css']
})
export class AboutEditComponent implements OnInit {
  aboutInfoFromLS: AboutInfo = {
    shortInfo: null,
    currentPlaceOfStudy: null,
    pastPlaceOfStudy: null,
    currentPlaceOfWork: null,
    mainActivity: null,
    favoriteThings: null
  }
  aboutInfo: AboutInfo = {
    shortInfo: null,
    currentPlaceOfStudy: null,
    pastPlaceOfStudy: null,
    currentPlaceOfWork: null,
    mainActivity: null,
    favoriteThings: null
  }

  constructor(private router: Router) { }


  ngOnInit(): void {
    this.aboutInfoFromLS = JSON.parse(localStorage.getItem('aboutInfo') as string)

    this.aboutInfo.shortInfo = this.aboutInfoFromLS?.shortInfo || 'Меня зовут Илья, 21 y.o., родился в Славгороде, собственно, сайт этому городу и посвящен.',

    this.aboutInfo.currentPlaceOfStudy = this.aboutInfoFromLS?.currentPlaceOfStudy || 'Учусь в СибГУТИ, на факультете АЭС по специальности информационная безопасность телекоммуникационных систем.',

    this.aboutInfo.pastPlaceOfStudy = this.aboutInfoFromLS?.pastPlaceOfStudy || 'Окончил ВСШ №35.',

    this.aboutInfo.currentPlaceOfWork = this.aboutInfoFromLS?.currentPlaceOfWork || 'Сейчас стажируюсь в AT Consulting Восток',

    this.aboutInfo.mainActivity = this.aboutInfoFromLS?.mainActivity || 'написание программ и автоматизация различного рода рутинных задач.',

    this.aboutInfo.favoriteThings = this.aboutInfoFromLS?.favoriteThings || `мне нравится собирать компы.
    а еще мне нравится пицца, люблю пить энергетики, офк пью их редко.
    люблю когда бабки из воздуха.`
    
    // this.aboutInfo = this.aboutInfoFromLS
  }

  saveChanges() {
    localStorage.setItem('aboutInfo', JSON.stringify(this.aboutInfo))
    this.router.navigate(['/aboutMe'])
  }
}
