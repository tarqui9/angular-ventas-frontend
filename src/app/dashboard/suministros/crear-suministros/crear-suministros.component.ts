import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CaracteristicasService } from '@core/service/caracteristicasService.service';
import { CategoriasService } from '@core/service/categorias.service';
// import { ProveedoresService } from '@core/service/proveedores.service';
import { SuministrosService } from '@core/service/suministros.service';
import { UnidadesService } from '@core/service/unidades.service';
import { finalize } from 'rxjs';
import Swal from 'sweetalert2';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CrearCategoriasComponent } from 'app/dashboard/categorias/crear-categorias/crear-categorias.component';
import { CrearUnidadComponent } from 'app/dashboard/unidad/crear-unidad/crear-unidad.component';

@Component({
  selector: 'app-crear-suministros',
  templateUrl: './crear-suministros.component.html',
  styleUrl: './crear-suministros.component.scss'
})
export class CrearSuministrosComponent implements OnInit {

  form: FormGroup;
  suministro_id: any;
  // proveedores: any;
  categorias: any;
  loading: boolean = false;
  control: any;
  imagen: any;
  //unidadesList: any;

  //Filtro categoria
  filteredCategoria: any;
  searchControlCategoria = new FormControl('');

  //searchControlUnidad = new FormControl('');

  /*get unidades(): FormArray {
    return this.form.get('unidades') as FormArray;
  }*/

  constructor(
    private dialog: MatDialog,

    private fb: FormBuilder,
    private categoriaSrvice: CategoriasService,
    //private unidadService: UnidadesService,
    // private proveedoresService: ProveedoresService,
    private suministroService: SuministrosService,
    private route: ActivatedRoute,
    private router: Router,
    // @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.route.paramMap.subscribe(data => {
      this.suministro_id = data.get('id');
    })

    this.listaCategorias();
    //this.listarUnidades();
    // this.listaProveedores();
    this.controles();
    //this.control = <FormArray>this.form.controls['unidades'];

    if (this.suministro_id) {
      this.getById();
    }
  }

  ngOnInit(): void {
    // Filtros de búsqueda categoria
    this.searchControlCategoria.valueChanges.subscribe(searchText => {
      this.filteredCategoria = this.categorias.filter((categoria: any) =>
        categoria.nombre.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }

  getById() {
    this.suministroService.getById(this.suministro_id).subscribe(data => {
      this.form.patchValue({
        ...data
      })
      
      /*data.unidades?.forEach((element, index) => {
        this.sumarControl();
        this.control.controls[index].patchValue({
          factor: element?.factor,
          precio: element?.precio,
          unidad_id: element?.unidad_id
        })
      });*/
    })
  }

  controles() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      codigo: ['',],
      descripcion: [''],
      categoria_id: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0.1)]],
      cantidad_unidades: [1, [Validators.required, Validators.min(1)]],
      //unidades: this.fb.array([]),
      //caracteristicas: this.fb.array([]),
      file: '',
    })
  }

  /*unidadesControls(): FormGroup {
    return this.fb.group({
      factor: ['', Validators.required],
      precio: ['', Validators.required],
      unidad_id: ['', Validators.required]
    })
  }*/

  crearCategoria() {
    const dialogRef = this.dialog.open(CrearCategoriasComponent, {
      data: {
        estado: false,
        title: 'Nuevo Registro'
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listaCategorias();
        this.form.get('categoria_id')?.setValue(result.element.id)
      }
    });
  }

  /*sumarControl() {
    this.unidades.push(this.unidadesControls());
  }
  
  removerControl(index: number) {
    this.unidades.removeAt(index);
  }*/

  listaCategorias() {
    this.categoriaSrvice.getEnabledList().subscribe(data => {
      this.categorias = data;
      this.filteredCategoria = data;
    })
  }

  /*listarUnidades() {
    this.unidadService.getEnabledList().subscribe(data => {
      console.log("Unidades: ", data);
      this.unidadesList = data;
    })
  }*/

  register(form: any) {
    this.loading = true;

    const formData = new FormData();
    formData.append('nombre', this.form.controls['nombre'].value);
    formData.append('codigo', this.form.controls['codigo'].value);
    formData.append('descripcion', this.form.controls['descripcion'].value);
    formData.append('categoria_id', this.form.controls['categoria_id'].value);
    formData.append('precio', this.form.controls['precio'].value);
    formData.append('cantidad_unidades', this.form.controls['cantidad_unidades'].value);

    // Convertir las características a JSON
    /*const unidadesArray = this.unidades.value;
    const unidadesJson = JSON.stringify(unidadesArray);
    formData.append('unidades', unidadesJson);*/

    if (this.imagen) {
      console.log(this.imagen);
      formData.append('file', this.imagen);
    } else {
      formData.append('file', '');
    }
    if (this.suministro_id) {
      formData.append('_method', 'PUT');
      this.suministroService.updatePost(this.suministro_id, formData).pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.loading = false;
        })
      ).subscribe(
        dataE => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: dataE.success,
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/dashboard/suministros']);

        },
        (error: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Ocurrio un problema',
            text: error.error,
          });
          this.loading = false;
        }
      );
    } else {
      this.suministroService.create(formData).pipe(finalize(() => {
        this.form.markAsPristine();
        this.loading = false;
      })
      )
        .subscribe(
          dataR => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: dataR.success,
              text: dataR.success,
              showConfirmButton: false,
              timer: 1500
            });
            this.router.navigate(['/dashboard/suministros']);

          },
          (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Ocurrio un problema',
              text: error.error,
            });
            this.loading = false;

          }
        );
    }

  }

  agregarFoto(data: any) {
    this.form.get('file').setValue(data.url);
    this.imagen = data.file;
    console.log(data)
  }
  cancelar() {
  }
}
