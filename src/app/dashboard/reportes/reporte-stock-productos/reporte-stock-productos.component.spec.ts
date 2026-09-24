import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteStockProductosComponent } from './reporte-stock-productos.component';

describe('ReporteStockProductosComponent', () => {
  let component: ReporteStockProductosComponent;
  let fixture: ComponentFixture<ReporteStockProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteStockProductosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteStockProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
