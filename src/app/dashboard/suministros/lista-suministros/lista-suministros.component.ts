import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

import { FormBajaSuministroComponent } from '../form-baja-suministro/form-baja-suministro.component';
import { SuministrosService } from '@core/service/suministros.service';
import { environment } from 'environments/environment.development';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CategoriasService } from '@core/service/categorias.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-suministros',
  templateUrl: './lista-suministros.component.html',
  styleUrl: './lista-suministros.component.scss'
})
export class ListaSuministrosComponent implements OnInit{
  public categorias: any = [];
  public form: FormGroup;

  nombreColumnas: string[] = [
    'Nº',
    'imagen',
    'Codigo',
    'Nombre',
    'Categoria',
    'Habilitado',
    'Acciones'
  ];

  url = environment.imgUrl
  public suministros: any;

  paginado!: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  dialogConfig?: MatDialogConfig;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriasService, 
    private suministrosService: SuministrosService, 
    private router: Router,
    private dialog: MatDialog
    
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.actualizarIdFilter();
    if (!this.form.value.categoria_id) {
      this.lista();
    }
    this.listarCategorias();
    this.form.valueChanges.subscribe(data => {
      this.lista();
    });
  }
  
  createForm() {
    this.form = this.fb.group({
      categoria_id: [""],
    });
  }

  applyFilters(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.paginado.filter = filterValue.trim().toLowerCase();

    this.suministros = this.paginado?.filteredData;
  }

  actualizarIdFilter() {
    const categoria = localStorage.getItem('filter_productos_list_categoria_id');
    if (categoria) {
      this.form.patchValue({ categoria_id: Number(categoria) });
    }
  }

  listarCategorias() {
    this.categoriaService.getEnabledList().subscribe(data => {
      this.categorias = data;
      this.actualizarIdFilter();
    });
  }

  lista() {
    localStorage.setItem('filter_productos_list_categoria_id', this.form.value.categoria_id);
    this.suministrosService.getAll(this.form.value).subscribe(data=>{
      console.log("SUMINISTROS: ", data);
      this.suministros = data;
      this.paginado = new MatTableDataSource<any>(this.suministros);
      this.paginado.paginator = this.paginator;
    
      this.suministros = this.paginado?.filteredData;
    })
  }

  enableSuministro(id: any) {
    this.suministrosService.enabled(id).subscribe(
      (data: any) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Exito',
          text: data.success,
          showConfirmButton: false,
          timer: 1500
        })
        this.lista();
      },
      error => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error ',
          text: error.error,
          showConfirmButton: false,
          timer: 1500
        })
        this.lista();
      }
    );
  }

  bajaSuministro(id_suministro: any) {
    const dialogRef = this.dialog.open(FormBajaSuministroComponent,{
      data: {
        estado: true,
        title: 'Dar de baja suministro',
        suministro_id: id_suministro
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result){
        this.lista()
      }
    });
  }

  eliminar(id:any){
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
        this.suministrosService.delete(id).subscribe( (data: any) => {
          Swal.fire(
            'Eliminado!',
            data.success,
            'success'
          )
          this.lista();
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
