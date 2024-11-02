import { computed, effect, Injectable, signal } from '@angular/core';

import { Product } from '../products/product';
import { CartItem } from './cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems = signal<CartItem[]>([]);

  cartCount = computed(() => this.cartItems().reduce((acc, curr) => acc + curr.quantity, 0));

  cartSubTotal = computed(() => this.cartItems().reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0));

  // calculate tax of 8% on top of the subtotal
  cartTax = computed(() => this.cartSubTotal() * 0.08);

  cartTotal = computed(() => this.cartSubTotal() + this.cartTax());




  e = effect(() => console.log('cartCount updated', this.cartCount()));
  i = effect(() => console.log('cartItems updated', this.cartItems()));


  addProduct(product: Product): void {
    const indexFound = this.cartItems().findIndex((p) => p.product.id === product.id);
    if (indexFound >= 0) {
      const cartItem = this.cartItems()[indexFound];
      cartItem.quantity += 1;
      this.updateCartQuantity(cartItem);
      //this.cartItems.mutate((items) => items[indexFound].quantity += 1);
    } else {
      //this.cartItems.mutate((items) => items.push({ product, quantity: 1 }));
      this.cartItems.update((items) => [...items, { product, quantity: 1 }]);
    }
  }

  updateCartQuantity(cartItem: CartItem): void {
    const indexFound = this.cartItems().findIndex((p) => p.product.id === cartItem.product.id);
    if (indexFound >= 0) {
      this.cartItems.update((items) => items.map((p) => p.product.id === cartItem.product.id ? cartItem : p));
    }
  }

  removeProduct(product: Product): void {
    this.cartItems.update((items) => items.filter((p) => p.product.id !== product.id));
  }

}


/*
  Vamos explicar cada método presente no código:

1. **`cartItems = signal<CartItem[]>([]);`**
   - Este código cria uma variável reativa chamada `cartItems` usando a função `signal()`. Ela é inicializada como um array vazio do tipo `CartItem[]`.
   - `signal()` é um conceito de reatividade em Angular que cria uma variável que pode ser monitorada para mudanças. Quando `cartItems` é atualizado (por exemplo, itens são adicionados ou removidos), qualquer cálculo ou componente que dependa dela será notificado automaticamente para reagir às alterações.
   - Tipo `CartItem[]` significa que essa variável armazena uma lista de objetos do tipo `CartItem`, que provavelmente tem propriedades como `quantity` e `product`.

2. **`cartCount = computed(() => this.cartItems().reduce((acc, curr) => acc + curr.quantity, 0));`**
   - A variável `cartCount` é criada com a função `computed()`, que é usada para definir um valor derivado e reativo.
   - Ela calcula o número total de itens no carrinho. O método `reduce()` é usado para iterar sobre o array de `cartItems` e somar as quantidades de cada item (`curr.quantity`).
   - O `reduce()` começa com `acc` (acumulador) inicializado em 0 e vai somando o valor de `curr.quantity` de cada item do array.
   - Como é envolvido em um `computed()`, `cartCount` é automaticamente recalculado toda vez que `cartItems` muda.

3. **`cartSubTotal = computed(() => this.cartItems().reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0));`**
   - `cartSubTotal` também é criado com `computed()`, calculando o subtotal do carrinho.
   - A função `reduce()` soma o total de preços de todos os itens multiplicados pela quantidade (`curr.quantity * curr.product.price`).
   - O acumulador `acc` é inicializado em 0 e acumula o resultado da multiplicação da quantidade pelo preço de cada produto no array `cartItems`.
   - Assim como `cartCount`, o valor de `cartSubTotal` é recalculado automaticamente sempre que `cartItems` é alterado.

### Resumo
- **`signal<CartItem[]>([])`**: cria uma lista reativa de itens no carrinho.
- **`computed()`**: calcula valores derivados automaticamente.
- **`cartCount`**: soma a quantidade total de itens no carrinho.
- **`cartSubTotal`**: calcula o valor total do carrinho com base nas quantidades e preços dos produtos.

Com isso, essas variáveis reativas e computadas mantêm a interface do usuário atualizada de forma eficiente e automática conforme o estado do carrinho muda.


Vamos detalhar o que os efeitos (`effect`) fazem e como esses dois exemplos funcionam:

1. **`e = effect(() => console.log('cartCount updated', this.cartCount()));`**
   - A variável `e` está associada a um efeito criado pela função `effect()`.
   - A função `effect()` é usada em Angular para monitorar sinais e variáveis derivadas e executar uma função sempre que houver uma mudança nelas.
   - Neste caso, o efeito registra no console a mensagem `'cartCount updated'` seguida pelo valor atual de `cartCount`.
   - Sempre que `cartItems` (a lista de itens do carrinho) for modificada, o `cartCount` será recalculado, o que acionará o `effect()` e imprimirá a mensagem no console.
   - Isso é útil para depuração, permitindo verificar quando e como `cartCount` é atualizado.

2. **`i = effect(() => console.log('cartItems updated', this.cartItems()));`**
   - A variável `i` está associada a outro efeito criado pela função `effect()`.
   - Este efeito imprime a mensagem `'cartItems updated'` seguida pelo conteúdo atual de `cartItems` no console.
   - Sempre que `cartItems` for atualizado (por exemplo, se itens forem adicionados ou removidos), este `effect()` é acionado e a mensagem é exibida no console.
   - Como `cartItems` é um `signal`, ele possui um método de leitura (`this.cartItems()`) que retorna seu valor atual. Este valor é passado para `console.log()` para visualização.

### Resumo
- **`effect()`**: é uma função que permite reagir a mudanças em sinais ou variáveis derivadas. Quando os valores monitorados por ele mudam, a função passada para `effect()` é executada.
- **`e`**: imprime no console toda vez que `cartCount` é recalculado devido a uma mudança em `cartItems`.
- **`i`**: imprime no console toda vez que `cartItems` é atualizado.

Esses efeitos ajudam a monitorar mudanças em tempo real no estado de uma aplicação, o que é útil para fins de depuração e observação do comportamento da aplicação durante o desenvolvimento.

  */
