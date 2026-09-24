import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSuministrosComponent } from './crear-suministros.component';

describe('CrearSuministrosComponent', () => {
  let component: CrearSuministrosComponent;
  let fixture: ComponentFixture<CrearSuministrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearSuministrosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearSuministrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
