import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  protected readonly isOpen = signal(false);

  protected open(): void {
    this.isOpen.set(true);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.close();
  }
}
