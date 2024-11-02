import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {

  constructor() { }

  validateAllFormFields(formGroup: UntypedFormGroup | UntypedFormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup || control instanceof UntypedFormArray) {
        control.markAsTouched({ onlySelf: true });
        this.validateAllFormFields(control);
      }
    });
  }

  getErrorMessage(formGroup: UntypedFormGroup, fieldName: string) {
    const field = formGroup.get(fieldName) as UntypedFormControl;
    return this.getErrorMessageFromField(field);
  }

  getErrorMessageFromField(field: UntypedFormControl): string {
    if (field?.hasError('required')) {
      return 'Field is required.';
    }

    if (field?.hasError('maxlength') && field.errors) {
      const requiredLength = field.errors['maxlength']['requiredLength'];
      return `Field cannot be more than ${requiredLength} characters long.`;
    }

    if (field?.hasError('minlength') && field.errors) {
      const requiredLength = field.errors['minlength']['requiredLength'];
      return `Field cannot be less than ${requiredLength} characters long.`;
    }

    if (field?.hasError('min') && field.errors) {
      const requiredValue = field.errors['min']['min'];
      return 'Minium value is ' + requiredValue;
    }

    if (field?.hasError('max') && field.errors) {
      const requiredValue = field.errors['max']['max'];
      return 'Maxium value is ' + requiredValue;
    }

    return field['errors'] ? 'Error' : '';
  }
}
/*
Esse método `validateAllFormFields` é uma função em Angular que marca todos os campos de um `FormGroup` ou `FormArray` como "tocados" (*touched*), acionando assim a validação e permitindo que mensagens de erro sejam exibidas no template. Vamos explicar o código linha por linha:

### Explicação Linha por Linha

1. **`validateAllFormFields(formGroup: UntypedFormGroup | UntypedFormArray)`**
   - Declaração do método `validateAllFormFields`, que aceita como parâmetro um `formGroup` do tipo `UntypedFormGroup` ou `UntypedFormArray`.
   - `UntypedFormGroup` e `UntypedFormArray` são tipos de formulários reativos do Angular que podem conter controles de formulário (`UntypedFormControl`) ou grupos de controles (`UntypedFormGroup` e `UntypedFormArray`).

2. **`Object.keys(formGroup.controls).forEach(field => {`**
   - `Object.keys(formGroup.controls)` retorna uma lista com os nomes (chaves) de todos os controles dentro do `formGroup`.
   - `forEach` itera sobre cada campo (`field`) no `formGroup`.

3. **`const control = formGroup.get(field);`**
   - `formGroup.get(field)` obtém o controle de formulário correspondente ao campo atual. Pode ser um `UntypedFormControl`, `UntypedFormGroup` ou `UntypedFormArray`.

4. **`if (control instanceof UntypedFormControl) {`**
   - Verifica se o controle atual é uma instância de `UntypedFormControl`, ou seja, um campo de formulário individual.

5. **`control.markAsTouched({ onlySelf: true });`**
   - Se for um `UntypedFormControl`, ele é marcado como "tocado" usando o método `markAsTouched()`.
   - O parâmetro `{ onlySelf: true }` indica que apenas o controle atual é marcado como tocado, sem afetar seus controles pai.

6. **`} else if (control instanceof UntypedFormGroup || control instanceof UntypedFormArray) {`**
   - Verifica se o controle atual é um `UntypedFormGroup` ou `UntypedFormArray`, ou seja, um grupo de controles de formulário ou uma lista de controles.

7. **`control.markAsTouched({ onlySelf: true });`**
   - O `markAsTouched()` também é chamado para esses controles compostos, marcando-os como tocados.

8. **`this.validateAllFormFields(control);`**
   - Recursivamente chama `validateAllFormFields` para o `control`, garantindo que todos os subcontroles, independentemente de sua profundidade na estrutura do formulário, sejam marcados como tocados.
   - Isso permite a validação de todos os campos aninhados dentro de grupos e arrays de formulário.

9. **`}`** (fechamento dos blocos `if` e `else`)
   - Fecha os blocos de verificação e a função `forEach`.

### Resumo do Comportamento
- **Objetivo**: Marcar todos os campos de um formulário e seus subgrupos como "tocados" para que as mensagens de erro de validação apareçam.
- **Recursividade**: O método é recursivo, então ele percorre toda a estrutura de controles de um `FormGroup` ou `FormArray`, independentemente da profundidade.
- **Marcação de campos**: Quando os campos são marcados como "tocados", os validadores associados são acionados, e os erros de validação ficam visíveis no template.

### Uso Prático
Este método é útil em formulários complexos, onde você deseja forçar a exibição de mensagens de erro em todos os campos ao submeter o formulário pela primeira vez, especialmente quando o usuário não interagiu com todos os campos manualmente.




*/
