import { Component, computed, input, output } from '@angular/core';

import { MaterialRecord, MaterialStatus } from '../../models/material';

interface MaterialHistoryGroup {
  codigo: string;
  descricao: string;
  local: string;
  histories: MaterialRecord[];
}

@Component({
  selector: 'app-material-history-cards',
  imports: [],
  templateUrl: './material-history-cards.html',
  styleUrl: './material-history-cards.sass',
})
export class MaterialHistoryCards {
  readonly materials = input<readonly MaterialRecord[]>([]);
  readonly query = input('');
  readonly status = input<MaterialStatus | ''>('');
  readonly manufacturer = input('');
  readonly loading = input(false);

  readonly addHistory = output<MaterialRecord>();
  readonly editMaterial = output<MaterialRecord>();
  readonly deleteMaterial = output<MaterialRecord>();

  protected readonly groups = computed<MaterialHistoryGroup[]>(() => {
    const query = this.query().trim().toLocaleLowerCase('pt-BR');
    const status = this.status();
    const manufacturer = this.manufacturer();
    const visibleRecords = this.materials().filter((material) => {
      const searchable = [
        material.codigo,
        material.descricao,
        material.fabricante,
        material.marca,
        material.parecer,
      ]
        .join(' ')
        .toLocaleLowerCase('pt-BR');

      return (
        (!query || searchable.includes(query)) &&
        (!status || material.status === status) &&
        (!manufacturer || material.fabricante === manufacturer)
      );
    });

    const grouped = new Map<string, MaterialHistoryGroup>();
    for (const material of visibleRecords) {
      const group = grouped.get(material.codigo);
      if (group) {
        group.histories.push(material);
      } else {
        grouped.set(material.codigo, {
          codigo: material.codigo,
          descricao: material.descricao,
          local: material.local,
          histories: [material],
        });
      }
    }

    return [...grouped.values()]
      .map((group) => ({
        ...group,
        histories: group.histories.sort((a, b) => b.data.localeCompare(a.data)),
      }))
      .sort((a, b) => a.codigo.localeCompare(b.codigo, 'pt-BR', { numeric: true }));
  });

  protected readonly visibleHistoryCount = computed(() =>
    this.groups().reduce((total, group) => total + group.histories.length, 0),
  );

  protected formatDate(value: string): string {
    const [year, month, day] = value.split('-');
    return year && month && day ? `${day}/${month}/${year}` : value;
  }
}
