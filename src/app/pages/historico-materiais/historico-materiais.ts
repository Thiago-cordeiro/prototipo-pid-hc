import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MaterialHistoryCards } from '../../components/material-history-cards/material-history-cards';
import { MaterialPayload, MaterialRecord, MaterialStatus } from '../../models/material';
import { MaterialService } from '../../services/material.service';

const EMPTY_MATERIAL: MaterialPayload = {
  codigo: '',
  descricao: '',
  fabricante: '',
  marca: '',
  data: '',
  local: '',
  status: 'aprovado',
  parecer: '',
};

@Component({
  selector: 'app-historico-materiais',
  imports: [FormsModule, MaterialHistoryCards],
  templateUrl: './historico-materiais.html',
  styleUrl: './historico-materiais.sass',
})
export class HistoricoMateriais implements OnInit {
  private readonly materialService = inject(MaterialService);

  protected readonly filtersOpen = signal(false);
  protected readonly editorOpen = signal(false);
  protected readonly deleteDialogOpen = signal(false);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly deleting = signal(false);
  protected readonly materials = signal<MaterialRecord[]>([]);
  protected readonly editingId = signal<string | null>(null);
  protected readonly addingHistory = signal(false);
  protected readonly materialPendingDeletion = signal<MaterialRecord | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');

  protected readonly manufacturers = computed(() =>
    [...new Set(this.materials().map((material) => material.fabricante))].sort((a, b) =>
      a.localeCompare(b, 'pt-BR'),
    ),
  );

  protected searchTerm = '';
  protected manufacturer = '';
  protected status: MaterialStatus | '' = '';
  protected form: MaterialPayload = { ...EMPTY_MATERIAL };

  ngOnInit(): void {
    this.loadMaterials();
  }

  protected loadMaterials(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.materialService.list().subscribe({
      next: (materials) => {
        this.materials.set(materials);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível acessar os materiais salvos neste navegador.');
        this.loading.set(false);
      },
    });
  }

  protected openFilters(): void {
    this.filtersOpen.set(true);
  }

  protected closeFilters(): void {
    this.filtersOpen.set(false);
  }

  protected createMaterial(): void {
    this.closeFilters();
    this.errorMessage.set('');
    this.editingId.set(null);
    this.addingHistory.set(false);
    this.form = { ...EMPTY_MATERIAL, codigo: this.nextCode(), data: this.today() };
    this.editorOpen.set(true);
  }

  protected createHistory(material: MaterialRecord): void {
    this.closeFilters();
    this.errorMessage.set('');
    this.editingId.set(null);
    this.addingHistory.set(true);
    this.form = {
      ...EMPTY_MATERIAL,
      codigo: material.codigo,
      descricao: material.descricao,
      local: material.local,
      data: this.today(),
    };
    this.editorOpen.set(true);
  }

  protected editMaterial(material: MaterialRecord): void {
    this.closeFilters();
    this.errorMessage.set('');
    this.editingId.set(material.id);
    this.addingHistory.set(false);
    const { id: _, ...payload } = material;
    this.form = { ...payload };
    this.editorOpen.set(true);
  }

  protected closeEditor(): void {
    if (!this.saving()) {
      this.editorOpen.set(false);
    }
  }

  protected saveMaterial(materialForm: NgForm): void {
    if (this.saving()) return;

    if (materialForm.invalid) {
      materialForm.control.markAllAsTouched();
      this.errorMessage.set('Preencha todos os campos obrigatórios para salvar o material.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');
    const id = this.editingId();
    const payload = this.normalizedForm();
    const request = id
      ? this.materialService.update(id, payload)
      : this.materialService.create(payload);

    request.subscribe({
      next: (savedMaterial) => {
        this.materials.update((materials) =>
          id
            ? materials.map((material) =>
                material.id === savedMaterial.id ? savedMaterial : material,
              )
            : [...materials, savedMaterial],
        );
        this.successMessage.set(
          id
            ? 'Histórico atualizado com sucesso.'
            : this.addingHistory()
              ? 'Novo histórico adicionado ao material.'
              : 'Material criado com sucesso.',
        );
        this.saving.set(false);
        this.editorOpen.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'Não foi possível salvar no armazenamento deste navegador. Verifique se o uso do localStorage está permitido.',
        );
        this.saving.set(false);
      },
    });
  }

  protected deleteMaterial(material: MaterialRecord): void {
    this.closeFilters();
    this.materialPendingDeletion.set(material);
    this.deleteDialogOpen.set(true);
  }

  protected closeDeleteDialog(): void {
    if (!this.deleting()) {
      this.deleteDialogOpen.set(false);
      this.materialPendingDeletion.set(null);
    }
  }

  protected confirmDeleteMaterial(): void {
    const material = this.materialPendingDeletion();
    if (!material || this.deleting()) return;

    this.deleting.set(true);
    this.errorMessage.set('');
    this.materialService.delete(material.id).subscribe({
      next: () => {
        this.materials.update((materials) => materials.filter((item) => item.id !== material.id));
        this.successMessage.set('Histórico excluído com sucesso.');
        this.deleting.set(false);
        this.deleteDialogOpen.set(false);
        this.materialPendingDeletion.set(null);
      },
      error: () => {
        this.errorMessage.set('Não foi possível excluir o histórico. Tente novamente.');
        this.deleting.set(false);
        this.deleteDialogOpen.set(false);
        this.materialPendingDeletion.set(null);
      },
    });
  }

  protected clearFilters(): void {
    this.manufacturer = '';
    this.status = '';
  }

  protected applyFilters(): void {
    this.closeFilters();
  }

  protected get activeFilters(): number {
    return Number(Boolean(this.manufacturer)) + Number(Boolean(this.status));
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.deleteDialogOpen()) {
      this.closeDeleteDialog();
    } else if (this.editorOpen()) {
      this.closeEditor();
    } else {
      this.closeFilters();
    }
  }

  private normalizedForm(): MaterialPayload {
    return {
      codigo: this.form.codigo.trim(),
      descricao: this.form.descricao.trim(),
      fabricante: this.form.fabricante.trim(),
      marca: this.form.marca.trim(),
      data: this.form.data,
      local: this.form.local.trim(),
      status: this.form.status,
      parecer: this.form.parecer.trim(),
    };
  }

  private nextCode(): string {
    const lastNumber = this.materials().reduce((highest, material) => {
      const value = Number(material.codigo.match(/\d+/)?.[0] ?? 0);
      return Math.max(highest, value);
    }, 0);

    return `MAT-${String(lastNumber + 1).padStart(3, '0')}`;
  }

  private today(): string {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    return new Date(today.getTime() - offset * 60_000).toISOString().slice(0, 10);
  }
}
