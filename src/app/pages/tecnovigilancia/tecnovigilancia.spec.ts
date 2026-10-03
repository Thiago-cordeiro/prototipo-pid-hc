import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Tecnovigilancia } from './tecnovigilancia';

describe('Tecnovigilancia', () => {
  let component: Tecnovigilancia;
  let fixture: ComponentFixture<Tecnovigilancia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tecnovigilancia],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Tecnovigilancia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the six requested columns', () => {
    const columns = Array.from(
      fixture.nativeElement.querySelectorAll('thead th') as NodeListOf<HTMLElement>,
    ).map((column) => column.textContent?.trim());

    expect(columns).toEqual(['Código', 'Data', 'Produto', 'Marca', 'Fabricante', 'Descrição']);
  });

  it('should filter records using the search field', () => {
    const searchInput = fixture.nativeElement.querySelector(
      'input[type="search"]',
    ) as HTMLInputElement;

    searchInput.value = 'ventilador';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Ventilador pulmonar');
  });

  it('should open and close the filters panel', () => {
    const filterButton = fixture.nativeElement.querySelector(
      '[aria-label="Abrir filtros"]',
    ) as HTMLButtonElement;

    filterButton.click();
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.filters-panel') as HTMLElement;
    expect(panel.classList.contains('filters-panel--open')).toBe(true);

    const closeButton = panel.querySelector('[aria-label="Fechar filtros"]') as HTMLButtonElement;
    closeButton.click();
    fixture.detectChanges();

    expect(panel.classList.contains('filters-panel--open')).toBe(false);
  });
});
