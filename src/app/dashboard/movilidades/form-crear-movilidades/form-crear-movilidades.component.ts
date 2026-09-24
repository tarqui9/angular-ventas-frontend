import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MovilidadesService } from '@core/service/movilidades.service';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-crear-movilidades',
  templateUrl: './form-crear-movilidades.component.html',
  styleUrl: './form-crear-movilidades.component.scss'
})
export class FormCrearMovilidadesComponent implements OnInit {

  form!: FormGroup;

  hide = true;
  submitted = false;
  loading = false;

  imagen: any;

  constructor(
    public dialogRef: MatDialogRef<FormCrearMovilidadesComponent>,
    private fb: FormBuilder,
    private movilidadesService: MovilidadesService,
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
    this.movilidadesService.getById(this.data.id).subscribe(data=>{
      console.log(data);
      this.form.patchValue({
        placa: data?.placa,
        descripcion: data?.descripcion,
        color: data?.color
      });
    })
  }

  createForm(){
    this.form = this.fb.group({
      placa: ['', Validators.required],
      descripcion: [''],
      color: ['', Validators.required],
      file: ['']
    })
  }

  agregarFoto(data: any) {
    this.form.get('file').setValue(data.url);
    this.imagen = data.file;
    console.log(data)
  }

  register(form: any){

    this.loading = true;

    const formData = new FormData();

    formData.append('placa', this.form.controls['placa'].value);
    formData.append('descripcion', this.form.controls['descripcion'].value);
    formData.append('color', this.form.controls['color'].value);

    if(this.imagen) {
      formData.append('file', this.imagen);
    }else{
      formData.append('file', '');
    }

    if(this.data.estado === true){
      formData.append('_method', 'PUT');
      this.movilidadesService.updatePost(this.data.id, formData).pipe(
        finalize(() => {
          this.form.markAsPristine();
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
            title: 'Ocurrio un problema',
            text: error.error,
          });
        }
      );
    } else {
      this.movilidadesService.create(formData).pipe(finalize(() => {
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
