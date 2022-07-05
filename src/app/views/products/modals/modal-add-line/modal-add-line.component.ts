import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';

import { LineService } from '../../services/line-service/line.service';
import { Product } from '../../response-types/product';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-add-line',
  templateUrl: './modal-add-line.component.html',
  styleUrls: ['./modal-add-line.component.scss']
})
export class ModalAddLineComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  private querySubscription!: Subscription;

  @Input()
  public displayStyle: string = '';

  @Input()
  public dataLine: any;

  @Output()
  public displayStyleEvent = new EventEmitter<string>();

  form: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required])
  });

  constructor(private lineService: LineService) { }

  ngOnInit(): void {
    this.initForm();
  }
  
  refresh() {
    this.lineService.refreshLines();
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  closeModal() {
    this.displayStyle = "none";
    this.form.reset();
    this.displayStyleEvent.emit(this.displayStyle);
  }

  submit() {
   
    this.lineService.editLine(this.form.value, this.dataLine.id).subscribe(({ data }) => {
      console.log('got data', data);
      this.refresh();
    }, (error) => {
      console.log('there was an error sending the query', error);
    });

  }

  initForm() {

    if (this.dataLine.id != null) {
      this.form.controls['nombre'].setValue(this.dataLine.nombre);  
    }

  }

}
