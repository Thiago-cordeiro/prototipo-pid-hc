import { Injectable } from '@angular/core';
import { defer, Observable, of } from 'rxjs';

import { MaterialPayload, MaterialRecord } from '../models/material';

const STORAGE_KEY = 'pid-hc.materials.v1';

const INITIAL_MATERIALS: readonly MaterialRecord[] = [
  {
    id: '3',
    codigo: 'MAT-003',
    descricao: 'Equipo para infusão macrogotas',
    fabricante: 'Hospitalar Brasil',
    marca: 'FluxCare',
    data: '2026-09-18',
    local: 'Centro Cirúrgico',
    status: 'aprovado',
    parecer: 'Amostra conforme os requisitos técnicos.',
  },
  {
    id: '4',
    codigo: 'MAT-004',
    descricao: 'Luva de procedimento sem pó',
    fabricante: 'BioSupply',
    marca: 'ProtecPlus',
    data: '2026-09-15',
    local: 'Pronto Atendimento',
    status: 'reprovado',
    parecer: 'Resistência abaixo do especificado no lote avaliado.',
  },
];

@Injectable({ providedIn: 'root' })
export class MaterialService {
  list(): Observable<MaterialRecord[]> {
    return defer(() => of(this.readMaterials()));
  }

  create(material: MaterialPayload): Observable<MaterialRecord> {
    return defer(() => {
      const materials = this.readMaterials();
      const created: MaterialRecord = { id: this.createId(), ...material };
      this.writeMaterials([...materials, created]);
      return of(created);
    });
  }

  update(id: string, material: MaterialPayload): Observable<MaterialRecord> {
    return defer(() => {
      const materials = this.readMaterials();
      const index = materials.findIndex((item) => item.id === id);
      if (index < 0) throw new Error('Material não encontrado.');

      const updated: MaterialRecord = { id, ...material };
      materials[index] = updated;
      this.writeMaterials(materials);
      return of(updated);
    });
  }

  delete(id: string): Observable<void> {
    return defer(() => {
      const materials = this.readMaterials();
      this.writeMaterials(materials.filter((material) => material.id !== id));
      return of(void 0);
    });
  }

  private readMaterials(): MaterialRecord[] {
    const saved = globalThis.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      const initialMaterials = INITIAL_MATERIALS.map((material) => ({ ...material }));
      this.writeMaterials(initialMaterials);
      return initialMaterials;
    }

    try {
      const materials: unknown = JSON.parse(saved);
      if (!Array.isArray(materials)) throw new Error('Formato de armazenamento inválido.');
      return materials as MaterialRecord[];
    } catch {
      const initialMaterials = INITIAL_MATERIALS.map((material) => ({ ...material }));
      this.writeMaterials(initialMaterials);
      return initialMaterials;
    }
  }

  private writeMaterials(materials: readonly MaterialRecord[]): void {
    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
  }

  private createId(): string {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
