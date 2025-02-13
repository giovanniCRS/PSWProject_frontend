import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProdComponent } from './search-prod.component';

describe('SearchProdComponent', () => {
  let component: SearchProdComponent;
  let fixture: ComponentFixture<SearchProdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchProdComponent]
    });
    fixture = TestBed.createComponent(SearchProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
