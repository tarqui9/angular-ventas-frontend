import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBajaSuministroComponent } from './form-baja-suministro.component';

describe('FormBajaSuministroComponent', () => {
  let component: FormBajaSuministroComponent;
  let fixture: ComponentFixture<FormBajaSuministroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBajaSuministroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormBajaSuministroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
