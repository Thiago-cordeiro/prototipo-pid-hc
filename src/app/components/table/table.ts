import { Component, computed, input, output } from '@angular/core';

import { MaterialRecord, MaterialStatus } from '../../models/material';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.sass',
})
export class Table {
  readonly materials = input<readonly MaterialRecord[]>([]);
  readonly query = input('');
  readonly status = input<MaterialStatus | ''>('');
  readonly manufacturer = input('');
  readonly loading = input(false);

  readonly editMaterial = output<MaterialRecord>();
  readonly deleteMaterial = output<MaterialRecord>();

  protected readonly rows = computed(() => {
    const query = this.query().trim().toLocaleLowerCase('pt-BR');
    const status = this.status();
    const manufacturer = this.manufacturer();

    return this.materials().filter((material) => {
      const matchesQuery =
        !query ||
        material.codigo.toLocaleLowerCase('pt-BR').includes(query) ||
        material.descricao.toLocaleLowerCase('pt-BR').includes(query);
      const matchesStatus = !status || material.status === status;
      const matchesManufacturer = !manufacturer || material.fabricante === manufacturer;

      return matchesQuery && matchesStatus && matchesManufacturer;
    });
  });

  protected formatDate(value: string): string {
    const [year, month, day] = value.split('-');
    return year && month && day ? `${day}/${month}/${year}` : value;
  }
}
