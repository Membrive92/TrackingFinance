import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AssetsService } from '../../services/assets.service';
import { AssetRead } from '../../models/asset';

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

      <ng-container *ngIf="assets().length; else empty">
        <table class="table">
          <thead>
            <tr><th>ID</th><th>Ticker</th><th>Type</th><th>Price</th><th>Currency</th><th></th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of assets()">
              <td>{{a.id}}</td>
              <td>{{a.ticker}}</td>
              <td>{{a.asset_type}}</td>
              <td>{{a.current_price}}</td>
              <td>{{a.currency}}</td>
              <td><button class="btn" (click)="remove(a.id)">Delete</button></td>
            </tr>
          </tbody>
        </table>
      </ng-container>

      <ng-template #empty>
        <div class="card" style="background:#121a25;border-style:dashed">
          No assets yet. <a routerLink="new">Create one</a>.
        </div>
      </ng-template>
    </div>
  `,
  styles: [``]
})


export default class AssetListComponent implements OnInit {
  private api = inject(AssetsService);
  assets = signal<AssetRead[]>([]);

  ngOnInit(){ this.load(); }
  load(){ this.api.list().subscribe(res => this.assets.set(res)); }

  remove(id: number) {
    if (!confirm('Delete this asset?')) return;
    this.api.delete(id).subscribe(() => this.load());
  }
}
