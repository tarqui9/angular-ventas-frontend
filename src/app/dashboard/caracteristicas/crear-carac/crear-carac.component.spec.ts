import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCaracComponent } from './crear-carac.component';

describe('CrearCaracComponent', () => {
  let component: CrearCaracComponent;
  let fixture: ComponentFixture<CrearCaracComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearCaracComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearCaracComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
