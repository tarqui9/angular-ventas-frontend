import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaListaDistribuidoresComponent } from './tabla-lista-distribuidores.component';

describe('TablaListaDistribuidoresComponent', () => {
  let component: TablaListaDistribuidoresComponent;
  let fixture: ComponentFixture<TablaListaDistribuidoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaListaDistribuidoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablaListaDistribuidoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
