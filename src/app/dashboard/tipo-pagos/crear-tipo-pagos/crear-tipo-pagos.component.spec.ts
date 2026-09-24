import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTipoPagosComponent } from './crear-tipo-pagos.component';

describe('CrearTipoPagosComponent', () => {
  let component: CrearTipoPagosComponent;
  let fixture: ComponentFixture<CrearTipoPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearTipoPagosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearTipoPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
