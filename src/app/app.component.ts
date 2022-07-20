import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';
import { AppService } from './app.service';
import { EventInterface } from './event.interface';

declare var onScan: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'Peslac';

  

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
    private appService:AppService
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });

    onScan.attachTo(document, {
        
      reactToPaste: true, // Compatibility to built-in scanners in paste-mode (as opposed to keyboard-mode)
          
      onScan: (sCode: any, iQty: any)=>{      
        this.appService.ejecutarEventoBusqueda(sCode);
      }
    });

  }
}
