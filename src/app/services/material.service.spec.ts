import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { MaterialPayload } from '../models/material';
import { MaterialService } from './material.service';

describe('MaterialService', () => {
  let service: MaterialService;

  const payload: MaterialPayload = {
    codigo: 'MAT-006',
    descricao: 'Material de teste',
    fabricante: 'Fabricante',
    marca: 'Marca',
    data: '2026-09-30',
    local: 'Laboratório',
    status: 'aprovado',
    parecer: 'Aprovado para prototipação.',
  };

  beforeEach(() => {
    globalThis.localStorage.clear();
    TestBed.configureTestingModule({ providers: [MaterialService] });
    service = TestBed.inject(MaterialService);
  });

  afterEach(() => globalThis.localStorage.clear());

  it('should initialize and list the local materials', async () => {
    const materials = await firstValueFrom(service.list());

    expect(materials.length).toBe(2);
    expect(globalThis.localStorage.getItem('pid-hc.materials.v1')).toBeTruthy();
  });

  it('should create and persist a material', async () => {
    const created = await firstValueFrom(service.create(payload));
    const materials = await firstValueFrom(service.list());

    expect(created.id).toBeTruthy();
    expect(materials).toContainEqual(created);
  });

  it('should update a persisted material', async () => {
    const created = await firstValueFrom(service.create(payload));
    const updatedPayload = { ...payload, descricao: 'Material atualizado' };

    const updated = await firstValueFrom(service.update(created.id, updatedPayload));
    const materials = await firstValueFrom(service.list());

    expect(updated.descricao).toBe('Material atualizado');
    expect(materials.find((material) => material.id === created.id)).toEqual(updated);
  });

  it('should delete a persisted material', async () => {
    const created = await firstValueFrom(service.create(payload));

    await firstValueFrom(service.delete(created.id));
    const materials = await firstValueFrom(service.list());

    expect(materials.some((material) => material.id === created.id)).toBe(false);
  });
});
