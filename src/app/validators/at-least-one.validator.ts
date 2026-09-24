import { AbstractControl, ValidationErrors } from '@angular/forms';

// Validador personalizado
export function atLeastOne(control: AbstractControl): ValidationErrors | null {
  const formArray = control as any; // Asume que es un FormArray
  return formArray.controls.length > 0 ? null : { atLeastOne: true };
}