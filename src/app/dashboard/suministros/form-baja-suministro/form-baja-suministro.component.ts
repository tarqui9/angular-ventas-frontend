import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BajasSuministrosService } from '@core/service/bajas-suministros..service';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-baja-suministro',
  templateUrl: './form-baja-suministro.component.html',
  styleUrl: './form-baja-suministro.component.scss'
})
export class FormBajaSuministroComponent implements OnInit {

  form!: FormGroup;

  hide = true;
  submitted = false;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<FormBajaSuministroComponent>,
    private bajaSuministrosService: BajasSuministrosService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  close(): void {
    this.dialogRef.close();
  }

  createForm() {
    this.form = this.fb.group({
      suministro_id: [this.data.suministro_id, Validators.required],
      cantidad: [0, Validators.required],
      justificacion: ['', Validators.required],
      fecha: [new Date(), Validators.required]
    });
  }

  registrarBajaSuministro() {
    console.log("Data: ", this.form.value);
    if(this.data.estado === true && this.data.suministro_id){
      this.bajaSuministrosService.create(this.form.value).pipe(finalize(() => {
        this.form.markAsPristine();
      })
      )
      .subscribe(
        dataR => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Registro creado con exito',
            text: dataR.success,
            showConfirmButton: false,
            timer: 1500
          });
          this.dialogRef.close(dataR);
        },
        (error: any) => {

          const errorMessage = error.error.error || 'Ocurrió un problema inesperado.';
          
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
          });
        }
      );
    }
  }
}
