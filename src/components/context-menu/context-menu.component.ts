import { Component, OnInit, Input, ElementRef, HostListener } from '@angular/core';

import { UserService } from '../../app/views/user/services/user.service';
import { UserComponent } from '../../app/views/user/user.component';
import { ProductComponent } from 'src/app/views/products/product.component';


import Swal from 'sweetalert2';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {

  @Input() contextMenuEvent:any;
  @Input() contextMenuSelector:any;
  @Input() contextMenuItems:any;
  @Input() service:any;
  @Input() component:any;

  isDisplayContextMenu: boolean = false;
  _currentMenuVisible = null;

  constructor(private elementRef: ElementRef) {
    this.isDisplayContextMenu = false;
  }


  ngOnInit() {
    this.initContextMenu();
  }


  initContextMenu() {
    //console.log(this.contextMenuSelector);
    //console.log(this.contextMenuEvent);
    if (this.contextMenuSelector && this.contextMenuEvent) {
      this.contextMenuEvent.preventDefault();
      this.contextMenuEvent.stopPropagation();
      this.createContextMenu(this.contextMenuEvent.clientX, this.contextMenuEvent.clientY);
      this.contextMenuSelector.addEventListener('click', (e:any) => {
        this.closeCurrentlyOpenedMenu();
      });
    }
  }


  createContextMenu(x:any, y:any) {
    this.closeCurrentlyOpenedMenu();
    this.isDisplayContextMenu = true;
    if (this.isDisplayContextMenu && this.elementRef.nativeElement) {
      //console.log(this.elementRef.nativeElement);
      const contextMenuDiv = this.elementRef.nativeElement.querySelector('.contextMenu');
      //console.log(contextMenuDiv);
      if (contextMenuDiv) {
        this._currentMenuVisible = contextMenuDiv;
        contextMenuDiv.style.left = x + "px";
        contextMenuDiv.style.top = y + "px";
      }
    }
  }


  closeContextMenu(menu:any) {
    //console.log(menu);
    menu.style.left='0px';
    menu.style.top='0px';
    this._currentMenuVisible = null;
  }


  closeCurrentlyOpenedMenu() {
    //console.log(this._currentMenuVisible);
      if (this._currentMenuVisible !== null) {
          this.closeContextMenu(this._currentMenuVisible);
      }
  }


  /* close context menu on left click */
  @HostListener('document:click')
  documentClick(): void {
    this.isDisplayContextMenu = false;
  }


  /* close context menu on "ESC" key keypress */
  @HostListener('window:onkeyup')
  escKeyClick(): void {
    this.isDisplayContextMenu = false;
  }
  
  edit(id:any){
    if(this.contextMenuItems[0].modalDevolucion){
      this.component.modal = "modalDevolucion";
    }
    this.component.openModal(id);
  }

  delete(id:any){ 
    
    if(this.contextMenuItems[1].modalSalida){
      this.component.modal = "modalSalida";
      this.component.openModal(id);
    }
    
  }

}
