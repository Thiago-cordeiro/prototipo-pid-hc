import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { MaterialRecord } from '../../models/material';
import { MaterialService } from '../../services/material.service';
import { HistoricoMateriais } from './historico-materiais';

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

describe('HistoricoMateriais', () => {
  let fixture: ComponentFixture<HistoricoMateriais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoMateriais],
      providers: [{ provide: MaterialService, useValue: materialServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricoMateriais);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should render the history screen', () => {
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain(
      'Histórico de materiais',
    );
    expect(fixture.nativeElement.querySelector('.material-card')).toBeTruthy();
  });

  it('should open a prefilled new-history form', async () => {
    const button = fixture.nativeElement.querySelector(
      '[aria-label="Adicionar novo histórico para Material de teste"]',
    ) as HTMLButtonElement;

    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const modal = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    expect(modal.textContent).toContain('Novo histórico');
    expect((modal.querySelector('[name="codigo"]') as HTMLInputElement).value).toBe('MAT-001');
  });
});
