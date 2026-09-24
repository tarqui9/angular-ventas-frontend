import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDistribucionesComponent } from './reporte-distribuciones.component';

describe('ReporteDistribucionesComponent', () => {
  let component: ReporteDistribucionesComponent;
  let fixture: ComponentFixture<ReporteDistribucionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteDistribucionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteDistribucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
