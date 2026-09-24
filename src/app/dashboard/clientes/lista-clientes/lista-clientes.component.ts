import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ClientesService } from '@core/service/clientes.service';
import Swal from 'sweetalert2';
import { CrearClientesComponent } from '../crear-clientes/crear-clientes.component';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrl: './lista-clientes.component.scss'
})
export class ListaClientesComponent implements OnInit {

  isMobile: boolean = false;
  clientes: any;

  nombreColumnas: string[] = [
    'Nº',
    'Nombre del Contacto',
    'Celular',
    'Razón Social',
    'Nit CI',
    'Teléfono',
    'Dirección',
    'Acciones'
  ];

  paginado!: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private clientService: ClientesService,
    private dialog: MatDialog
  ) { }
  ngOnInit(): void {

    this.listaClientes();
  }


  listaClientes() {
    
    this.clientService.getAll().subscribe(data => {
      console.log("CLIENTES: ", data);
      this.clientes = data;

      this.paginado = new MatTableDataSource<any>(this.clientes);
      this.paginado.paginator = this.paginator;

      // Sincroniza los datos filtrados con la vista de tarjetas
      this.clientes = this.paginado.filteredData;
  
    });
  }

  editar(id: any) {
    const dialogRef = this.dialog.open(CrearClientesComponent, {
      width: '900px',
      data: {
        estado: true,
        title: 'Editar Registro',
        id: id
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaClientes()
      }
    });
  }

  create() {
    const dialogRef = this.dialog.open(CrearClientesComponent, {
      width: '900px',
      data: {
        estado: false,
        title: 'Nuevo Registro'
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaClientes()
      }
    });
  }

  applyFilters(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.paginado.filter = filterValue.trim().toLowerCase();

    // Actualiza la lista de usuarios con los datos filtrados
    this.clientes = this.paginado.filteredData;
  }

  deleteClient(id: any) {
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
        this.clientService.delete(id).subscribe((data: any) => {
          Swal.fire(
            'Eliminado!',
            'Cliente eliminado.',
            'success'
          )
          this.listaClientes();
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
  }
}
