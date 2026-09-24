import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaListaDistribucionesComponent } from './tabla-lista-distribuciones.component';

describe('TablaListaDistribucionesComponent', () => {
  let component: TablaListaDistribucionesComponent;
  let fixture: ComponentFixture<TablaListaDistribucionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaListaDistribucionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablaListaDistribucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
