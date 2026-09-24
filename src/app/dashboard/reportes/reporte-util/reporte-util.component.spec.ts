import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteUtilComponent } from './reporte-util.component';

describe('ReporteUtilComponent', () => {
  let component: ReporteUtilComponent;
  let fixture: ComponentFixture<ReporteUtilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteUtilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
