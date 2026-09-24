import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCrearDistribuidorComponent } from './form-crear-distribuidor.component';

describe('FormCrearDistribuidorComponent', () => {
  let component: FormCrearDistribuidorComponent;
  let fixture: ComponentFixture<FormCrearDistribuidorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCrearDistribuidorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCrearDistribuidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
