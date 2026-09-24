import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MovilidadesService } from '@core/service/movilidades.service';
import { UserService } from '@core/service/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-crear-distribuidor',
  templateUrl: './form-crear-distribuidor.component.html',
  styleUrl: './form-crear-distribuidor.component.scss'
})
export class FormCrearDistribuidorComponent implements OnInit {

  public form: FormGroup;
  public movilidades: any[] = [];
  hide = true;
  submitted = false;
  loading = false;

  //filtro movilidades
  filteredMovilidades: any;
  searchControlMovilidad = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<FormCrearDistribuidorComponent>,
    private fb: FormBuilder,
    private movilidadesService: MovilidadesService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.listarMovilidades();

    this.searchControlMovilidad.valueChanges.subscribe(searchText => {
      this.filteredMovilidades = this.movilidades.filter((movilidad: any) =>
        movilidad?.placa.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }

  createForm() {
    this.form = this.fb.group({
      user_id: [this.data?.id || ''],
      movilidad_id: ['', Validators.required]
    });
  }

  listarMovilidades() {
    this.movilidadesService.getAll().subscribe(
      data => {
        console.log("MOVILIDADES: ", data);
        this.movilidades = data;

        this.filteredMovilidades = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  register() {
    if (this.data.estado === true) {
      this.userService.postAsignarDistribuidor(this.form.value).pipe(finalize(() => {
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
