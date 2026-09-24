import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  /**
   * Filtra una lista de objetos con base en un término de búsqueda.
   * Permite buscar dentro de propiedades anidadas.
   * @param data Array de objetos a filtrar.
   * @param searchTerm Término de búsqueda.
   * @returns Array filtrado con los objetos que coincidan.
   */
  filterData<T>(data: T[], searchTerm: string): T[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return data;
    }

    searchTerm = searchTerm.trim().toLowerCase();

    return data.filter(item => this.objectContainsSearchTerm(item, searchTerm));
  }

  /**
   * Verifica si un objeto (incluyendo propiedades anidadas) contiene el término de búsqueda.
   * @param obj Objeto a evaluar.
   * @param searchTerm Término de búsqueda.
   * @returns true si el objeto contiene el término.
   */
  private objectContainsSearchTerm(obj: any, searchTerm: string): boolean {
    if (typeof obj === 'string') {
      return obj.toLowerCase().includes(searchTerm);
    }

    if (typeof obj === 'number') {
      return obj.toString().includes(searchTerm);
    }

    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).some(value => this.objectContainsSearchTerm(value, searchTerm));
    }

    return false;
  }
}
