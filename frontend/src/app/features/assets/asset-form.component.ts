import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AssetsService } from '../../services/assets.service';
import { AssetType, Currency } from '../../models/asset';

@Component({
  selector: 'app-asset-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="card">
      <h2 style="margin-top:0">New Asset</h2>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form-grid">
        <label>
          Ticker
          <input class="input" formControlName="ticker" placeholder="MSTY" />
        </label>

        <label>
          Type
          <select class="input" formControlName="asset_type">
            <option [value]="AssetType.ETF">ETF</option>
            <option [value]="AssetType.STOCK">STOCK</option>
            <option [value]="AssetType.CRYPTO">CRYPTO</option>
          </select>
        </label>

        <label>
          Current price
          <input class="input" type="number" step="0.01" formControlName="current_price" />
        </label>

        <label>
          Currency
          <select class="input" formControlName="currency">
            <option [value]="Currency.EUR">EUR</option>
            <option [value]="Currency.USD">USD</option>
          </select>
        </label>

        <div class="actions">
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Create</button>
          <a class="btn" routerLink="/assets">Cancel</a>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export default class AssetFormComponent {
  AssetType = AssetType;
  Currency = Currency;

  private fb = inject(FormBuilder);
  private api = inject(AssetsService);
  private router = inject(Router);

  form = this.fb.group({
    ticker: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
    asset_type: [AssetType.ETF, Validators.required],
    current_price: [0, [Validators.required, Validators.min(0)]],
    currency: [Currency.EUR, Validators.required],
  });

  submit() {
    if (this.form.invalid) return;
    this.api.create(this.form.value as any).subscribe({
      next: () => this.router.navigateByUrl('/assets'),
      error: (err) => console.error('Create failed', err)
    });
  }
}
