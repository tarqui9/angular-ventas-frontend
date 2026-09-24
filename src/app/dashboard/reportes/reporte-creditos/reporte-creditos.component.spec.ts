import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCreditosComponent } from './reporte-creditos.component';

describe('ReporteCreditosComponent', () => {
  let component: ReporteCreditosComponent;
  let fixture: ComponentFixture<ReporteCreditosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteCreditosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteCreditosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
