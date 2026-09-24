import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTipoPagosComponent } from './lista-tipo-pagos.component';

describe('ListaTipoPagosComponent', () => {
  let component: ListaTipoPagosComponent;
  let fixture: ComponentFixture<ListaTipoPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaTipoPagosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaTipoPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
