import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SucursalesService } from '@core/service/sucursales.service';
import { ClientesService } from '@core/service/clientes.service';
import { PedidosService } from '@core/service/pedidos.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ImprimirPdfComponent } from '@shared/components/imprimir-pdf/imprimir-pdf.component';
import { TokenStorageService } from '@core/authentication/token-storage.service';
import Swal from 'sweetalert2';

import { ActivatedRoute } from '@angular/router';
import { AgrupadosService } from '@core/service/agrupados.service';
import { FormCobroPedidoComponent } from '../form-cobro-pedido/form-cobro-pedido.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tabla-pedidos',
  templateUrl: './tabla-pedidos.component.html',
  styleUrl: './tabla-pedidos.component.scss'
})
export class TablaPedidosComponent implements OnInit {

  public pedido_id: any;
  public form: FormGroup;

  nombreColumnas: string[] = [
    'Nº',
    'Fecha',
    'Razon Social',
    'Nit',
    //'Sucursal',
    'Tipo Pago',
    'Total',
    'Pagado',
    'Cobros',
    'Deuda',
    'Estado',
    'Acciones'
  ];

  public sucursales: any;
  public clientes: any
  public pedidos: any;
  public agrupado: any;

  paginate!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private sucursalesService: SucursalesService,
    private clientesService: ClientesService,
    private pedidosService: PedidosService,
    private modalService: NgbModal,
    public tokenSorage: TokenStorageService,

    private route: ActivatedRoute,
    private agrupadosService: AgrupadosService,
    public dialog: MatDialog
  ) {
    this.createForm();
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe((paramMap: any) => {
      this.pedido_id = paramMap.get('id');

      if (this.pedido_id) {
        this.listarPedidosAgrupados();
      } else {
        this.listaPedidos();
      }
    })

    this.listarSucursales();
    this.listarClientes();

    this.form.valueChanges.subscribe(data => {
      const sucursal_id = data?.sucursal_id || '';

      if (!this.pedido_id) {
        this.listaPedidos(sucursal_id)
      }
    });
  }

  createForm() {
    this.form = this.fb.group({
      sucursal_id: [''],
      cliente_id: [''],
      tipo: [''],
      fecha_inicio: [new Date()],
      fecha_fin: [new Date()],
    });
  }

  listarSucursales() {
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

  listaPedidos(sucursal_id: any = '') {

    const rol = this.tokenSorage.getUser()?.rol_id;
    const cliente_id = this.form.get('cliente_id').value || '';
    const tipo = this.form.get('tipo').value || '';
    const fecha_inicio = this.datePipe.transform(this.form.get('fecha_inicio').value, 'yyyy-MM-dd') || '';
    const fecha_fin = this.datePipe.transform(this.form.get('fecha_fin').value, 'yyyy-MM-dd') || '';
    
    const filtro = {
      sucursal_id: sucursal_id,
      cliente_id: cliente_id,
      tipo: tipo,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
      rol_id: rol
    }

    this.pedidosService.getAll(filtro).subscribe(data => {
      console.log("Pedidos: ", data);

      this.pedidos = data;

      this.paginate = new MatTableDataSource<any>(this.pedidos);
      this.paginate.paginator = this.paginator;

      this.pedidos = this.paginate?.filteredData;
    })

  }

  listarPedidosAgrupados() {
    this.agrupadosService.getById(this.pedido_id).subscribe(
      data => {
        console.log("AGRUPADOS", data);
        this.agrupado = data;
        this.pedidos = data?.pedidos;

        this.paginate = new MatTableDataSource<any>(this.pedidos);
        this.paginate.paginator = this.paginator;

        this.pedidos = this.paginate?.filteredData;
      },
      error => {
        console.log(error);
      }
    );
  }

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
        this.pedidosService.delete(id).subscribe((data: any) => {
          Swal.fire(
            'Eliminado!',
            'Pedido eliminado.',
            'success'
          )
          this.listaPedidos();
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

  eliminarAgrupado(id: any) {
    Swal.fire({
      title: '¿Está seguro?',
      text: "¡Esta acción no podrá revertirce!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'primary',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, quitar!',
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.agrupadosService.quitarDetalle(id).subscribe((data: any) => {
          Swal.fire(
            'Realizado!',
            'Pedido quitado.',
            'success'
          )
          this.listarPedidosAgrupados();
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
          'Pedido no quitado',
          'error'
        )
      }
    })
  }

  devolverPedido(id: any) {
    Swal.fire({
      title: '¿Está seguro de devolver este pedido?',
      text: "¡Esta acción no podrá revertirce!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'primary',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, devolver!',
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.agrupadosService.devolverPedido(id).subscribe((data: any) => {
          Swal.fire(
            'Realizado!',
            'Pedido devuelto.',
            'success'
          )
          this.listarPedidosAgrupados();
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
          'Pedido no devuelto',
          'error'
        )
      }
    })
  }

  entregarPedido(id: any) {
    Swal.fire({
      title: '¿Está seguro de entregar este pedido?',
      text: "¡Esta acción no podrá revertirce!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'primary',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, entregar!',
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.agrupadosService.entregarPedido(id).subscribe((data: any) => {
          Swal.fire(
            'Realizado!',
            'Pedido entregado.',
            'success'
          )
          this.listarPedidosAgrupados();
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
          'Pedido no entregado',
          'error'
        )
      }
    })
  }

  applyFilters(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.paginate.filter = filterValue.trim().toLowerCase();

    this.pedidos = this.paginate?.filteredData;
  }

  mostrarPdfPedido(id: any) {
    this.pedidosService.pdfPedido(id).subscribe((res: any) => {
      const file = new Blob([res], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);

      const modal = this.modalService.open(ImprimirPdfComponent, { size: 'xl' });
      modal.componentInstance.estado = true;
      modal.componentInstance.title = 'Vista previa del Reporte';
      modal.componentInstance.pdfRuta = fileURL;
      modal.result.then((result: any) => {
        if (result) {
          this.listaPedidos();
        }
      });
    });
  }

  descargarPdfPedidos(id: any) {
    let nombrePdf = 'pedido';
    this.pedidosService.pdfPedido(id).subscribe((res: any) => {
      const file = new Blob([res], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);

      const pedido =  this.pedidos.find(item => item?.id === id);
      if(pedido) {
        let fecha = pedido?.fecha; 
        nombrePdf = pedido?.razon_social+'_'+fecha;
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

  modalCobrosPedido(id: any) {
    const dialogRef = this.dialog.open(FormCobroPedidoComponent, {
      data: {
        estado: true,
        title: 'Realizar Cobro',
        id: id
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.pedido_id) {
          this.listarPedidosAgrupados();
        } else {
          this.listaPedidos();
        }
      }
    });
  }

}
