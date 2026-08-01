import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CategorieFerme, ProduitFerme, CategorieMenu, Plat, Boisson, Commande, ContactMessage } from '../models/produit.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  private extractResults<T>(res: any): T[] {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.results)) return res.results;
    return [];
  }

  getCategoriesFerme(): Observable<CategorieFerme[]> {
    return this.http.get<any>(`${this.baseUrl}/ferme/categories/`).pipe(
      map(res => this.extractResults<CategorieFerme>(res)),
      catchError(() => of([]))
    );
  }

  getProduitsFerme(categorieSlug?: string): Observable<ProduitFerme[]> {
    let params = new HttpParams();
    if (categorieSlug && categorieSlug !== 'tous') {
      params = params.set('categorie__slug', categorieSlug);
    }
    return this.http.get<any>(`${this.baseUrl}/ferme/produits/`, { params }).pipe(
      map(res => this.extractResults<ProduitFerme>(res)),
      catchError(() => of([]))
    );
  }

  getCategoriesMenu(): Observable<CategorieMenu[]> {
    return this.http.get<any>(`${this.baseUrl}/menu/categories/`).pipe(
      map(res => this.extractResults<CategorieMenu>(res)),
      catchError(() => of([]))
    );
  }

  getPlats(categorieSlug?: string): Observable<Plat[]> {
    let params = new HttpParams();
    if (categorieSlug && categorieSlug !== 'tous') {
      params = params.set('categorie__slug', categorieSlug);
    }
    return this.http.get<any>(`${this.baseUrl}/menu/plats/`, { params }).pipe(
      map(res => this.extractResults<Plat>(res)),
      catchError(() => of([]))
    );
  }

  getBoissons(): Observable<Boisson[]> {
    return this.http.get<any>(`${this.baseUrl}/menu/boissons/`).pipe(
      map(res => this.extractResults<Boisson>(res)),
      catchError(() => of([]))
    );
  }

  createCommande(commande: Commande): Observable<any> {
    return this.http.post(`${this.baseUrl}/commandes/`, commande).pipe(
      catchError(err => {
        console.warn('API commande fallback', err);
        return of({ success: true, offline: true });
      })
    );
  }

  createContactMessage(message: ContactMessage): Observable<any> {
    return this.http.post(`${this.baseUrl}/contact/`, message).pipe(
      catchError(err => {
        console.warn('API contact fallback', err);
        return of({ success: true, offline: true });
      })
    );
  }
}
