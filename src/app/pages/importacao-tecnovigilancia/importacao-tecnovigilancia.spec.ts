import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportacaoTecnovigilancia } from './importacao-tecnovigilancia';

describe('ImportacaoTecnovigilancia', () => {
  let component: ImportacaoTecnovigilancia;
  let fixture: ComponentFixture<ImportacaoTecnovigilancia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportacaoTecnovigilancia],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportacaoTecnovigilancia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
