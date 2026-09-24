import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRolSelectedAuthenticationComponent } from './modal-rol-selected-authentication.component';

describe('ModalRolSelectedAuthenticationComponent', () => {
  let component: ModalRolSelectedAuthenticationComponent;
  let fixture: ComponentFixture<ModalRolSelectedAuthenticationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRolSelectedAuthenticationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalRolSelectedAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
