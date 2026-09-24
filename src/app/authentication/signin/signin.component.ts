import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@core';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthenticationService } from '@core/authentication/authentication.service';
import { TokenStorageService } from '@core/authentication/token-storage.service';
import Swal from 'sweetalert2';
import { finalize } from 'rxjs';

import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ModalRolSelectedAuthenticationComponent } from '../modal-rol-selected-authentication/modal-rol-selected-authentication.component';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit {
  authForm!: UntypedFormGroup;
  auth_user: any = {};
  submitted = false;
  loading = false;
  error = '';
  hide = true;
  credentials: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private tokenStorage: TokenStorageService,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.error = '';
    if (this.authForm.invalid) {
      this.error = 'Username and Password not valid !';
      return;
    } else {
      this.authenticationService
        .login(this.authForm.value)
        .pipe(
          finalize(() => {
            this.authForm.markAsPristine();
          })
        )
        .subscribe(
          (res: any) => {
            if (res) {
              if (res) {
                this.credentials = res.data;
                if (this.credentials.user?.roles) {
                  const roles = this.credentials.user.roles;

                  if (roles.length === 0) {
                    // Caso cuando no hay elementos en el array
                    console.log('El array roles está vacío.');
                    // Realiza una operación específica aquí
                    Swal.fire({
                      position: 'top-right',
                      icon: 'warning',
                      title: 'Ocurrio un problema al intentar acceder al sistema',
                      showConfirmButton: false,
                      timer: 1500
                    });
                    this.submitted = false;
                    this.loading = false;
                  } else if (roles.length === 1) {
                    // Caso cuando hay exactamente un elemento en el array
                    console.log('El array roles tiene un solo elemento:', roles[0]);
                    this.auth_user = this.credentials.user;
                    this.auth_user.rol = {
                      id: roles[0].id,
                      display_name: roles[0].display_name,
                      name: roles[0].name
                    };

                    this.auth_user.rol_id = roles[0].id;

                    this.tokenStorage.saveToken(this.credentials.token);
                    this.tokenStorage.saveUser(this.auth_user);
                    if (this.credentials.token) {
                      Swal.fire({
                        position: 'top-right',
                        icon: 'success',
                        title: 'Bienvenido al sistema',
                        showConfirmButton: false,
                        timer: 1500
                      });
                      if (roles[0].id === 1) {
                        this.router.navigate(['/dashboard/dashboard1']);
                      }
                      if (roles[0].id === 2) {
                        this.router.navigate(['/dashboard/pedidos/listar']);
                      }
                      if (roles[0].id === 3) {
                        this.router.navigate(['/dashboard/distribuciones/listar']);
                      }
                      if (roles[0].id === 4) {
                        this.router.navigate(['/dashboard/ingresos/listar']);
                      }
                      if (roles[0].id === 5) {
                        this.router.navigate(['/dashboard/distribuciones/listar']);
                      }
                    }
                  } else {
                    // Caso cuando hay más de un elemento en el array
                    console.log('El array roles tiene varios elementos:', roles);

                    const dialogRef = this.dialog.open(ModalRolSelectedAuthenticationComponent, {
                      data: {
                        estado: true,
                        title: 'Seleccione el rol con el cual ingresar',
                        credencial: this.credentials
                      },
                    });
                    dialogRef.afterClosed().subscribe((result) => {
                      if (result) {
                        console.log('Rol seleccionado:', result);
                        this.submitted = false;
                        this.loading = false;
                      } else {
                        console.log('Modal cerrado sin seleccionar un rol');
                        this.submitted = false;
                        this.loading = false;
                      }
                    });
                  }
                }

              } else {
                this.error = 'Invalid Login';
              }
            } else {
              this.error = 'Invalid Login';
            }
          },
          (error: any) => {
            console.log(error);

            this.error = error;
            Swal.fire({
              position: 'top-right',
              icon: 'error',
              title: error.error,
              showConfirmButton: false,
              timer: 1500
            });
            this.submitted = false;
            this.loading = false;
          },
        );
    }
  }
}
