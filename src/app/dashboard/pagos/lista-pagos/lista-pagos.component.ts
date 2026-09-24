import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PagosService } from '@core/service/pago.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-pagos',
  templateUrl: './lista-pagos.component.html',
  styleUrl: './lista-pagos.component.scss'
})
export class ListaPagosComponent implements OnInit {
  nombreColumnas: string[] = [
    'Nº',
    'Fecha',
    'Monto',
    'Vendedor',
    'Pedido',
    'Acciones'
  ];

  public form: FormGroup;
  total: any;
  pagos: any;
  paginado!: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dialogConfig?: MatDialogConfig;

  constructor(
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private pagoService: PagosService
  ) { }

  ngOnInit(): void {
    this.createFormFiltros();
    this.listaPagos();
    
    this.form.valueChanges.subscribe((data: any) => {
      this.listaPagos();
    })
  }
  
  createFormFiltros() {
    this.form = this.fb.group({
      user_id: [''],
      fecha_inicio: [new Date()],
      fecha_fin: [new Date()]
    });
  }
  
  listaPagos(){
    // const user_id = data?.user_id || '';
    const fecha_inicio = this.datePipe.transform(this.form.get('fecha_inicio').value, 'yyyy-MM-dd') || '';
    const fecha_fin = this.datePipe.transform(this.form.get('fecha_fin').value, 'yyyy-MM-dd') || '';
    this.pagoService.getAll({rol_id: 1,fecha_inicio:fecha_inicio,fecha_fin:fecha_fin}).subscribe(data=>{
      this.pagos = data;
      this.paginado = new MatTableDataSource<any>(this.pagos);
      this.paginado.paginator = this.paginator;
      this.total = this.pagos.reduce((acumulador, item) => acumulador + item.monto, 0);
      
      this.pagos = this.paginado.filteredData;

      this.filterPredicate();
    });
  }

  filterPredicate() {
    this.paginado.filterPredicate = (data: any, filter: string) => {
      if (!filter) return true; // Si no hay filtro, mostrar todos los datos
  
      // Función recursiva para buscar en objetos anidados
      const searchObject = (obj: any): boolean => {
        return Object.values(obj).some(value => {
          if (value !== null && value !== undefined) {
            if (typeof value === 'object') {
              return searchObject(value); // Llamada recursiva si el valor es un objeto
            } else {
              return value.toString().toLowerCase().includes(filter);
            }
          }
          return false;
        });
      };

      return searchObject(data);
    };

    // Aplicar filtro si ya hay un valor buscado
    if (this.paginado.filter) {
      this.paginado.filter = this.paginado.filter;
    }
  }

  // create(){
  //   const dialogRef = this.dialog.open(CrearProveedorComponent, {
  //     data: {
  //       estado: false,
  //       title: 'Nuevo Registro'
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.listaPagos()
  //     }
  //   });
  // }

  // editar(id: any){
  //   const dialogRef = this.dialog.open(CrearProveedorComponent,{
  //     data: {
  //       estado: true,
  //       title: 'Editar Registro',
  //       id: id
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.listaPagos()
  //     }
  //   });
  // }

  delete(id: any){
    console.log(id);
    Swal.fire({
      title: '¿Está seguro?',
      text: "¡Esta acción no podrá revertirce!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'primary',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, bórralo!',
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.pagoService.delete(id).subscribe( (data: any) => {
          console.log(data);
          this.listaPagos();
          Swal.fire(
            'Eliminado!',
            'Registro eliminado.',
            'success'
          )
        },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Ocurrio un problema',
            text: error.error,
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
  }

  applyFilters(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.paginado.filter = filterValue; // Establece el valor del filtro
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.paginado.filter = filterValue.trim().toLowerCase();
  
    // this.pagos = this.paginado.filteredData;
  }
}
