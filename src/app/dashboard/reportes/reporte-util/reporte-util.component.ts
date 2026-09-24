import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TokenStorageService } from '@core/authentication/token-storage.service';
import { ReportesService } from '@core/service/reportes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImprimirPdfComponent } from '@shared/components/imprimir-pdf/imprimir-pdf.component';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-reporte-util',
  templateUrl: './reporte-util.component.html',
  styleUrl: './reporte-util.component.scss'
})
export class ReporteUtilComponent implements OnInit {
  public url = environment.imgUrl;
  public listaProductosStock: any;

  nombreColumnas: string[] = [
    'Nº',
    // 'imagen',
    'Codigo',
    'Nombre',
    // 'Precio',
    'Stock',
    'Utilidad'
  ];

  paginate!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private modalService: NgbModal,
    private reportesService: ReportesService,
    public tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    // this.createFormFiltros();
    this.listarReportesStockProductos();
  }

  createFormFiltros() {
    // this.form = this.fb.group({
    //   // user_id: [''],
    //   filter: [2],
    // });
  }

  listarReportesStockProductos() {

    this.reportesService.getReporteUtilidad().subscribe(
      data => {
        console.log("PRODUCTOS UTIL: ", data);
        this.listaProductosStock =  Array.isArray(data) ? data : data || [];

        this.paginate = new MatTableDataSource<any>(this.listaProductosStock);
        this.paginate.paginator = this.paginator;

        this.listaProductosStock = this.paginate.filteredData;
      },
      error => {
        console.log(error);
      }
    );
  }

  applyFilters(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.paginate.filter = filterValue.trim().toLowerCase();

    this.listaProductosStock = this.paginate?.filteredData;
  }

  mostrarPdfStockProductos() {
    this.reportesService.reporteUtilidadPdf().subscribe((res: any) => {
      const file = new Blob([res], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);

      const modal = this.modalService.open(ImprimirPdfComponent, { size: 'xl' });
      modal.componentInstance.estado = true;
      modal.componentInstance.title = 'Vista previa del Reporte';
      modal.componentInstance.pdfRuta = fileURL;
      modal.result.then((result: any) => {
        if (result) {
          this.listarReportesStockProductos();
        }
      });
    });
  }

  descargarPdfStockProductos() {
    let nombrePdf = 'reporte_stock_productos';
    this.reportesService.reporteUtilidadPdf().subscribe((res: any) => {
      const file = new Blob([res], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);

      /*const pedido = this.pedidos.find(item => item?.id === id);
      if (pedido) {
        let fecha = pedido?.fecha;
        nombrePdf = pedido?.razon_social + '_' + fecha;
      }*/

      res.arrayBuffer().then(function (buffer) {
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', `${nombrePdf}.pdf`);
        document.body.appendChild(link);
        link.click();
      });
    });
  }
}
