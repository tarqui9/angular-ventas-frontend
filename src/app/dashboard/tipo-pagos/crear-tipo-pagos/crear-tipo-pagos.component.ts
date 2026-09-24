import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoPagosService } from '@core/service/tipopagos.service';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-tipo-pagos',
  templateUrl: './crear-tipo-pagos.component.html',
  styleUrl: './crear-tipo-pagos.component.scss'
})
export class CrearTipoPagosComponent implements OnInit {

  form!: FormGroup;

  hide = true;
  submitted = false;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<CrearTipoPagosComponent>,
    private fb: FormBuilder,
    private tipoPagosService: TipoPagosService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    if (this.data.estado === true){
      this.getById();
    }
  }

  createForm() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      descuento: [0, [Validators.required, Validators.min(0), Validators.max(25)]]
    })
  }

  getById() {
    this.tipoPagosService.getById(this.data.id).subscribe(data => {
      console.log(data);
      this.form.patchValue({
        ...data
      });
    })
  }

  register(form: any) {

    if (this.data.estado === true) {
      this.tipoPagosService.update(this.data.id, form).pipe(
        finalize(() => {
          this.form.markAsPristine();
        })
      ).subscribe(
        dataE => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Tipo de pago editado con exito',
            showConfirmButton: false,
            timer: 1500
          });
          this.dialogRef.close(dataE);
        },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Ocurrio un problema',
            text: error.error,
          });
        }
      );
    } else {
      this.tipoPagosService.create(form).pipe(finalize(() => {
        this.form.markAsPristine();
      })
      )
        .subscribe(
          dataR => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Tipo de pago creado con exito',
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

  close(): void {
    this.dialogRef.close();
  }

}
