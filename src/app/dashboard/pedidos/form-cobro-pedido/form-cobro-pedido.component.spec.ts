import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCobroPedidoComponent } from './form-cobro-pedido.component';

describe('FormCobroPedidoComponent', () => {
  let component: FormCobroPedidoComponent;
  let fixture: ComponentFixture<FormCobroPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCobroPedidoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCobroPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
