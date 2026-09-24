import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CaracteristicasService } from '@core/service/caracteristicasService.service';
import { CrearCategoriasComponent } from 'app/dashboard/categorias/crear-categorias/crear-categorias.component';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-carac',
  templateUrl: './crear-carac.component.html',
  styleUrl: './crear-carac.component.scss'
})
export class CrearCaracComponent {
  form!: FormGroup;

  hide = true;
  submitted = false;
  loading = false;
  constructor(
    public dialogRef: MatDialogRef<CrearCaracComponent>,
    private fb: FormBuilder,
    private categoriaService: CaracteristicasService,
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
    this.categoriaService.getById(this.data.id).subscribe(data=>{
      console.log(data);
      this.form.patchValue({
        tipo_id:data.tipo_id,
        nombre:data.nombre
      });
    })
  }

  createForm(){
    this.form = this.fb.group({
      nombre: [
        '',
      [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
    })
  }

  register(form: any){

    if(this.data.estado === true){
      this.categoriaService.update(this.data.id, form).pipe(
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
      this.categoriaService.create(form).pipe(finalize(() => {
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
