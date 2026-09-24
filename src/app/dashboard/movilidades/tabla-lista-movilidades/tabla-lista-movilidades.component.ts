import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { FormCrearMovilidadesComponent } from '../form-crear-movilidades/form-crear-movilidades.component';
import { MovilidadesService } from '@core/service/movilidades.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-tabla-lista-movilidades',
  templateUrl: './tabla-lista-movilidades.component.html',
  styleUrl: './tabla-lista-movilidades.component.scss'
})
export class TablaListaMovilidadesComponent implements OnInit {

  public url = environment.imgUrl;
  public movilidades: any;

  nombreColumnas: string[] = [
    'Nº',
    'Foto',
    'Placa',
    'Descripcion',
    'Color',
    'Habilitado',
    'Acciones'
  ];

  paginado!: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dialogConfig?: MatDialogConfig;

  constructor(
    private dialog: MatDialog,
    private movilidadesService: MovilidadesService
  ) { }

  ngOnInit(): void {
    this.listarMovilidades();
  }

  listarMovilidades() {
    this.movilidadesService.getAll().subscribe((data: any) => {
      console.log("Movilidades: ", data);
      this.movilidades = data;
      this.paginado = new MatTableDataSource<any>(this.movilidades);
      this.paginado.paginator = this.paginator;

      this.movilidades = this.paginado.filteredData;
    });
  }

  applyFilters(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.paginado.filter = filterValue.trim().toLowerCase();

    this.movilidades = this.paginado.filteredData;
  }

  create() {
    const dialogRef = this.dialog.open(FormCrearMovilidadesComponent, {
      data: {
        estado: false,
        title: 'Nuevo Registro'
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listarMovilidades();
      }
    });
  }

  editar(id: any) {
    const dialogRef = this.dialog.open(FormCrearMovilidadesComponent, {
      data: {
        estado: true,
        title: 'Editar Registro',
        id: id
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listarMovilidades()
      }
    });
  }

  enableMovilidad(id: any) {
    this.movilidadesService.enabled(id).subscribe(
      (data: any) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Exito',
          text: data.success,
          showConfirmButton: false,
          timer: 1500
        })
        this.listarMovilidades();
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
        this.listarMovilidades();
      }
    );
  }

  delete(id: any) {
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
        this.movilidadesService.delete(id).subscribe((data: any) => {
          console.log(data);
          this.listarMovilidades();
          Swal.fire(
            'Eliminado!',
            'Registro eliminado.',
            'success'
          )
          this.listarMovilidades();
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
