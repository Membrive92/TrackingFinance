import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssetCreate, AssetRead, AssetUpdate } from '../models/asset';

@Injectable({ providedIn: 'root' })
export class AssetsService {
  private http = inject(HttpClient);
  // En dev el proxy reescribe /api -> http://127.0.0.1:8000/v1
  private base = '/api/assets';

  list(): Observable<AssetRead[]> { return this.http.get<AssetRead[]>(this.base); }
  get(id: number): Observable<AssetRead> { return this.http.get<AssetRead>(`${this.base}/${id}`); }
  create(payload: AssetCreate): Observable<AssetRead> { return this.http.post<AssetRead>(this.base, payload); }
  update(id: number, payload: AssetUpdate): Observable<AssetRead> { return this.http.patch<AssetRead>(`${this.base}/${id}`, payload); }
  delete(id: number): Observable<{ ok: boolean }> { return this.http.delete<{ ok: boolean }>(`${this.base}/${id}`); }
}
