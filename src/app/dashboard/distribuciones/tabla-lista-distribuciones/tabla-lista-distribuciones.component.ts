import { Component, OnInit, ViewChild } from '@angular/core';
import { AgrupadosService } from '@core/service/agrupados.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SucursalesService } from '@core/service/sucursales.service';
import { TokenStorageService } from '@core/authentication/token-storage.service';
import { ClientesService } from '@core/service/clientes.service';
import { PedidosService } from '@core/service/pedidos.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ImprimirPdfComponent } from '@shared/components/imprimir-pdf/imprimir-pdf.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tabla-lista-distribuciones',
  templateUrl: './tabla-lista-distribuciones.component.html',
  styleUrl: './tabla-lista-distribuciones.component.scss'
})
export class TablaListaDistribucionesComponent implements OnInit {

  public distribucionesAgrupadas: any[] = [];

  public form: FormGroup;

  nombreColumnas: string[] = [
    'Nº',
    'Fecha',
    'Estado',
    'Distribuidor',
    'Nro',
    'Cobros',
    'Acciones'
  ];

  public sucursales: any;
  public clientes: any
  public pedidos: any;

  paginate!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private agrupadosService: AgrupadosService,

    private fb: FormBuilder,
    private sucursalesService: SucursalesService,
    private clientesService: ClientesService,
    public tokenStorageService: TokenStorageService,
    private pedidosService: PedidosService,
    private modalService: NgbModal,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.listarDistribuciones();

    /*this.listarSucursales();
    this.listarClientes();
    this.listaPedidos();

    this.form.valueChanges.subscribe(data => {
      const sucursal_id = data?.sucursal_id || '';
      const cliente_id = data?.cliente_id || '';

      this.listaPedidos(sucursal_id, cliente_id)
    });*/
  }

  createForm() {
    this.form = this.fb.group({
      sucursal_id: [''],
      cliente_id: ['']
    });
  }

  public listarDistribuciones() {

    const rol_id = this.tokenStorageService.getUser()?.rol_id;

    this.agrupadosService.getAgrupadosAll('', rol_id).subscribe(
      data => {
        console.log("Agrupados: ", data);
        this.distribucionesAgrupadas = data;

        this.paginate = new MatTableDataSource<any>(this.distribucionesAgrupadas);
        this.paginate.paginator = this.paginator;

        this.distribucionesAgrupadas = this.paginate.filteredData;
      }
    );
  }

  applyFilters(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.paginate.filter = filterValue.trim().toLowerCase();

    this.distribucionesAgrupadas = this.paginate?.filteredData;
  }

  /*listarSucursales() {
    this.sucursalesService.getAll().subscribe(
      data => {
        console.log("Sucursales: ", data);
        this.sucursales = data;
      },
      error => {
        console.log(error);
      }
    );  
  }

  listarClientes() {
    this.clientesService.getAll().subscribe(
      data => {
        console.log("Clientes: ", data);
        this.clientes = data;
      },
      error => {
        console.log(error);
      }
    );  
  }

  listaPedidos(sucursal_id: any = '', cliente_id: any = '') {
    
    const filtro = {
      sucursal_id: sucursal_id,
      cliente_id: cliente_id
    }
    
    this.pedidosService.getAll(filtro).subscribe(data=>{
      console.log("Pedidos: ",data);

      this.pedidos = data;

      this.paginate = new MatTableDataSource<any>(this.pedidos);
      this.paginate.paginator = this.paginator;

      this.pedidos = this.paginate?.filteredData;
    })
    
  }*/

  eliminar(id: any) {
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
        this.agrupadosService.delete(id).subscribe((data: any) => {
          Swal.fire(
            'Eliminado!',
            'Pedido eliminado.',
            'success'
          )
          this.listarDistribuciones();
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
          'Pedido no eliminado',
          'error'
        )
      }
    })
  }

  mostrarPdfPedidosAgrupados(id: any) {
    this.agrupadosService.pdfPedidosAgrupados(id).subscribe((res: any) => {
      const file = new Blob([res], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);

      const modal = this.modalService.open(ImprimirPdfComponent, { size: 'xl' });
      modal.componentInstance.estado = true;
      modal.componentInstance.title = 'Vista previa del Reporte';
      modal.componentInstance.pdfRuta = fileURL;
      modal.result.then((result: any) => {
        if (result) {
          this.listarDistribuciones();
        }
      });
    });
  }

  descargarPdfPedidosAgrupados(id: any) {
    let nombrePdf = 'despacho';
    this.agrupadosService.pdfPedidosAgrupados(id).subscribe((res: any) => {
      const file = new Blob([res], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);

      const despacho =  this.distribucionesAgrupadas.find(item => item?.id === id);
      if(despacho) {
        let fecha = despacho?.fecha; 
        nombrePdf = despacho?.usuario?.nombre_completo+'_'+fecha;
      }

      res.arrayBuffer().then(function (buffer) {
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', `${nombrePdf}.pdf`);
        document.body.appendChild(link);
        link.click();
      });
    }); 
  }

  public verAgrupados(id: any) {
    this.agrupadosService.getById(id).subscribe(
      data => {
        console.log("AG: ", data);
      }
    )
  }

  despacharPedidoAgrupado(id: any) {
    Swal.fire({
      title: '¿Está seguro?',
      text: "¡Esta acción no podrá revertirce!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'primary',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, despachar!',
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.agrupadosService.getDespacharPedido(id).subscribe((data: any) => {
          Swal.fire(
            'Despachado!',
            'Pedido despachado.',
            'success'
          )
          this.listarDistribuciones();
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
          'Pedido no despachado',
          'error'
        )
      }
    })
  }
}
