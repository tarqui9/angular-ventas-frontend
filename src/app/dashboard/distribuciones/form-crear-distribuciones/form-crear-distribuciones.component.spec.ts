import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCrearDistribucionesComponent } from './form-crear-distribuciones.component';

describe('FormCrearDistribucionesComponent', () => {
  let component: FormCrearDistribucionesComponent;
  let fixture: ComponentFixture<FormCrearDistribucionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCrearDistribucionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCrearDistribucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
