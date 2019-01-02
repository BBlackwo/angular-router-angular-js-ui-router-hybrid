import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelloNgComponent } from './hello-ng.component';

describe('HelloNgComponent', () => {
  let component: HelloNgComponent;
  let fixture: ComponentFixture<HelloNgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelloNgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelloNgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
