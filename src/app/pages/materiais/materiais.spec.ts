import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Materiais } from './materiais';
import { MaterialService } from '../../services/material.service';
import { MaterialRecord } from '../../models/material';

const material: MaterialRecord = {
  id: '1',
  codigo: 'MAT-001',
  descricao: 'Material de teste',
  fabricante: 'Fabricante',
  marca: 'Marca',
  data: '2026-09-30',
  local: 'Laboratório',
  status: 'aprovado',
  parecer: 'Aprovado para teste.',
};

const materialServiceMock = {
  list: () => of([material]),
  create: () => of(material),
  update: () => of(material),
  delete: () => of(undefined),
};

describe('Materiais', () => {
  let component: Materiais;
  let fixture: ComponentFixture<Materiais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Materiais],
      providers: [{ provide: MaterialService, useValue: materialServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Materiais);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep the free-search input visible in the toolbar', () => {
    const searchInput = fixture.nativeElement.querySelector(
      'input[type="search"]',
    ) as HTMLInputElement;

    expect(searchInput).toBeTruthy();
    expect(searchInput.placeholder).toBe('Pesquisar por código ou nome');
  });

  it('should open and close the lateral filters panel', () => {
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

  it('should open the material creation form', () => {
    const createButton = fixture.nativeElement.querySelector(
      '.materials-toolbar__create',
    ) as HTMLButtonElement;

    createButton.click();
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    expect(modal).toBeTruthy();
    expect(modal.textContent).toContain('Criar material');
  });

  it('should explain why an incomplete material cannot be saved', async () => {
    const createButton = fixture.nativeElement.querySelector(
      '.materials-toolbar__create',
    ) as HTMLButtonElement;

    createButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const saveButton = fixture.nativeElement.querySelector(
      '.material-modal__save',
    ) as HTMLButtonElement;
    saveButton.click();
    fixture.detectChanges();

    const modalError = fixture.nativeElement.querySelector(
      '.material-modal__error',
    ) as HTMLElement;
    expect(modalError.textContent).toContain('Preencha todos os campos obrigatórios');
  });

  it('should open the material edition modal', async () => {
    const editButton = fixture.nativeElement.querySelector(
      '[aria-label="Editar MAT-001"]',
    ) as HTMLButtonElement;

    editButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    expect(modal.textContent).toContain('Editar material');
    expect((modal.querySelector('[name="descricao"]') as HTMLInputElement).value).toBe(
      'Material de teste',
    );
  });

  it('should open a confirmation modal before deleting a material', () => {
    const deleteButton = fixture.nativeElement.querySelector(
      '[aria-label="Excluir MAT-001"]',
    ) as HTMLButtonElement;

    deleteButton.click();
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('[role="alertdialog"]') as HTMLElement;
    expect(modal).toBeTruthy();
    expect(modal.textContent).toContain('Excluir material');
    expect(modal.textContent).toContain('MAT-001 — Material de teste');
  });
});
