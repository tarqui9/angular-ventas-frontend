import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaSuministrosComponent } from './lista-suministros.component';

describe('ListaSuministrosComponent', () => {
  let component: ListaSuministrosComponent;
  let fixture: ComponentFixture<ListaSuministrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaSuministrosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaSuministrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
