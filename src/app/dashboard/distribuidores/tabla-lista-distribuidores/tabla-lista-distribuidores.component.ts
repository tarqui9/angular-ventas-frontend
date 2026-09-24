import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormCrearDistribuidorComponent } from '../form-crear-distribuidor/form-crear-distribuidor.component';
import { UserService } from '@core/service/user.service';


@Component({
  selector: 'app-tabla-lista-distribuidores',
  templateUrl: './tabla-lista-distribuidores.component.html',
  styleUrl: './tabla-lista-distribuidores.component.scss'
})
export class TablaListaDistribuidoresComponent implements OnInit{

  nombreColumnas: string[] = [
    'Nº',
    'Nombre Completo',
    'Ci',
    'Celular',
    'Email',
    'Movilidad',
    'Acciones'
  ];

  public distribuidores: any;

  paginado!: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dialogConfig?: MatDialogConfig;

  constructor(
    private dialog: MatDialog,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.listarDistribuidores();
  }

  listarDistribuidores() {
    this.userService.getAllDistribuidores().subscribe((data: any) => {
      console.log('Distribuidores: ',data)
      this.distribuidores = data;
      this.paginado = new MatTableDataSource<any>(this.distribuidores);
      this.paginado.paginator = this.paginator;

      this.distribuidores = this.paginado.filteredData;
    });
  }

  applyFilters(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.paginado.filter = filterValue.trim().toLowerCase();

    this.distribuidores = this.paginado.filteredData;
  }

  modalAsignarMovilidad(id: any) {
    const dialogRef = this.dialog.open(FormCrearDistribuidorComponent, {
      data: {
        estado: true,
        title: 'Asignar Distribuidor',
        id: id
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listarDistribuidores()
      }
    });
  }
}
