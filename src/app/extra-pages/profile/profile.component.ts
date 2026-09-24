import { Component } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
// import { EmpleadoService } from '@core/service/empleado.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { UserService } from '@core/service/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { WebMaterialModule } from 'app/webmaterial.module';
import { ConfiguracionService } from '@core/service/configuracion.service';
import { TokenStorageService } from '@core/authentication/token-storage.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    standalone: true,
    imports: [
        BreadcrumbComponent,
        MatTabsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        CommonModule,
        ReactiveFormsModule,
        WebMaterialModule
    ],
  })

  export class ProfileComponent implements OnInit{
  form!: FormGroup;
  formConfigInventario: FormGroup;
  tipo_control_actual: any;

  empleados:any;
  empleado_id :any;
  id_recuperado: any;

  constructor(
    // private empleadosService: EmpleadoService,
    private userService: UserService,
    private fb: FormBuilder,
    private configuracionService: ConfiguracionService,
    protected tokenStorage: TokenStorageService
  ) {
    this.createForm();
    this.createFormConfigInventario();
  }
  ngOnInit(){
    this.recuperarIdUser();
    this.listarEmpleados();
    this.getById();
    this.informacionConfiguracionInventarioActual();
  }
  listarEmpleados(){
    this.userService.getById(this.id_recuperado).subscribe((data: any) => {
      this.empleados = data;
    });
  }
  recuperarIdUser(){
    const ob_user = sessionStorage.getItem('auth-user');
    const json_user = JSON.parse(ob_user);
    const funcionarioId = json_user.id;
    this.id_recuperado = funcionarioId;
    console.log('ID:', this.id_recuperado);
  }
  createForm() {
    this.form = this.fb.group({
      id: ['',],
      current_password : ['', Validators.required],
      password: ['', Validators.required],
    })
  }
  cambiar_contrasenia(form) {
  
    this.userService.cambiarContrasenia(form).subscribe(
      data => {
        this.form.controls['current_password'].reset();
        this.form.controls['password'].reset();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Contraseña actualizada con exito',
          text: data.succes,
          showConfirmButton: false,
          timer: 1500
        });
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Ocurrio un problema',
          text: error.error
        });
  
      }
    );
  }
  getById() {
    this.userService.getById(this.id_recuperado).subscribe(data=>{
      this.form.patchValue({
        ...data,
      })

    })
  }

  informacionConfiguracionInventarioActual() {
    this.configuracionService.getAll().subscribe(
      data => {
        console.log("Config Inventario actual: ", data);
        //this.tipo_control_actual = data?.tipo_control;
        this.nombreComletoTipoInventario(data?.tipo_control);

        this.formConfigInventario.patchValue({
          tipo_control: data?.tipo_control,
        })
      },
      error => {
        console.log(error);
      }
    )
  }

  nombreComletoTipoInventario(tipo_control_data: any) {
    if(tipo_control_data === 'peps'){
      this.tipo_control_actual = 'Primero en Entrar, Primero en Salir (PEPS)';
    }else if(tipo_control_data === 'ueps'){
      this.tipo_control_actual = 'Ultimo en Entrar, Primero en Salir (UEPS)';
    }else if(tipo_control_data === 'cpp'){
      this.tipo_control_actual = 'Costo Promedio Ponderado (CPP)';
    }
  }

  createFormConfigInventario() {
    this.formConfigInventario = this.fb.group({
      tipo_control : ['', Validators.required],
    })
  }

  cambiarConfiguracionInventario(formConfig: any) {
    this.configuracionService.create(formConfig).subscribe(
      data => {
        //this.form.controls['current_password'].reset();
        //this.form.controls['password'].reset();
        this.informacionConfiguracionInventarioActual();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Se cambio el tipo de control de inventario',
          text: data.succes,
          showConfirmButton: false,
          timer: 1500
        });
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Ocurrio un problema',
          text: error.error
        });
  
      }
    );
  }

}
