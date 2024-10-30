import { Routes } from '@angular/router';
import { ProdutosComponent } from './cardapio/produtos/produtos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'cardapio', pathMatch: 'full' },
  { path: 'cardapio', loadChildren: () => import('./cardapio/cardapio.module').then(m => m.CardapioModule) }
  //lazy loading para melhor desempenho, carregando somente o módulo utilizado a partir do path, facilitando a escalabilidade da aplicação, adiciona novos módulos sem gerar
  //impacto no desempenho

];
