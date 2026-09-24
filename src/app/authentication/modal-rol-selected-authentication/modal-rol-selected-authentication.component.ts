import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebMaterialModule } from 'app/webmaterial.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenStorageService } from '@core/authentication/token-storage.service';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-modal-rol-selected-authentication',
  standalone: true,
  imports: [
    CommonModule,
    WebMaterialModule
  ],
  templateUrl: './modal-rol-selected-authentication.component.html',
  styleUrl: './modal-rol-selected-authentication.component.scss'
})
export class ModalRolSelectedAuthenticationComponent implements OnInit {

  form!: FormGroup;

  hide = true;
  submitted = false;
  loading = false;

  rolesUser: any[] = [];
  auth_user: any;
  token_user: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalRolSelectedAuthenticationComponent>,
    private tokenStorage: TokenStorageService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    if (this.data.credencial) {
      console.log("MODAL: ", this.data.credencial);
      this.auth_user = this.data.credencial?.user;
      this.token_user = this.data.credencial?.token;
      this.rolesUser = this.data.credencial?.user?.roles;
      console.log("Roles: ", this.rolesUser)
    }
  }

  createForm() {
    this.form = this.fb.group({
      credencialUser: [null, Validators.required],
    })
  }

  close(): void {
    this.dialogRef.close();
  }

  ingresar(form: any) {

    this.auth_user.rol = {
      id: form.credencialUser.id,
      display_name: form.credencialUser.display_name,
      name: form.credencialUser.name
    };

    this.auth_user.rol_id = form.credencialUser.id;

    console.log("CREDENCIAL ACTUALIZADO: ", this.auth_user);

    this.tokenStorage.saveToken(this.token_user);
    this.tokenStorage.saveUser(this.auth_user);

    if (this.token_user) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Bienvenido al sistema',
        showConfirmButton: false,
        timer: 1500
      });
      this.dialogRef.close(this.data.credencial.user.rol);
      
      if (this.auth_user.rol.id === 1) {
        this.router.navigate(['/dashboard/dashboard1']);
      }
      if (this.auth_user.rol.id === 2) {
        this.router.navigate(['/dashboard/pedidos/listar']);
      }
      if (this.auth_user.rol.id === 3) {
        this.router.navigate(['/dashboard/distribuciones/listar']);
      }
      if (this.auth_user.rol.id === 4) {
        this.router.navigate(['/dashboard/ingresos/listar']);
      }
      if (this.auth_user.rol.id === 5) {
        this.router.navigate(['/dashboard/distribuciones/listar']);
      }
    }
  }
}
