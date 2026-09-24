import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVentaProductosComponent } from './reporte-venta-productos.component';

describe('ReporteVentaProductosComponent', () => {
  let component: ReporteVentaProductosComponent;
  let fixture: ComponentFixture<ReporteVentaProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteVentaProductosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteVentaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
