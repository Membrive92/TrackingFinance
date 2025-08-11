import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message: string;
  ms: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private seq = 0;
  toasts = signal<Toast[]>([]);

  /** Show a toast with custom type, title and message. */
  show(type: ToastType, title: string, message = '', ms = 2800) {
    const id = ++this.seq;
    this.toasts.update(v => [...v, { id, type, title, message, ms }]);
    // Auto-dismiss
    setTimeout(() => this.dismiss(id), ms);
  }

  /** Convenience helpers */
  success(title: string, message = '', ms?: number) { this.show('success', title, message, ms); }
  error(title: string, message = '', ms?: number)   { this.show('error',   title, message, ms); }
  info(title: string, message = '', ms?: number)    { this.show('info',    title, message, ms); }

  /** Remove a toast by id. */
  dismiss(id: number) {
    this.toasts.update(v => v.filter(t => t.id !== id));
  }

  /** Remove all toasts. */
  clear() { this.toasts.set([]); }
}
