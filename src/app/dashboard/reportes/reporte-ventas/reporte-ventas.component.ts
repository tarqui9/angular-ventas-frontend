import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TokenStorageService } from '@core/authentication/token-storage.service';
import { ReportesService } from '@core/service/reportes.service';
import { UserService } from '@core/service/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImprimirPdfComponent } from '@shared/components/imprimir-pdf/imprimir-pdf.component';

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
  styleUrl: './reporte-ventas.component.scss'
})
export class ReporteVentasComponent {
  public form: FormGroup;

  //Filtro distribuidores
  filteredDistribuidor: any;
  searchControlDistribuidor = new FormControl('');

  public user_id: any = 0;
  fecha_pred: any = new Date();
  formato = this.fecha_pred.toISOString().split('T')[0];
  public fecha_inicio: any = this.formato;
  public fecha_fin: any = this.formato;
  
  public distribuidores: any;
  public distribuciones: any;

  nombreColumnas: string[] = [
    'Nº',
    'Fecha',
    'Estado',
    'Vendedor',
    'Razon Social',
    'Bruto',
    'Neto',
    'Utilidad'
  ];

  paginate!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService,
    private reportesService: ReportesService,
    public tokenStorage: TokenStorageService
  ) { 
    this.createFormFiltros();
  }

  ngOnInit(): void {
    this.listarDistribuidores();
    this.listarReporteDistribuciones();
    // Filtros de búsqueda distribuidor
    this.searchControlDistribuidor.valueChanges.subscribe(searchText => {
      this.filteredDistribuidor = this.distribuidores.filter((distribuidor: any) =>
        distribuidor.nombre_completo.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    this.form.valueChanges.subscribe((data: any) => {
      this.user_id = data?.user_id || '';
      this.fecha_inicio = this.datePipe.transform(data?.fecha_inicio, 'dd-MM-yyyy') || '';
      this.fecha_fin = this.datePipe.transform(data?.fecha_fin, 'dd-MM-yyyy') || '';
      this.listarReporteDistribuciones(this.user_id, this.fecha_inicio, this.fecha_fin)
    })
  }

  createFormFiltros() {
    this.form = this.fb.group({
      user_id: [''],
      fecha_inicio: [new Date()],
      fecha_fin: [new Date()]
    });
  }

  listarDistribuidores() {
    this.userService.getAllVendedores().subscribe((data: any) => {
      console.log('Vendedores: ',data)
      this.distribuidores = data;
      this.filteredDistribuidor = data;
    });
  }

  listarReporteDistribuciones(user_id: any = '', fecha_inicio: any = '', fecha_fin: any = '') {

    const rol_id = this.tokenStorage.getUser().rol_id;

    this.reportesService.getReporteVentas(rol_id, user_id, fecha_inicio, fecha_fin).subscribe(
      data => {
        console.log("CREDITOS REPOR: ", data);
        this.distribuciones = data;

        this.paginate = new MatTableDataSource<any>(this.distribuciones);
        this.paginate.paginator = this.paginator;

        this.distribuciones = this.paginate.filteredData;
      },
      error => {
        console.log(error);
      }
    );
  }

  applyFilters(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.paginate.filter = filterValue.trim().toLowerCase();

    this.distribuciones = this.paginate?.filteredData;
  }

  mostrarPdfDistribuciones() {

    const rol_id = this.tokenStorage.getUser().rol_id;

    this.reportesService.reporteVentasPdf(rol_id, this.user_id, this.fecha_inicio, this.fecha_fin).subscribe((res: any) => {
      const file = new Blob([res], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);

      const modal = this.modalService.open(ImprimirPdfComponent, { size: 'xl' });
      modal.componentInstance.estado = true;
      modal.componentInstance.title = 'Vista previa del Reporte';
      modal.componentInstance.pdfRuta = fileURL;
      modal.result.then((result: any) => {
        if (result) {
          this.listarReporteDistribuciones();
        }
      });
    });
  }

  descargarPdfDistribuciones() {

    const rol_id = this.tokenStorage.getUser().rol_id;

    let nombrePdf = 'reporte_ventas';
    this.reportesService.reporteVentasPdf(rol_id, this.user_id, this.fecha_inicio, this.fecha_fin).subscribe((res: any) => {
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
