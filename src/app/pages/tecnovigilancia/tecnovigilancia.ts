import { Component, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface TecnovigilanciaRecord {
  codigo: string;
  data: string;
  produto: string;
  marca: string;
  fabricante: string;
  descricao: string;
}

const RECORDS: readonly TecnovigilanciaRecord[] = [
  {
    codigo: 'TEC-001',
    data: '28/09/2026',
    produto: 'Bomba de infusão volumétrica',
    marca: 'Infusomat',
    fabricante: 'B. Braun',
    descricao: 'Alarme de oclusão acionado durante a infusão, sem dano ao paciente.',
  },
  {
    codigo: 'TEC-002',
    data: '25/09/2026',
    produto: 'Monitor multiparamétrico',
    marca: 'BeneVision',
    fabricante: 'Mindray',
    descricao: 'Oscilação intermitente na leitura da saturação de oxigênio.',
  },
  {
    codigo: 'TEC-003',
    data: '21/09/2026',
    produto: 'Cateter venoso central',
    marca: 'Arrow',
    fabricante: 'Teleflex',
    descricao: 'Dificuldade de progressão do fio-guia identificada durante o procedimento.',
  },
  {
    codigo: 'TEC-004',
    data: '17/09/2026',
    produto: 'Ventilador pulmonar',
    marca: 'Servo-air',
    fabricante: 'Getinge',
    descricao: 'Equipamento apresentou reinicialização inesperada no autoteste.',
  },
  {
    codigo: 'TEC-005',
    data: '12/09/2026',
    produto: 'Seringa descartável 20 ml',
    marca: 'Descarpack',
    fabricante: 'Descarpack',
    descricao: 'Vazamento observado na conexão entre a seringa e o dispositivo.',
  },
];

@Component({
  selector: 'app-tecnovigilancia',
  imports: [FormsModule, RouterLink],
  templateUrl: './tecnovigilancia.html',
  styleUrl: './tecnovigilancia.sass',
})
export class Tecnovigilancia {
  protected readonly filtersOpen = signal(false);

  protected searchTerm = '';
  protected brand = '';
  protected manufacturer = '';

  protected rows(): readonly TecnovigilanciaRecord[] {
    const query = this.searchTerm.trim().toLocaleLowerCase('pt-BR');

    return RECORDS.filter((record) => {
      const matchesQuery =
        !query ||
        record.codigo.toLocaleLowerCase('pt-BR').includes(query) ||
        record.produto.toLocaleLowerCase('pt-BR').includes(query) ||
        record.descricao.toLocaleLowerCase('pt-BR').includes(query);
      const matchesBrand = !this.brand || record.marca === this.brand;
      const matchesManufacturer =
        !this.manufacturer || record.fabricante === this.manufacturer;

      return matchesQuery && matchesBrand && matchesManufacturer;
    });
  }

  protected openFilters(): void {
    this.filtersOpen.set(true);
  }

  protected closeFilters(): void {
    this.filtersOpen.set(false);
  }

  protected clearFilters(): void {
    this.brand = '';
    this.manufacturer = '';
  }

  protected applyFilters(): void {
    this.closeFilters();
  }

  protected get activeFilters(): number {
    return Number(Boolean(this.brand)) + Number(Boolean(this.manufacturer));
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeFilters();
  }
}
