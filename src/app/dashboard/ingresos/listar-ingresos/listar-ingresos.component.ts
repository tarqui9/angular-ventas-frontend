import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IngresosService } from '@core/service/ingresos.service';
import { SearchService } from '@core/service/search.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImprimirPdfComponent } from '@shared/components/imprimir-pdf/imprimir-pdf.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-ingresos',
  templateUrl: './listar-ingresos.component.html',
  styleUrl: './listar-ingresos.component.scss'
})
export class ListarIngresosComponent implements OnInit {
  total: any;
  nombreColumnas: string[] = [
    'Nº',
    // 'Usuario',
    'Nro. Factura',
    'Fecha',
    'Proveedor',
    'Acciones'
  ];

  public ingresos: any;
  ingresosFiltrados: any[] = [];

  paginate!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private ingresosService:IngresosService,
    private modalService: NgbModal,
    private searchService: SearchService
  ) {
  }

  ngOnInit(): void {
    this.listaIngresos();
  }

  listaIngresos(filter?:any) {
    this.ingresosService.getAll({
      'fecha_inicio': filter?.fecha_inicio,
      'fecha_fin': filter?.fecha_fin
    }).subscribe(data=>{
      console.log(data);

      this.ingresos = data;
      this.total = this.ingresos.reduce((acumulador, item) => acumulador + item.total, 0);

      this.paginate = new MatTableDataSource<any>(this.ingresos);
      this.paginate.paginator = this.paginator;

      this.ingresos = this.paginate?.filteredData;
    })
    
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
        this.ingresosService.delete(id).subscribe( (data: any) => {
          Swal.fire(
            'Eliminado!',
            'Rgistro eliminado.',
            'success'
          )
          this.listaIngresos();
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

  applyFilters(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const filteredData = this.searchService.filterData(this.ingresos, filterValue);
    this.paginate.data = filteredData;
  }

  mostrarPdf(id: any){
    this.ingresosService.pdfIngresos(id).subscribe((res: any) => {
      const file = new Blob([res], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);

      const modal = this.modalService.open(ImprimirPdfComponent, {size:'xl'});
      modal.componentInstance.estado = true;
      modal.componentInstance.title = 'Vista previa del Reporte';
      modal.componentInstance.pdfRuta = fileURL;
      modal.result.then((result: any) => {
        if (result) {
          this.listaIngresos();       
         }
      });
    });
  }

}
