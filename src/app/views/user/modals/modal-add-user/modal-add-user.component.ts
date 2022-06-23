import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-add-user',
  templateUrl: './modal-add-user.component.html',
  styleUrls: ['./modal-add-user.component.scss']
})
export class ModalAddUserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  displayStyle = "none";
  
  openModal() {
    this.displayStyle = "block";
    console.log("ENTRA");
  }
  closeModal() {
    this.displayStyle = "none";
  }

}
