import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs';
import { PagosService } from '@core/service/pago.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-cobro-pedido',
  templateUrl: './form-cobro-pedido.component.html',
  styleUrl: './form-cobro-pedido.component.scss'
})
export class FormCobroPedidoComponent implements OnInit {

  public form: FormGroup;
  public pedido_id: any;
  hide = true;
  submitted = false;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<FormCobroPedidoComponent>,
    private fb: FormBuilder,
    private pagosService: PagosService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createFormCobro();
  }

  ngOnInit(): void {
    if (this.data?.id) {
      this.pedido_id = this.data?.id;
      console.log("PEDIDO_ID: ", this.pedido_id);
    }
  }

  createFormCobro() {
    this.form = this.fb.group({
      pedido_id: [this.pedido_id || ''],
      monto: [0]
    })
  }

  register() {
    this.form.get('pedido_id').setValue(this.pedido_id);

    if (this.pedido_id) {
      this.pagosService.create(this.form.value).pipe(finalize(() => {
        this.form.markAsPristine();
      })
      )
        .subscribe(
          dataR => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Cobro realizado',
              text: dataR.success,
              showConfirmButton: false,
              timer: 1500
            });
            this.dialogRef.close(dataR);
          },
          (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Ocurrio un probema',
              text: error.error,
            });
          }
        );
    }
  }

}
