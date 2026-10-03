import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialRecord } from '../../models/material';
import { MaterialHistoryCards } from './material-history-cards';

const histories: MaterialRecord[] = [
  {
    id: '1',
    codigo: 'MAT-001',
    descricao: 'Material de teste',
    fabricante: 'Fabricante A',
    marca: 'Marca aprovada',
    data: '2026-09-30',
    local: 'Laboratório',
    status: 'aprovado',
    parecer: 'Parecer aprovado.',
  },
  {
    id: '2',
    codigo: 'MAT-001',
    descricao: 'Material de teste',
    fabricante: 'Fabricante B',
    marca: 'Marca reprovada',
    data: '2026-09-20',
    local: 'Laboratório',
    status: 'reprovado',
    parecer: 'Parecer reprovado.',
  },
];

describe('MaterialHistoryCards', () => {
  let fixture: ComponentFixture<MaterialHistoryCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialHistoryCards],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialHistoryCards);
    fixture.componentRef.setInput('materials', histories);
    fixture.detectChanges();
  });

  it('should group histories from the same material in one card', () => {
    expect(fixture.nativeElement.querySelectorAll('.material-card').length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('.history-entry').length).toBe(2);
  });

  it('should use the correct opinion colors', () => {
    expect(fixture.nativeElement.querySelectorAll('.history-entry__opinion--approved').length).toBe(
      1,
    );
    expect(fixture.nativeElement.querySelectorAll('.history-entry__opinion--rejected').length).toBe(
      1,
    );
  });
});
