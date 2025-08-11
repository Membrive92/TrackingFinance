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
      @if (loading) {
        <!-- Lightweight skeleton while fetching data in edit mode -->
        <div class="skl title"></div>
        <div class="skl line"></div>
        <div class="skl line"></div>
        <div class="skl line"></div>
      } @else {
        <h2 style="margin-top:0">{{ isEdit ? 'Edit Asset' : 'New Asset' }}</h2>

        <form [formGroup]="form" (ngSubmit)="submit()" class="form-grid">
          <!-- Ticker -->
          <label>
            Ticker
            <input class="input" formControlName="ticker" placeholder="MSTY" [disabled]="saving" />
          </label>
          @if (showError('ticker','required')) { <small class="field-error">Ticker is required.</small> }
          @if (showError('ticker','maxlength')) { <small class="field-error">Max length is 20 characters.</small> }

          <!-- Type -->
          <label>
            Type
            <select class="input" formControlName="asset_type" [disabled]="saving">
              <option [value]="AssetType.ETF">ETF</option>
              <option [value]="AssetType.STOCK">STOCK</option>
              <option [value]="AssetType.CRYPTO">CRYPTO</option>
            </select>
          </label>
          @if (showError('asset_type','required')) { <small class="field-error">Type is required.</small> }

          <!-- Current price -->
          <label>
            Current price
            <input class="input" type="number" step="0.01" formControlName="current_price" [disabled]="saving" />
          </label>
          @if (showError('current_price','required')) { <small class="field-error">Price is required.</small> }
          @if (showError('current_price','min')) { <small class="field-error">Price cannot be negative.</small> }

          <!-- Currency -->
          <label>
            Currency
            <select class="input" formControlName="currency" [disabled]="saving">
              <option [value]="Currency.EUR">EUR</option>
              <option [value]="Currency.USD">USD</option>
            </select>
          </label>
          @if (showError('currency','required')) { <small class="field-error">Currency is required.</small> }

          <div class="actions">
            <button class="btn btn-primary" type="submit" [disabled]="form.invalid || saving">
              @if (saving) { <span class="spinner" aria-hidden="true"></span> } {{ isEdit ? 'Save' : 'Create' }}
            </button>
            <a class="btn" routerLink="/assets" [class.btn-disabled]="saving">Cancel</a>
          </div>
        </form>
      }
    </div>
  `,
  styles: [`
    /* Inline skeleton for small loading state */
    .skl{background:linear-gradient(90deg,#1a2231 25%, #233048 37%, #1a2231 63%);
      background-size:400% 100%; animation:shimmer 1.2s ease-in-out infinite; border-radius:8px}
    .skl.title{width:220px;height:18px;margin-bottom:16px}
    .skl.line{height:36px;margin:12px 0}
    @keyframes shimmer{0%{background-position:100% 0}100%{background-position:0 0}}

    /* Tiny loading spinner inside the primary button */
    .spinner{
      width:16px;height:16px;border-radius:50%;
      border:2px solid rgba(255,255,255,.45); border-top-color:#fff;
      margin-right:8px; display:inline-block; vertical-align:-3px;
      animation:spin .6s linear infinite;
    }
    @keyframes spin{to{transform:rotate(360deg)}}

    /* Optional visual for disabled link while saving */
    .btn.btn-disabled{ pointer-events:none; opacity:.6 }
  `]
})
export default class AssetFormComponent implements OnInit {
  // Enum references for the template
  AssetType = AssetType;
  Currency = Currency;

  // UI state
  isEdit = false;
  assetId: number | null = null;
  loading = false; // fetching existing asset (edit mode)
  saving = false;  // submitting create/update
  submitted = false;

  private fb = inject(FormBuilder);
  private api = inject(AssetsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  // Reactive form definition
  form = this.fb.group({
    ticker: ['', [Validators.required, Validators.maxLength(20)]],
    asset_type: [AssetType.ETF, Validators.required],
    current_price: [0, [Validators.required, Validators.min(0)]],
    currency: [Currency.EUR, Validators.required],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.assetId = Number(idParam);
      this.loading = true;
      this.api.get(this.assetId).subscribe({
        next: (a: AssetRead) => {
          this.form.patchValue({
            ticker: a.ticker,
            asset_type: a.asset_type,
            current_price: a.current_price,
            currency: a.currency,
          });
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.toast.error('Failed to load asset', 'Please try again.');
          void this.router.navigateByUrl('/assets');
        },
      });
    }
  }

  /** Whether to show a specific control error */
  showError(control: keyof typeof this.form.controls, errorKey: string): boolean {
    const c = this.form.controls[control];
    return (this.submitted || c.touched || c.dirty) && !!c.errors?.[errorKey];
  }

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.saving = true;

    if (this.isEdit && this.assetId != null) {
      this.api.update(this.assetId, this.form.value as any).subscribe({
        next: () => {
          this.toast.success('Asset updated successfully', 'Changes have been saved.');
          void this.router.navigateByUrl('/assets');
        },
        error: () => this.toast.error('Update failed', 'Please try again in a moment.'),
        complete: () => this.saving = false,
      });
    } else {
      this.api.create(this.form.value as any).subscribe({
        next: () => {
          this.toast.success('Asset created successfully', 'Your new asset has been saved.');
          void this.router.navigateByUrl('/assets');
        },
        error: () => this.toast.error('Creation failed', 'Please verify the fields and try again.'),
        complete: () => this.saving = false,
      });
    }
  }
}
