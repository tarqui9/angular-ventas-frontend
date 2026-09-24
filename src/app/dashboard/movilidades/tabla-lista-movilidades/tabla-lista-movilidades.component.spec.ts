import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaListaMovilidadesComponent } from './tabla-lista-movilidades.component';

describe('TablaListaMovilidadesComponent', () => {
  let component: TablaListaMovilidadesComponent;
  let fixture: ComponentFixture<TablaListaMovilidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaListaMovilidadesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablaListaMovilidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
