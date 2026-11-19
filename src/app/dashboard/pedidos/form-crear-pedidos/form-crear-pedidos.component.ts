import { ProductoCliente } from '../../analisis/analisis.models';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { TokenStorageService } from '@core/authentication/token-storage.service';
import { ClientesService } from '@core/service/clientes.service';
//import { SucursalesService } from '@core/service/sucursales.service';

import { PedidosService } from '@core/service/pedidos.service';
import { SuministrosService } from '@core/service/suministros.service';
import { CrearClientesComponent } from 'app/dashboard/clientes/crear-clientes/crear-clientes.component';

import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-crear-pedidos',
  templateUrl: './form-crear-pedidos.component.html',
  styleUrl: './form-crear-pedidos.component.scss'
})
export class FormCrearPedidosComponent implements OnInit {

  form!: FormGroup;
  tipoPagos: any;
  //sucursales: any;
  clientes!: any;
  productos: any;
  control: any;
  lenght: number = 0;
  submitted = false;
  loading = false;
  pedido_id: any;
  total = 0;

  //buscador clientes
  filteredClientes: any = [];
  searchControlCliente = new FormControl('');

  //buscador sucursales
  /*filteredSucursales: any;
  searchControlSucursal = new FormControl('');*/

  //buscador tipo pagos
  filteredTipoPagos: any = [];
  searchControlTipoPago = new FormControl('');

  //buscador tipo pagos
  filteredProductos: any = [];
  searchControlProducto = new FormControl('');

  get detalle(): FormArray {
    return this.form.get('detalle') as FormArray;
  }

  constructor(
    public tokenStorageService: TokenStorageService,
    private pedidosService: PedidosService,
    private clienteService: ClientesService,
    //private sucursalesService: SucursalesService,
    private productoService: SuministrosService,
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    public route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.createForm();
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe((paramMap: any) => {
      this.pedido_id = paramMap.get('id');
    })

    this.listaClientes();
    //this.listarSucursales();
    this.listaProducto();

    this.control = <FormArray>this.form.controls['detalle'];

    if (this.pedido_id) {
      this.getById();
    }

    this.searchControlCliente.valueChanges.subscribe(searchText => {
      this.filteredClientes = this.clientes.filter((cliente: any) =>
        cliente?.razon_social.toLowerCase().includes(searchText.toLowerCase()) ||
        cliente?.nit_ci?.toString().toLowerCase().includes(searchText.toLowerCase())
      );
    });

    /*this.searchControlSucursal.valueChanges.subscribe(searchText => {
      this.filteredSucursales = this.sucursales.filter((sucursal: any) =>
        sucursal?.nombre.toLowerCase().includes(searchText.toLowerCase())
      );
    });*/

    this.searchControlProducto.valueChanges.subscribe(searchText => {
      this.filteredProductos = this.productos.filter((producto: any) =>
        producto?.codigo.toLowerCase().includes(searchText.toLowerCase()) ||
        producto?.nombre.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.searchControlTipoPago.valueChanges.subscribe(searchText => {
      this.filteredTipoPagos = this.tipoPagos.filter((tipoPago: any) =>
        tipoPago?.nombre.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }

  createForm() {

    this.form = this.fb.group({
      fecha: new FormControl(this.datePipe.transform(new Date(), 'dd-MM-yyyy')),
      cliente_id: ['', Validators.required],
      razon_social: ['', Validators.required],
      nit_ci: ['', Validators.required],
      observacion: [''],
      sucursal_id: [''],
      tipo: ["Contado", Validators.required],
      tipo_pago_id: ['', Validators.required],
      tipopago: ['', Validators.required],
      rol_id: this.tokenStorageService.getUser().rol_id,
      producto_id: [''],
      descuento: [0],
      subtotal: [0],
      total: [0],
      detalle: this.fb.array([]),
    })
  }

  createFormDetalle(): FormGroup {
    return this.fb.group({
      id: [''],
      suministro_id: ['', Validators.required],
      stock: ['',],
      cantidad: ['', Validators.required],
      precio: ['', Validators.required],
      nombre_producto: [''],
      subtotal: [0],
    })
  }

  listaClientes(objCli:any = 0, objTipo:any = 0) {
    this.clienteService.getAll().subscribe(data => {
      this.clientes = data;
      this.filteredClientes = data;
      if (objCli) {
        // Encuentra el cliente correspondiente en la lista actualizada
        const clienteSeleccionado = this.filteredClientes.find(cliente => cliente.id === objCli);
        this.form.patchValue({
          cliente_id: clienteSeleccionado,
          razon_social: clienteSeleccionado?.razon_social,
          nit_ci: clienteSeleccionado?.nit_ci,
        })
        this.tipoPagos = clienteSeleccionado?.tipopagos;
        this.filteredTipoPagos = clienteSeleccionado?.tipopagos;
      }
    })
  }

  /*listarSucursales() {
    this.sucursalesService.getAll().subscribe(
      data => {
        console.log("Sucursales: ", data);
        this.sucursales = data;
        this.filteredSucursales = data;
      },
      error => {
        console.log(error);
      }
    )
  }*/

  listaProducto(sucursalId?: number) {
    this.productoService.getEnabledList(sucursalId ? { sucursal_id: sucursalId } : undefined).subscribe(data => {
      this.productos = data;
      this.filteredProductos = data;
    })
  }
  
  crearCliente() {
    const dialogRef = this.dialog.open(CrearClientesComponent, {
      data: {
        estado: false,
        title: 'Nuevo Registro'
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaClientes(result.element.id);
      }
    });
  }

  clienteSeleccionado(cliente: any) {
    if (cliente?.sucursal_id) this.listaProducto(cliente.sucursal_id);
    // console.log("Cliente seleccionado: ", cliente);
    this.tipoPagos = cliente?.tipopagos;
    this.filteredTipoPagos = cliente?.tipopagos;

    this.form.patchValue({
      cliente_id: cliente,
      razon_social: cliente?.razon_social,
      nit_ci: cliente?.nit_ci,
      // tipo_pago_id: '',
      tipopago: '',
    })
  }

  tipoPagoSeleccionado(tipoPagoId: any) {
    const tipoPago = this.tipoPagos.filter((tipoPago: any) => tipoPago?.id === tipoPagoId.id);
    // console.log("TIPO PAGO: ", tipoPago);
    
    this.form.patchValue({
      tipo_pago_id: tipoPagoId.id,
    })
    this.form.get('descuento').setValue(tipoPago[0]?.descuento);
    this.actualizarTotal();
  }

  compareCliente = (o1: any, o2: any) => o1 && o2 && o1.id === o2.id;
  compareTipoPago = (o1: any, o2: any) => o1 && o2 && o1.id === o2.id;

  getById() {
    this.pedidosService.getById(this.pedido_id).subscribe(data => {
      // console.log("EDITAR: ", data);
      this.total = data?.total,
        this.form.patchValue({
          // ...data,
          fecha: this.datePipe.transform(data.fecha, 'dd-MM-yyyy'),
          cliente_id: data?.cliente,
          razon_social: data?.cliente?.razon_social,
          nit_ci: data?.cliente?.nit_ci,
          observacion: data?.observacion,
          sucursal_id: data?.sucursal_id,
          tipo: data?.tipo,
          tipo_pago_id: data?.tipo_pago_id,
          tipopago: data?.cliente.tipopagos,
          descuento: data?.tipopago?.descuento,
          subtotal: data?.subtotal,
          total: data?.total,
          rol_id: data?.rol_id,
        })
      this.filteredTipoPagos = data?.cliente.tipopagos;
      data.detalle.forEach((element: any, index: any) => {
        // console.log("Producto: ", element);
        const codigo = (element.suministro?.codigo !== null) ? element.suministro?.codigo + ' ' : '';
        this.sumarControl();
        this.control.controls[index].patchValue({
          id: element?.id,
          suministro_id: element?.suministro_id,
          cantidad: element.cantidad,
          precio: element?.precio,
          stock: element?.stock,
          subtotal: element?.total,
          nombre_producto: codigo + element?.suministro?.nombre,
        })
      });

      this.clienteSeleccionado(data.cliente);
      const pagoSelected = this.filteredTipoPagos.find(tipopago => tipopago.id === data?.tipo_pago_id);
      this.form.patchValue({
        tipopago: pagoSelected,
      });
    })
  }

  sumarUno(form1: any) {
    if (form1.producto_id) {
      const nuevoDetalle = this.createFormDetalle();
      const producto = form1.producto_id;
      // Asignar valores a los campos en el nuevo detalle
      nuevoDetalle.patchValue({
        suministro_id: producto.id,
        nombre_producto: `${producto.codigo ?? ''} ${producto.nombre}`,
        precio: producto?.precio,
        stock: producto?.stock
      });

      this.detalle.push(nuevoDetalle);

    } else {
      Swal.fire('Ocurrió un problema', 'Seleccione un producto', 'error');
    }
  }

  sumarControl() {
    this.control.push(this.createFormDetalle());
  }

  restarUno(item: any) {
    for (let i = 0; i < this.control.controls.length; i++) {
      if (item === i) {
        if (this.control.controls[item].get('id').value != '') {
          Swal.fire({
            title: '¿Está seguro?',
            text: "El registro sera eliminado del sistema",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'primary',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, bórralo!',
            cancelButtonText: 'No, cancelar!',
          }).then((result) => {
            if (result.isConfirmed) {
              this.pedidosService.deleteDetalle(this.control.controls[i].get('id').value).subscribe((data: any) => {
                (<FormArray>this.form.controls['detalle']).removeAt(i);

                Swal.fire(
                  'Eliminado!',
                  'Registro eliminado.',
                  'success'
                )

                // Recalcula el total después de eliminar la fila
                this.actualizarTotal();
              },
                (error: any) => {
                  Swal.fire({
                    icon: 'error',
                    title: 'Ocurrio un problema',
                    text: error.error
                  });
                }
              );
            } else if (
              result.dismiss === Swal.DismissReason.cancel
            ) {
              Swal.fire(
                'Cancelado',
                'Registro no eliminado',
                'error'
              )
            }
          })
        } else {
          (<FormArray>this.form.controls['detalle']).removeAt(i);

          // Recalcula el total después de eliminar la fila
          this.actualizarTotal();
        }
      }

    }
  }

  get productosIncluidos(): number[] {
    return this.detalle.controls.map(row => Number(row.get('suministro_id')?.value));
  }

  agregarSugerido(producto: ProductoCliente): void {
    if (this.loading || this.productosIncluidos.includes(producto.suministro_id)) return;
    const cantidad = Math.min(producto.cantidad_habitual, producto.stock_disponible);
    if (!producto.habilitado || cantidad < 1) return;
    const nuevo = this.createFormDetalle();
    nuevo.patchValue({ suministro_id: producto.suministro_id, nombre_producto: producto.nombre,
      cantidad, precio: producto.precio, stock: producto.stock_disponible, subtotal: cantidad * producto.precio });
    this.detalle.push(nuevo);
    this.actualizarTotal();
  }

  calcularSubtotal(index: number): void {
    const control = (this.form.get('detalle') as FormArray).at(index);
    const cantidad = control.get('cantidad')?.value || 0;
    const precio = control.get('precio')?.value || 0;
    const subtotal = cantidad * precio;

    control.get('subtotal')?.setValue(subtotal);

    // Actualiza el total general
    this.actualizarTotal();
  }

  actualizarTotal(): void {
    const detalles = this.form.get('detalle') as FormArray;
    const descuento = this.form.get('descuento').value;
  
    const total = detalles.controls.reduce((acc, control) => {
      const subtotal = control.get('subtotal')?.value || 0;
      return acc + subtotal;
    }, 0);

    const totalDescuento = total > 0 ? total - (total * descuento) / 100 : total;

    this.form.get('subtotal')?.setValue(total);
    this.form.get('total')?.setValue(totalDescuento);
  
    // console.log("Total sin descuento: ", total);
    // console.log("Total con descuento: ", totalDescuento);
  }
  

  guardar(form: any) {
    // console.log("FORM: ", form);
    this.loading = true;
    this.submitted = true;

    if (this.pedido_id) {
      this.pedidosService.update(this.pedido_id, form)
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
            this.router.navigate(['/dashboard/pedidos/listar']);

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
    } else {
      this.pedidosService.create(form)
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
            this.router.navigate(['/dashboard/pedidos/listar']);

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

}
