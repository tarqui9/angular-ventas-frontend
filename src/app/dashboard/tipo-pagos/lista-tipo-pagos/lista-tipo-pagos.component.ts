import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { CrearTipoPagosComponent } from '../crear-tipo-pagos/crear-tipo-pagos.component';
import { TipoPagosService } from '@core/service/tipopagos.service';

@Component({
  selector: 'app-lista-tipo-pagos',
  templateUrl: './lista-tipo-pagos.component.html',
  styleUrl: './lista-tipo-pagos.component.scss'
})
export class ListaTipoPagosComponent implements OnInit {

  public tipoPagos: any;

  nombreColumnas: string[] = [
    'Nº',
    'Nombre',
    'Descuento',
    'Habilitado',
    'Acciones'

  ];
  paginado!: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dialogConfig?: MatDialogConfig;

  constructor(
    private dialog: MatDialog,
    private tipoPagosService: TipoPagosService
  ) { }

  ngOnInit(): void {
    this.listarTipoPagos();
  }

  public listarTipoPagos() {
    this.tipoPagosService.getAll().subscribe((data: any) => {
      console.log("TIPO PAGOS: ", data);
      this.tipoPagos = data;
      this.paginado = new MatTableDataSource<any>(this.tipoPagos);
      this.paginado.paginator = this.paginator;

      this.tipoPagos = this.paginado.filteredData;
    });
  }

  applyFilters(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.paginado.filter = filterValue.trim().toLowerCase();

    this.tipoPagos = this.paginado.filteredData;
  }

  create() {
    const dialogRef = this.dialog.open(CrearTipoPagosComponent, {
      data: {
        estado: false,
        title: 'Nuevo Registro'
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listarTipoPagos();
      }
    });
  }

  public editar(id: any) {
    const dialogRef = this.dialog.open(CrearTipoPagosComponent, {
      data: {
        estado: true,
        title: 'Editar Registro',
        id: id
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listarTipoPagos()
      }
    });
  }

  public enableTipoPago(id: any) {
    this.tipoPagosService.enabled(id).subscribe(
      (data: any) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Exito',
          text: data.success,
          showConfirmButton: false,
          timer: 1500
        })
        this.listarTipoPagos();
      },
      (error: any) => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error ',
          text: error.error,
          showConfirmButton: false,
          timer: 1500
        })
        this.listarTipoPagos();
      }
    );
  }

  public delete(id: any) {
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
        this.tipoPagosService.delete(id).subscribe((data: any) => {
          console.log(data);
          this.listarTipoPagos();
          Swal.fire(
            'Eliminado!',
            'Registro eliminado.',
            'success'
          )
          this.listarTipoPagos();
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
          'El registro esta a salvo ',
          'error'
        )
      }
    })
  }
}
