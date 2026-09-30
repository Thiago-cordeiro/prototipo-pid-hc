import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Table } from './table';

describe('Table', () => {
  let component: Table;
  let fixture: ComponentFixture<Table>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table],
    }).compileComponents();

    fixture = TestBed.createComponent(Table);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the requested material columns', () => {
    const headings = Array.from(
      fixture.nativeElement.querySelectorAll('th'),
      (heading: Element) => heading.textContent?.trim(),
    );

    expect(headings).toEqual([
      'Código',
      'Nome',
      'Fabricante',
      'Marca',
      'Data',
      'Local',
      'Status',
      'Parecer',
      'Ações',
    ]);
  });
});
