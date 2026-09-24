import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearIngresosMovilComponent } from './crear-ingresos-movil.component';

describe('CrearIngresosMovilComponent', () => {
  let component: CrearIngresosMovilComponent;
  let fixture: ComponentFixture<CrearIngresosMovilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearIngresosMovilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearIngresosMovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
