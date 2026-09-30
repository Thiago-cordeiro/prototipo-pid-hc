import { Routes } from '@angular/router';
import { Materiais } from './pages/materiais/materiais';
import { ImportacaoTecnovigilancia } from './pages/importacao-tecnovigilancia/importacao-tecnovigilancia';
import { Tecnovigilancia } from './pages/tecnovigilancia/tecnovigilancia';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tecnovigilancia' },
  { path: 'tecnovigilancia', component: Tecnovigilancia },
  { path: 'tecnovigilancia/importar', component: ImportacaoTecnovigilancia },
  { path: 'materiais', component: Materiais },
  { path: '**', redirectTo: 'tecnovigilancia' },
];
