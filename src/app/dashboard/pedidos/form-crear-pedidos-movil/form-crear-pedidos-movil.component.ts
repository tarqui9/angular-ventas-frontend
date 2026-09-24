import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SuministrosService } from '@core/service/suministros.service';
import { PedidosService } from '@core/service/pedidos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-crear-pedidos-movil',
  templateUrl: './form-crear-pedidos-movil.component.html',
  styleUrl: './form-crear-pedidos-movil.component.scss'
})
export class FormCrearPedidosMovilComponent {
  form!: FormGroup;
  formDetalle: FormGroup;
  productos: any;
  public totalPedido: any = 0;
  public subTotalPedido: any = 0;

  filteredProductos: any;
  searchControlProducto = new FormControl('');

  @Input() detallePedidosFormArray!: FormArray;
  @Input() descuento!: any;
  @Input() total!: any;
  @Input() subtotal!: any;

  constructor(
    private productoService: SuministrosService,
    private cdRef: ChangeDetectorRef, // Agrega ChangeDetectorRef aquí,
    private pedidosService: PedidosService,
    private fb: FormBuilder,
    private router: Router,
    // private datePipe: DatePipe,
    public route: ActivatedRoute,
  ) {
    this.createForm();
    this.createFormDetalle();
  }

  ngOnInit(): void {

    console.log("DETALLE: ", this.detallePedidosFormArray);
    console.log("DESCUENTO: ", this.descuento.value);
    console.log("TOTAL: ", this.total.value);

    this.listaProducto();

    this.searchControlProducto.valueChanges.subscribe(searchText => {
      this.filteredProductos = this.productos.filter((producto: any) =>
        producto?.codigo.toLowerCase().includes(searchText.toLowerCase()) ||
        producto?.nombre.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.form.get('producto').valueChanges.subscribe(() => {
      console.log("Producto: ", this.form.get('producto').value);
      this.formDetalle.reset();
      const producto = this.form.get('producto').value;
      this.formDetalle.patchValue({
        suministro_id: producto.id,
        nombre_producto: `${producto.codigo ?? ''} ${producto.nombre}`,
        precio: producto?.precio,
      })
    })
  }

  createForm() {
    this.form = this.fb.group({
      producto: [''],
      total: [''],
    })
  }

  createFormDetalle() {
    this.formDetalle = this.fb.group({
      id: [''],
      suministro_id: ['', Validators.required],
      cantidad: ['', Validators.required],
      precio: ['', Validators.required],
      nombre_producto: [''],
      subtotal: [0], // Agrega el campo subtotal
    })
  }

  get detallePedidosArrayControls() {
    return (this.detallePedidosFormArray as FormArray).controls;
  }

  listaProducto() {
    this.productoService.getEnabledList().subscribe(data => {
      this.productos = data;
      this.filteredProductos = data;
    })
  }

  sumarUno() {
    if (this.form.get('producto').value && this.formDetalle.value) {
      const nuevoDetalle = this.fb.group(this.formDetalle.value);

      this.detallePedidosFormArray.push(nuevoDetalle);
      this.cdRef.detectChanges();

      this.calcularTotal();
    } else {
      Swal.fire('Ocurrió un problema', 'Seleccione un producto', 'error');
    }
  }

  restarUno(item: any) {
    for (let i = 0; i < this.detallePedidosArrayControls.length; i++) {
      if (item === i) {
        console.log("ITEM: ", item);
        console.log("INDICE: ", i);
        console.log("FILA: ", this.detallePedidosArrayControls[item].value);
        if (this.detallePedidosArrayControls[item].get('id').value && this.detallePedidosArrayControls[item].get('id').value != '') {
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
              this.pedidosService.deleteDetalle(this.detallePedidosArrayControls[i].get('id').value).subscribe((data: any) => {
                (<FormArray>this.detallePedidosFormArray).removeAt(i);
                this.cdRef.detectChanges();
                Swal.fire(
                  'Eliminado!',
                  'Registro eliminado.',
                  'success'
                )
                // Recalcula el total después de eliminar la fila
                this.calcularTotal('restar');
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
          (<FormArray>this.detallePedidosFormArray).removeAt(i);
          this.cdRef.detectChanges();
          // Recalcula el total después de eliminar la fila
          this.calcularTotal('restar');
        }
      }

    }
  }

  calcularSubtotal() {
    const cantidad = this.formDetalle.get('cantidad')?.value || 0;
    const precio = this.formDetalle.get('precio')?.value || 0;

    this.subTotalPedido = cantidad * precio;
    this.totalPedido = this.subTotalPedido > 0 ? (this.subTotalPedido - (this.subTotalPedido * this.descuento.value) / 100) : this.subTotalPedido;

    this.formDetalle.get('subtotal')?.setValue(this.subTotalPedido);

    //this.calcularTotal(subtotal, total);
  }

  calcularTotal(restar: any = 'sumar'): void {
    if (restar === 'restar') {
      let subTotalSumado = 0;
      this.detallePedidosArrayControls.forEach(control => {
        const subtotal = control.get('subtotal').value;
        if(!isNaN(subtotal)) {
          subTotalSumado += subtotal;
        } 
      })
      const totalRecalculado = subTotalSumado > 0 ? (subTotalSumado - (subTotalSumado * this.descuento.value) / 100) : subTotalSumado;
      this.subtotal?.setValue(subTotalSumado);
      this.total?.setValue(totalRecalculado);
    } else {
      const subtotalFinal = this.subtotal.value + this.subTotalPedido;
      const totalFinal = this.total.value + this.totalPedido;

      this.subtotal?.setValue(subtotalFinal);
      this.total?.setValue(totalFinal);
    }
  }
}
