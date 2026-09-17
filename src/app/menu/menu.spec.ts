import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Menu } from './menu';

describe('Menu', () => {
  let component: Menu;
  let fixture: ComponentFixture<Menu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu],
    }).compileComponents();

    fixture = TestBed.createComponent(Menu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should expose publication books for the menu', () => {
  //   expect(component.publicationBooks.length).toBeGreaterThan(0);
  //   expect(component.publicationBooks[0].title).toContain('Yoga');

  //   const text = fixture.nativeElement.textContent;
  //   expect(text).toContain(component.publicationBooks[0].title);
  // });
});
