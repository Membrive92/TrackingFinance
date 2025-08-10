import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="container">
      <aside class="sidebar">
        <div class="brand">Finance Tracker</div>
        <nav class="menu">
          <a routerLink="/assets" routerLinkActive="active">Assets</a>
          <a routerLink="/assets/new" routerLinkActive="active">New Asset</a>
          <!-- Añadiremos más (Tx, FX, Import) después -->
        </nav>
      </aside>

      <div class="content">
        <header class="header">
          <h1 class="header-title">Dashboard</h1>
        </header>

        <main class="main">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export default class ShellComponent {}
