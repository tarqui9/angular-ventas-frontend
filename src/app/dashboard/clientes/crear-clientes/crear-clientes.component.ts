import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientesService } from '@core/service/clientes.service';
import { TokenStorageService } from '@core/authentication/token-storage.service';
import { TipoPagosService } from '@core/service/tipopagos.service';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-clientes',
  templateUrl: './crear-clientes.component.html',
  styleUrl: './crear-clientes.component.scss'
})
export class CrearClientesComponent implements OnInit{

  form!: FormGroup;
  hide = true;
  submitted = false;
  loading = false;
  client_id: any;
  trackByFn: any;
  listaTipoPagos: any;
  
  searchControl = new FormControl('');


  constructor(
    public dialogRef: MatDialogRef<CrearClientesComponent>,
    private fb: FormBuilder,
    private tipoPagosService: TipoPagosService,
    private clientService: ClientesService,
    public tokenStorage: TokenStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
  }
  ngOnInit(): void {
    this.listarTipoPagos();
    // if (this.data.estado === true) {
    //   this.client_id = this.data?.id;
    //    this.getById();
    // }
  }

  createForm() {
    this.form = this.fb.group({
      contacto: ['', Validators.required],
      celular: ['', Validators.required],
      nit_ci: ['', Validators.required],
      razon_social: ['', Validators.required],
      telefono: [''],
      direccion: ['', Validators.required],
      rol_id: [this.tokenStorage.getUser().rol_id],
      tipopagos: this.fb.array([])
    })
  }

  createFormTipoPagos(tipoPago:any ) {
    return this.fb.group({
      id: tipoPago?.id,
      nombre: tipoPago?.nombre,
      descuento: tipoPago?.descuento,
      selected: tipoPago?.selected || false
    });
  }

  public get tipopagos() : FormArray {
    return this.form.get('tipopagos') as FormArray
  }

  public listarTipoPagos() {
    this.tipoPagosService.getEnabledList().subscribe(
      data => {
        console.log('TIPO PAGOS: ', data);
        this.listaTipoPagos = data;

        const control = <FormArray> this.form.controls['tipopagos'];

        for(let i = 0; i < this.listaTipoPagos.length; i++){
          control.push(this.createFormTipoPagos(this.listaTipoPagos[i]))
        }

        this.form.patchValue({ tipopagos: this.listaTipoPagos });

        if (this.data.estado === true) {
          this.client_id = this.data?.id;
          this.getById();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getById() {
    this.clientService.getById(this.client_id).subscribe(data => {
      console.log("Cliente seleccionado: ", data);
      this.form.patchValue({
        ...data,
        // contacto: data?.contacto,
        // celular: data?.celular,
        // nit_ci: data?.nit_ci,
        // razon_social: data?.razon_social,
        // telefono: data?.telefono,
        // direccion: data?.direccion,
        // tipopagos: data?.tipopagos
      })
      // Actualizar los valores de los tipos de pagos en el formulario
      const control = <FormArray>this.form.controls['tipopagos'];

      // Sincroniza los valores del backend con los controles existentes
      data.tipopagos.forEach((tipoPagoBackend: any) => {
        const index = this.listaTipoPagos.findIndex(
          (tipoPago: any) => tipoPago.id === tipoPagoBackend.id
        );

        if (index !== -1) {
          // Actualiza el valor 'selected' en el FormArray si el id coincide
          const controlItem = control.at(index);
          controlItem.patchValue({ selected: tipoPagoBackend.selected });
        }
      });
    })
  }


  registerClient() {
    this.submitted = true;
    this.loading = true;

    if (this.client_id) {
      this.clientService.update(this.client_id, this.form.value)
        .pipe(
          finalize(() => {
            this.form.markAsPristine();
            this.loading = false;
          })
        )
        .subscribe(
          data3 => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Cliente actualizado con exito',
              text: data3.succes,
              showConfirmButton: false,
              timer: 1500
            });
            // Redirigir al usuario a la ruta deseada
            this.dialogRef.close(data3);
          },
          (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Ocurrio un problema',
              text: error.error
            });
            this.submitted = false;
            this.loading = false;
          }
        );
    }
    else {
      this.clientService.create(this.form.value)
        .pipe(
          finalize(() => {
            this.form.markAsPristine();
            this.loading = false;
          })
        )
        .subscribe(
          data => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Cliente creado con exito',
              text: data.succes,
              showConfirmButton: false,
              timer: 1500
            });
            // Redirigir al usuario a la ruta deseada
            this.dialogRef.close(data);
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
