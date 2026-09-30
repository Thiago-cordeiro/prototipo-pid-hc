import { Component, ElementRef, signal, viewChild } from '@angular/core';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['csv', 'xls', 'xlsx'];

@Component({
  selector: 'app-importacao-tecnovigilancia',
  templateUrl: './importacao-tecnovigilancia.html',
  styleUrl: './importacao-tecnovigilancia.sass',
})
export class ImportacaoTecnovigilancia {
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  protected readonly selectedFile = signal<File | null>(null);
  protected readonly isDragging = signal(false);
  protected readonly importing = signal(false);
  protected readonly feedback = signal('');
  protected readonly errorMessage = signal('');

  protected openFilePicker(): void {
    this.fileInput()?.nativeElement.click();
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);

    if (file) this.setFile(file);
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (!this.importing()) this.isDragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);

    if (this.importing()) return;

    const file = event.dataTransfer?.files.item(0);
    if (file) this.setFile(file);
  }

  protected removeFile(): void {
    this.selectedFile.set(null);
    this.feedback.set('');
    this.errorMessage.set('');
    this.resetFileInput();
  }

  protected importSpreadsheet(): void {
    const file = this.selectedFile();
    if (!file || this.importing()) return;

    this.importing.set(true);
    this.feedback.set('');
    this.errorMessage.set('');

    globalThis.setTimeout(() => {
      this.importing.set(false);
      this.feedback.set(`A planilha “${file.name}” foi enviada para importação.`);
      this.selectedFile.set(null);
      this.resetFileInput();
    }, 700);
  }

  protected formatFileSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
  }

  private setFile(file: File): void {
    this.feedback.set('');

    const extension = file.name.split('.').pop()?.toLocaleLowerCase('pt-BR') ?? '';
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      this.rejectFile('Formato não aceito. Selecione uma planilha XLSX, XLS ou CSV.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      this.rejectFile('O arquivo excede o limite de 10 MB.');
      return;
    }

    this.errorMessage.set('');
    this.selectedFile.set(file);
  }

  private rejectFile(message: string): void {
    this.selectedFile.set(null);
    this.errorMessage.set(message);
    this.resetFileInput();
  }

  private resetFileInput(): void {
    const input = this.fileInput()?.nativeElement;
    if (input) input.value = '';
  }
}
