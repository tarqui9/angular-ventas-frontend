import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportesService } from '@core/service/reportes.service';
import { ImprimirPdfComponent } from '@shared/components/imprimir-pdf/imprimir-pdf.component';
import { TokenStorageService } from '@core/authentication/token-storage.service';
import { environment } from 'environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reporte-stock-productos',
  templateUrl: './reporte-stock-productos.component.html',
  styleUrl: './reporte-stock-productos.component.scss'
})
export class ReporteStockProductosComponent implements OnInit {
  public form: FormGroup;

  public url = environment.imgUrl;
  public listaProductosStock: any;

  nombreColumnas: string[] = [
    'Nº',
    // 'imagen',
    'Categoria',
    'Codigo',
    'Nombre',
    'Precio',
    'Stock',
    'Cantidad Unidades',
    'Acciones',
  ];

  paginate!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  options = [
    { id: 1, name: 'Todos' },
    { id: 2, name: 'Solo con stock' },
    { id: 3, name: 'Stock 0' },
  ];

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private reportesService: ReportesService,
    public tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.createFormFiltros();
    this.listarReportesStockProductos();

    this.form.valueChanges.subscribe((data: any) => {
      this.listarReportesStockProductos();
    })
  }

  createFormFiltros() {
    this.form = this.fb.group({
      // user_id: [''],
      filter: [2],
    });
  }

  listarReportesStockProductos() {

    this.reportesService.getReporteStockProductos(this.form.get('filter').value).subscribe(
      data => {
        console.log("PRODUCTOS STOCK: ", data);
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
    this.reportesService.reporteStockProductosPdf(this.form.get('filter').value).subscribe((res: any) => {
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
    this.reportesService.reporteStockProductosPdf(this.form.get('filter').value).subscribe((res: any) => {
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

  mostrarPdf(id) {
    this.reportesService.reporteDetalleVentaProductoPdf(id).subscribe((res: any) => {
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
}
