import { Component, OnInit, Input, ElementRef, HostListener } from '@angular/core';

import { ProductService } from '../../services/product.service';
import { ProductComponent } from '../../product.component';

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
  isDisplayContextMenu: boolean = false;
  _currentMenuVisible = null;


  constructor(private elementRef: ElementRef, private userService: ProductService, private userComponent: ProductComponent) {
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
  
  editUser(idUser:string){

    this.userService.getUser(idUser).subscribe( 
      {
        complete: () => {
          this.userComponent.openModal({name:"Andres"});
        },
        error: (error: Error)=>{
          /*Swal.fire({
            icon: 'error',
            title: error.message,
            showConfirmButton: false,
          })*/
          this.userComponent.openModal({
            name: 'asd',
            last_name: 'asd',
            document_number: 'asd',
            city: 'asd',
            role: 'asd',
            email: 'asd',
            direction: 'asd',
            cel_phone: 'asd',
            user: 'asd',
            password: 'asd',
            id_type_user: 'asd',
          });
        }
      }
    );

  }

  deleteUser(idUser:string){

    this.userService.deleteUser(idUser).subscribe( 
      {
        complete: () => {
          Swal.fire({
            icon: 'success',
            title: 'Usuario eliminado con exito',
            showConfirmButton: false,
            timer: 1500
          })
        },
        error: (error: Error)=>{
          Swal.fire({
            icon: 'error',
            title: error.message,
            showConfirmButton: false,
          })
        }
      }
    );
    
  }

}
