import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UnidadesService } from '@core/service/unidades.service';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-unidad',
  standalone: false,
  templateUrl: './crear-unidad.component.html',
  styleUrl: './crear-unidad.component.scss'
})
export class CrearUnidadComponent implements OnInit{
  form!: FormGroup;

  hide = true;
  submitted = false;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<CrearUnidadComponent>,
    private fb: FormBuilder,
    private unidadService: UnidadesService,
    @Inject(MAT_DIALOG_DATA) private data:any
    ) {
      this.createForm();
    }

  close(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if (this.data.estado === true)
      this.getById();
    }

  getById(){
    this.unidadService.getById(this.data.id).subscribe(data=>{
      console.log(data);
      this.form.patchValue({...data});
    })
  }

  createForm(){
    this.form = this.fb.group({
      nombre: ['',
      [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      sigla: ['',
      [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
    })
  }

  register(form: any){
    this.loading=false;
    this.submitted = true;


    if(this.data.estado === true){
      this.unidadService.update(this.data.id, form).pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.loading = false;
        })
      ).subscribe(
        dataE => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Registro editado con exito',
            showConfirmButton: false,
            timer: 1500
          });
          this.dialogRef.close(dataE);
        },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'ocurrio un problema',
            text: error.error,
          });
          this.submitted = false;
            this.loading = false;
        }
      );
    } else {
      this.unidadService.create(form).pipe(
        finalize(() => {
        this.form.markAsPristine();
        this.loading = false;

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
          Swal.fire({
            icon: 'error',
            title: 'Ocurrio un problema',
            text: error.error,
          });
          this.submitted = false;
          this.loading = false;
        }
      );
    }
  }
}
