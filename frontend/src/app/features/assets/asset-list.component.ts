import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AssetsService } from '../../services/assets.service';
import { AssetRead } from '../../models/asset';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h2 style="margin:0">Assets</h2>
        <a class="btn btn-primary" routerLink="new">+ New Asset</a>
      </div>

      @if (assets().length > 0) {
        <table class="table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Ticker</th>
            <th>Type</th>
            <th>Price</th>
            <th>Currency</th>
            <th style="width:210px"></th>
          </tr>
          </thead>
          <tbody>
            @for (a of assets(); track a.id) {
              <tr>
                <td>{{ a.id }}</td>
                <td>{{ a.ticker }}</td>
                <td>{{ a.asset_type }}</td>
                <td>{{ a.current_price }}</td>
                <td>{{ a.currency }}</td>
                <td>
                  <a class="btn" [routerLink]="[a.id, 'edit']">Edit</a>

                  @if (confirmId() === a.id) {
                    <button class="btn btn-danger" (click)="confirmDelete(a.id)">Confirm</button>
                    <button class="btn" (click)="confirmId.set(null)">Cancel</button>
                  } @else {
                    <button class="btn" (click)="askDelete(a.id)">Delete</button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <div class="card" style="background:#121a25;border-style:dashed">
          No assets yet. <a routerLink="new">Create one</a>.
        </div>
      }
    </div>
  `,
  styles: [``]
})
export default class AssetListComponent implements OnInit {
  // Signal holding the table data
  assets = signal<AssetRead[]>([]);
  // ID awaiting delete confirmation; null means no row is in confirm mode
  confirmId = signal<number | null>(null);

  private api = inject(AssetsService);
  private toast = inject(ToastService);

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.api.list().subscribe(res => this.assets.set(res));
  }

  askDelete(id: number): void {
    this.confirmId.set(id);
  }

  confirmDelete(id: number): void {
    this.api.delete(id).subscribe({
      next: () => {
        this.toast.success('Asset deleted successfully', 'The asset has been removed from your portfolio.');
        this.confirmId.set(null);
        this.load();
      },
      error: () => this.toast.error('Delete failed', 'Please try again in a moment.'),
    });
  }
}
