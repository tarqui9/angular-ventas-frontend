import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCrearMovilidadesComponent } from './form-crear-movilidades.component';

describe('FormCrearMovilidadesComponent', () => {
  let component: FormCrearMovilidadesComponent;
  let fixture: ComponentFixture<FormCrearMovilidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCrearMovilidadesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCrearMovilidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
