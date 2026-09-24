import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IngresosService } from '@core/service/ingresos.service';
import { ProveedoresService } from '@core/service/proveedores.service';
import { SuministrosService } from '@core/service/suministros.service';
import { atLeastOne } from 'app/validators/at-least-one.validator';
import { Subject, debounceTime, delay, filter, finalize, map, takeUntil, tap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-ingresos',
  templateUrl: './crear-ingresos.component.html',
  styleUrl: './crear-ingresos.component.scss'
})
export class CrearIngresosComponent implements OnInit {

  form!: FormGroup
  proveedores!: any;
  productos: any;
  control: any;
  lenght: number = 0;
  submitted = false;
  loading = false;
  ingreso_id: any;
  total=0 ;

  //buscador proveedores
  filteredProveedores: any;
  searchControlProveedor = new FormControl('');

  get detalle(): FormArray {
    return this.form.get('detalle') as FormArray;
  }
  
  public searching: boolean = false;
  textInput: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  pickers: string[] = [];
  
  constructor(
    private ingresoService: IngresosService,
    private proveedorService:ProveedoresService,
    private productoService: SuministrosService,
    private fb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    public route: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    this.route.paramMap
    .subscribe((paramMap: any) => {        
      this.ingreso_id = paramMap.get('id');
    })
    this.createForm();
    this.listaProveedores();
    this.listaProducto('');
    this.textInput.valueChanges.
    pipe(
      filter(search => !!search),
      tap(() => this.searching = true),
      takeUntil(this._onDestroy),
      debounceTime(200),
      map(search => {
        this.listaProducto(search)
      }),
      delay(500)
    )
    .subscribe(data=>{
      this.searching = false;
    })
    
    this.control = <FormArray>this.form.controls['detalle'];

    if(this.ingreso_id){
      this.getById();
    }

    this.searchControlProveedor.valueChanges.subscribe(searchText => {
      this.filteredProveedores = this.proveedores.filter((proveedor: any) =>
        proveedor.nombre.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }

  createForm() {

    this.form = this.fb.group({
      numero:['',Validators.required],
      fecha: new FormControl(this.datePipe.transform(new Date(), 'dd-MM-yyyy')),
      proveedor_id:['',Validators.required],
      producto_id:[''],
      total: [0],
      detalle: this.fb.array([], atLeastOne),
    })
  }

  createFormDetalle():FormGroup{
    return this.fb.group({
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
  listaProducto(term:any) {
    this.productoService.getEnabledList({
      term
    }).subscribe(data=>{
      this.productos = data;
    })
  }

  listaProveedores() {
    this.proveedorService.getEnabledList().subscribe(data=>{
      this.proveedores = data;
      this.filteredProveedores = data;
    })
  }

  getById(){
    this.ingresoService.getById(this.ingreso_id).subscribe(data=>{
      this.form.patchValue({
        numero: data.numero,
        fecha: this.datePipe.transform(data.fecha, 'dd-MM-yyyy'),
        proveedor_id: data.proveedor_id,          
        total: data.total,          
      })
      data.detalle.forEach((element:any,index:any) => {
          this.sumarControl()
          const codigo = (element.suministro?.codigo !== null) ? element.suministro?.codigo + ' ' : '';
          this.control.controls[index].patchValue({
            id: element.id,
            suministro_id: element.suministro_id,
            cantidad: element.cantidad,
            costo_unitario: element.costo_unitario,
            subtotal: element.cantidad * element.costo_unitario,
            fecha_vencimiento: element?.fecha_vencimiento,
            lote: element?.lote,
            nombre_producto: codigo+element.suministro?.nombre
          })
        
      });
    })
  }

  sumarUno(form1:any){
    console.log('>>>>>',form1);
    
    if(form1.producto_id !== ''){
      this.lenght = this.control.length;
        for (let index = 0; index < 1; index++) {
          this.control.push(this.createFormDetalle());
  
          this.control.controls[index + this.lenght].get('suministro_id').setValue(form1.producto_id.id);
          const codigo = (form1.producto_id?.codigo !== null) ? form1.producto_id?.codigo + ' ' : '';
          this.control.controls[index + this.lenght].get('nombre_producto').setValue(codigo + form1.producto_id.nombre);
        }
      }
      else{
        Swal.fire(
          'Ocurrio un problema',
          'Seleccione un producto',
          'error'
          )
      }
  }

  sumarControl(){
    this.control.push(this.createFormDetalle());
  }

  restarUno(item: any) {
    for (let i = 0; i < this.control.controls.length; i++) {
     if (item === i) {
          if(this.control.controls[item].get('id').value!=''){
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
                this.ingresoService.deleteDetalle(this.control.controls[i].get('id').value).subscribe( (data: any) => {
                 (<FormArray>this.form.controls['detalle']).removeAt(i);
                 
                  Swal.fire(
                    'Eliminado!',
                    'Registro eliminado.',
                    'success'
                  )        
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
          }else{
            (<FormArray>this.form.controls['detalle']).removeAt(i);
            this.actualizarTotal();
          }
        }
      
    }
  }

  guardar(form:any){
    this.loading=true;
    this.submitted=true;

    if (this.ingreso_id) {
      this.ingresoService.update(this.ingreso_id,form)
      .pipe(
        finalize(() => {

          this.form.markAsPristine();
          this.loading=false;
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
          this.router.navigate(['/dashboard/ingresos/listar']);

        },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Ocurrio un problema',
            text: error.error,
          });
          this.loading=false;
          
        }
      );
    }else{
      this.ingresoService.create(form)
      .pipe(
        finalize(() => {

          this.form.markAsPristine();
          this.loading=false;
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
          this.router.navigate(['/dashboard/ingresos/listar']);

        },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Ocurrio un problema',
            text: error.error,
          });
          this.loading=false;
        }
      );
    }
  }

  actualizarTotal(): void {
    const detalles = this.form.get('detalle') as FormArray;
  
    const total = detalles.controls.reduce((acc, control) => {
      const cantidad = control.get('cantidad')?.value || 0;
      const costo_unitario = control.get('costo_unitario')?.value || 0;
      return acc + (cantidad * costo_unitario);
    }, 0);

    console.log("Total INGRESO: ", total);
    this.form.get('total')?.setValue(total);
  }

}
