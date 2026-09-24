import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '@core/service/user.service';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { EmpleadoService } from '@core/service/empleado.service';
import { BodegaService } from '@core/service/bodega.service';

@Component({
  selector: 'app-crear-usuarios',
  templateUrl: './crear-usuarios.component.html',
  styleUrls: ['./crear-usuarios.component.scss']
})
export class CrearUsuariosComponent implements OnInit {

  form!: FormGroup;
  hide = true;
  rolesAll: any;
  submitted = false;
  loading = false;
  user_id: any;
  trackByFn: any;

  //empleados: any;
  //filteredEmpleados: any;

  searchControl = new FormControl('');
  areas: any;
  bodegas: any;

  constructor(
    public dialogRef: MatDialogRef<CrearUsuariosComponent>,
    private fb: FormBuilder,
    private userService: UserService,
    private bodegaService: BodegaService,
    //private empleadoService: EmpleadoService
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.createForm();
  }

  ngOnInit(): void {

    this.listaRoles();
    //this.listaEmpleados();
    this.listaBodegas();
    if (this.data.estado === true) {
      this.user_id = this.data?.id;
      this.getById();
    }

    // Filtros de búsqueda
    /*this.searchControl.valueChanges.subscribe(searchText => {
      this.filteredEmpleados = this.empleados.filter((empleado: any) =>
        empleado.nombre_completo.toLowerCase().includes(searchText.toLowerCase())
      );
    });*/
  }

  /*listaEmpleados() {
    this.empleadoService.getEnabledList().subscribe(data => {
      this.empleados = data;
      this.filteredEmpleados = data; // Inicializa filteredEmpleados
      console.log('>>>', this.empleados);

    })
  }*/


  getById() {
    this.userService.getById(this.user_id).subscribe(data => {
      console.log("Usuario seleccionado: ", data);
      this.form.patchValue({
        //...data,
        nombres: data?.nombres,
        apellidos: data?.apellidos,
        celular: data?.celular,
        ci: data?.ci,
        username: data?.username,
        password: data?.txt_password,
        email: data?.email,
        roles: data?.roles,
        bodega_id: data?.bodega_id,
      })
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    })
  }

  createForm() {
    this.form = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      celular: [''],
      ci: [''],
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roles: this.fb.array([]),
      bodega_id: [''],
    })
  }

  createRolesFormArray(rol: any): FormGroup {
    return this.fb.group({
      id: rol.id || '',
      display_name: rol.display_name || '',
      selected: rol.selected || false
    });
  }

  listaRoles() {
    this.userService.getAllRoles().subscribe((data: any) => {
      this.rolesAll = data;

      const control = <FormArray>this.form.controls['roles'];
      for (let i = 0; i < this.rolesAll.length; i++) {
        control.push(this.createRolesFormArray(this.rolesAll[i]));
      }

      this.form.patchValue({ roles: this.rolesAll });

      // Suscribirse a cambios para verificar si rol_id = 5 está seleccionado
      control.valueChanges.subscribe(() => {
        this.checkRoleSelection();
      });

      // Verificar selección inicial
      this.checkRoleSelection();
    });
  }

  listaBodegas() {
    this.bodegaService.getEnabledList().subscribe(data => {
      this.bodegas = data;
    })
  }

  get roles(): FormArray {
    const dataRoles = this.form.get('roles') as FormArray;
    return dataRoles;
  }

  checkRoleSelection() {
    if (!this.isRole5Selected()) {
      this.form.get('bodega_id').setValue(null); // Establecer explícitamente en null si no está seleccionado
    }
  }

  isRole5Selected(): boolean {
    const rolesFormArray = this.form.get('roles') as FormArray;
    return rolesFormArray.controls.some(control => control.value.id === 5 && control.value.selected);
  }

  registerUser() {
    this.submitted = true;
    this.loading = true;

    if (this.user_id) {
      this.userService.update(this.user_id, this.form.value)
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
              title: 'Usuario actualizado con exito',
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
      this.userService.create(this.form.value)
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
              title: 'Usuario creado con exito',
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
