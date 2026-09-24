import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCrearPedidosMovilComponent } from './form-crear-pedidos-movil.component';

describe('FormCrearPedidosMovilComponent', () => {
  let component: FormCrearPedidosMovilComponent;
  let fixture: ComponentFixture<FormCrearPedidosMovilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCrearPedidosMovilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCrearPedidosMovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
