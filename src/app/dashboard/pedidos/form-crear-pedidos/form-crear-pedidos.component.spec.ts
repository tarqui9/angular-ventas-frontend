import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCrearPedidosComponent } from './form-crear-pedidos.component';

describe('FormCrearPedidosComponent', () => {
  let component: FormCrearPedidosComponent;
  let fixture: ComponentFixture<FormCrearPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCrearPedidosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCrearPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
