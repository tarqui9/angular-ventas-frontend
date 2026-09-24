import { Component, OnInit } from '@angular/core';
import { PedidosService } from '@core/service/pedidos.service';
import { UserService } from '@core/service/user.service';
import { AgrupadosService } from '@core/service/agrupados.service';
import { FormGroup, FormBuilder, FormArray, Form, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { TokenStorageService } from '@core/authentication/token-storage.service';

@Component({
  selector: 'app-form-crear-distribuciones',
  templateUrl: './form-crear-distribuciones.component.html',
  styleUrl: './form-crear-distribuciones.component.scss'
})
export class FormCrearDistribucionesComponent implements OnInit {

  rolID: any;
  public form: FormGroup;
  public loading = false;
  public listaPedidos: any[] = [];
  public listaDistribuidores: any[] = [];

  public filteredDistribuidores: any;
  public searchControlDistribuidor = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private pedidosService: PedidosService,
    private userService: UserService,
    private agrupadosService: AgrupadosService,
    private router: Router,
    private tokenStorage: TokenStorageService,
  ) {
    this.createFormDistribucion();
  }

  ngOnInit(): void {
    this.rolID = this.tokenStorage.getUser().rol_id;
    this.listarPedidos();
    this.listarUsuariosDistribuidores();

    this.searchControlDistribuidor.valueChanges.subscribe(searchText => {
      this.filteredDistribuidores = this.listaDistribuidores.filter((distribuidor: any) =>
        distribuidor?.nombre_completo.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }

  createFormDistribucion() {
    this.form = this.fb.group({
      user_id: ['', Validators.required],
      pedidos: this.fb.array([]),
    });
  }

  createFormPedidosDistribuidos(pedido: any) {
    return this.fb.group({
      pedido_id: [pedido?.id],
      razon_social: [pedido?.razon_social],
      //sucursal: [pedido?.sucursal?.nombre],
      usuario: [pedido?.usuario?.nombre_completo],
      tipopago: [pedido?.tipopago?.nombre],
      total: [pedido?.total],
      estado: [pedido?.estado],
      selected: false
    })
  }

  get pedidos(): FormArray {
    return this.form.get('pedidos') as FormArray;
  }

  listarUsuariosDistribuidores() {
    this.userService.getAllDistribuidores().subscribe(
      data => {
        console.log("DISTRIBUIDORES: ", data);
        this.listaDistribuidores = data;

        this.filteredDistribuidores = data;
      }
    );
  }

  public listarPedidos() {
    this.pedidosService.getPedidosDistribucion(this.rolID).subscribe(
      data => {
        console.log("PEDIDOS: ", data);
        this.listaPedidos = data;

        if (this.listaPedidos.length > 0) {
          for (let i = 0; i < this.listaPedidos.length; i++) {
            this.pedidos.push(this.createFormPedidosDistribuidos(this.listaPedidos[i]));
          }
        }
      }
    );
  }

  public guardar(form: any) {
    console.log("FORMULARIO: ", form);
    this.loading = true;
    this.agrupadosService.create(form)
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
            title: data.success,
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/dashboard/distribuciones/listar']);
        },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Ocurrio un problema',
            text: error.error,
          });
          this.loading = false;
        }
      );
  }

}
