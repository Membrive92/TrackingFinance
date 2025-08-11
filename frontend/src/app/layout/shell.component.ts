import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import ToastContainerComponent from '../ui/toast-container.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ToastContainerComponent],
  template: `
    <div class="container">
      <aside class="sidebar">
        <div class="brand">
          <span class="logo">FT</span>
          <div>Finance Tracker</div>
        </div>

        <nav class="nav">
          <!-- OVERVIEW -->
          <div class="nav-group">
            <div class="nav-label">OVERVIEW</div>
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
              <span class="icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 20V10M10 20V4M16 20v-7M3 20h18" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <span>Dashboard</span>
            </a>
          </div>

          <!-- TRANSACTIONS (header only for now) -->
          <div class="nav-group">
            <div class="nav-label">TRANSACTIONS</div>
          </div>

          <!-- INVESTMENTS -->
          <div class="nav-group">
            <div class="nav-label">INVESTMENTS</div>
            <a routerLink="/assets" routerLinkActive="active" class="nav-item">
              <span class="icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="3" y="7" width="18" height="13" rx="2"/>
                  <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"/>
                </svg>
              </span>
              <span>Assets</span>
            </a>
          </div>

          <!-- PLANNING (header only for now) -->
          <div class="nav-group">
            <div class="nav-label">PLANNING</div>
          </div>

          <!-- TOOLS (header only for now) -->
          <div class="nav-group">
            <div class="nav-label">TOOLS</div>
          </div>
        </nav>
      </aside>

      <div class="content">
        <header class="header"><h1 class="header-title">Finance Tracker</h1></header>
        <main class="main"><router-outlet></router-outlet></main>
      </div>
    </div>

    <app-toast-container />
  `
})
export default class ShellComponent {}
