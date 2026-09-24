import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PedidosService } from '@core/service/pedidos.service';
import { SuministrosService } from '@core/service/suministros.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-ingresos-movil',
  templateUrl: './crear-ingresos-movil.component.html',
  styleUrl: './crear-ingresos-movil.component.scss'
})
export class CrearIngresosMovilComponent {
  form!: FormGroup;
  formDetalle: FormGroup;
  productos: any;
  public totalPedido: any = 0;
  public subTotalPedido: any = 0;

  filteredProductos: any;
  searchControlProducto = new FormControl('');

  @Input() detallePedidosFormArray!: FormArray;
  @Input() total!: any;

  constructor(
    private productoService: SuministrosService,
    private cdRef: ChangeDetectorRef,
    private pedidosService: PedidosService,
    private fb: FormBuilder,
    // private datePipe: DatePipe,
    public route: ActivatedRoute,
  ) {
    this.createForm();
    this.createFormDetalle();
  }

  ngOnInit(): void {

    console.log("DETALLE: ", this.detallePedidosFormArray);
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
      suministro_id: ['',Validators.required],
      cantidad: ['', Validators.required],
      costo_unitario: ['', Validators.required],
      fecha_vencimiento: ['', Validators.required],
      lote: ['', Validators.required],
      nombre_producto: [''],
      subtotal: [''],
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
      console.log(nuevoDetalle);

      this.detallePedidosFormArray.push(nuevoDetalle);
      this.cdRef.detectChanges();

      this.calcularTotal();
      this.formDetalle.reset();
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
    const costo = this.formDetalle.get('costo_unitario')?.value || 0;

    this.subTotalPedido = cantidad * costo;
    this.totalPedido = this.subTotalPedido;

    this.formDetalle.get('subtotal')?.setValue(this.subTotalPedido);

    // this.calcularTotal();
  }

  calcularTotal(restar: any = 'sumar'): void {
    if (restar === 'restar') {
      let subTotalSumado = 0;
      this.detallePedidosArrayControls.forEach(control => {
        const cantidad = control.get('cantidad').value;
        const costo_unitario = control.get('costo_unitario').value;
        if(!isNaN(cantidad) && !isNaN(costo_unitario)) {
        // if(!isNaN(cantidad)) {
          subTotalSumado += cantidad * costo_unitario;
        } 
      })
      const totalRecalculado = subTotalSumado;
      this.total?.setValue(totalRecalculado);
    } else {
      const totalFinal = this.total.value + this.totalPedido;

      this.total?.setValue(totalFinal);
    }
  }
}
