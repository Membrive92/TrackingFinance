import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AssetsService } from '../../services/assets.service';
import { AssetType, Currency, AssetRead } from '../../models/asset';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-asset-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="card">
      <h2 style="margin-top:0">{{ isEdit ? 'Edit Asset' : 'New Asset' }}</h2>

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
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid">
            {{ isEdit ? 'Save' : 'Create' }}
          </button>
          <a class="btn" routerLink="/assets">Cancel</a>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export default class AssetFormComponent implements OnInit {
  AssetType = AssetType; Currency = Currency;

  private fb = inject(FormBuilder);
  private api = inject(AssetsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  isEdit = false;
  assetId: number | null = null;

  form = this.fb.group({
    ticker: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
    asset_type: [AssetType.ETF, Validators.required],
    current_price: [0, [Validators.required, Validators.min(0)]],
    currency: [Currency.EUR, Validators.required],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.assetId = Number(idParam);
      this.api.get(this.assetId).subscribe((a: AssetRead) => {
        this.form.patchValue({
          ticker: a.ticker,
          asset_type: a.asset_type,
          current_price: a.current_price,
          currency: a.currency,
        });
      });
    }
  }

  submit() {
    if (this.form.invalid) return;

    if (this.isEdit && this.assetId != null) {
      this.api.update(this.assetId, this.form.value as any).subscribe({
        next: () => {
          this.toast.success('Asset updated successfully', 'Changes have been saved.');
          this.router.navigateByUrl('/assets');
        },
        error: () => this.toast.error('Update failed', 'Please try again in a moment.'),
      });
    } else {
      this.api.create(this.form.value as any).subscribe({
        next: () => {
          this.toast.success('Asset created successfully', 'Your new asset has been saved.');
          this.router.navigateByUrl('/assets');
        },
        error: () => this.toast.error('Creation failed', 'Please verify the fields and try again.'),
      });
    }
  }

}
