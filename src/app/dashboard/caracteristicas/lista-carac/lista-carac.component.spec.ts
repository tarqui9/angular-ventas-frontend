import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCaracComponent } from './lista-carac.component';

describe('ListaCaracComponent', () => {
  let component: ListaCaracComponent;
  let fixture: ComponentFixture<ListaCaracComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaCaracComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaCaracComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
