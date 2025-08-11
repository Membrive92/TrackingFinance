import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-top" aria-live="polite" aria-atomic="true">
      <div class="stack">
        <div
          class="toast-card"
          *ngFor="let t of svc.toasts()"
          [class.ok]="t.type==='success'"
          [class.err]="t.type==='error'"
          [class.info]="t.type==='info'"
          role="alert"
        >
          <div class="row">
            <div class="icon-badge">
              <!-- success -->
              <svg *ngIf="t.type==='success'" viewBox="0 0 24 24" width="16" height="16"
                   fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 7L10 17l-6-6" />
              </svg>
              <!-- error -->
              <svg *ngIf="t.type==='error'" viewBox="0 0 24 24" width="16" height="16"
                   fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 8v6M12 18h.01" />
              </svg>
              <!-- info -->
              <svg *ngIf="t.type==='info'" viewBox="0 0 24 24" width="16" height="16"
                   fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 10v6M12 7h.01" />
              </svg>
            </div>

            <div class="content">
              <div class="title">{{ t.title }}</div>
              <div class="message" *ngIf="t.message">{{ t.message }}</div>
            </div>

            <button class="close" type="button" aria-label="Dismiss" (click)="svc.dismiss(t.id)">×</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-top{
      position:fixed; top:24px; left:50%; transform:translateX(-50%);
      z-index:9999; pointer-events:none;
    }
    .stack{ display:grid; gap:10px; }

    .toast-card{
      width:min(92vw, 560px);
      background:#18241c; color:#e4e6ea; border:1px solid #244a2f; border-radius:12px;
      box-shadow:0 18px 40px rgba(0,0,0,.45);
      padding:14px 16px; pointer-events:auto;
      transform:translateY(-8px); opacity:0; animation:toastIn .18s ease-out forwards;
    }
    @keyframes toastIn { to { transform:translateY(0); opacity:1; } }

    .toast-card.ok   { background:#14261b; border-color:#1f6a34; }
    .toast-card.err  { background:#2b1717; border-color:#6b1f1f; }
    .toast-card.info { background:#162434; border-color:#27527d; }

    /* Row as flex to control spacing tightly */
    .row{
      display:flex; align-items:flex-start; gap:12px;
      line-height:1.25;  /* tighter overall */
    }

    /* Content column with small gap between title and message */
    .content{ display:flex; flex-direction:column; gap:4px; }

    .icon-badge{
      width:28px; height:28px; border-radius:50%;
      display:grid; place-items:center; color:#4ade80;
      background:rgba(34,197,94,.14);
      margin-top:2px; /* align with first line of title */
      flex:0 0 28px;
    }
    .toast-card.err .icon-badge{ color:#fb7185; background:rgba(248,113,113,.14); }
    .toast-card.info .icon-badge{ color:#60a5fa; background:rgba(96,165,250,.14); }

    .title{ font-weight:700; margin:0; }
    .message{ margin:0; color:#a0aec0; font-size:14px; }

    .close{
      width:28px; height:28px; border:0; border-radius:8px;
      background:transparent; color:#cbd5e1; cursor:pointer;
      font-size:18px; line-height:1; display:grid; place-items:center; margin-left:auto;
    }
    .close:hover{ background:rgba(255,255,255,.08); }
  `]
})
export default class ToastContainerComponent {
  svc = inject(ToastService);
}
