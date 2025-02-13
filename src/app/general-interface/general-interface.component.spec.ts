import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInterfaceComponent } from './general-interface.component';

describe('GeneralInterfaceComponent', () => {
  let component: GeneralInterfaceComponent;
  let fixture: ComponentFixture<GeneralInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralInterfaceComponent]
    });
    fixture = TestBed.createComponent(GeneralInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
