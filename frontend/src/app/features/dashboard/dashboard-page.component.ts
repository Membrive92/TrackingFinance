import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2 style="margin-top:0">Dashboard</h2>
      <p class="muted">Overview coming soon. For now, manage your assets from the sidebar.</p>
    </div>
  `,
  styles: []
})
export default class DashboardPageComponent {}
