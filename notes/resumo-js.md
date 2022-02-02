# Resumão do JavaScript moderno

##### EM CONSTRUÇÃO! Atualizado em 1º/FEV/2022

## Nome e origens

A linguagem *JavaScript* foi originalmente desenvolvida pela [Netscape](https://pt.wikipedia.org/wiki/Netscape), mas a Microsoft criou sua própria versão,
a qual batizou de *JScript*, para o Internet Explorer 3.0. No final de 1996, a [Ecma International](https://www.ecma-international.org) começou a trabalhar
na especificação de uma linguagem padrão para todos os browsers. Desde então, o nome oficial da linguagem é **ECMAScript**.

Inicialmente, as versões da linguagem eram identificadas pelo número de sua edição, com siglas como **ES3** (3ª edição, de 1999) ou **ES5** (5ª edição, de 2009).
A partir de 2016, foi adotado um ciclo anual de atualização e as referências pelo ano de lançamento tornaram-se o padrão, como **ES2018** ou **ES2022**.
A 6ª edição, lançada em 2015 (**ES6 / ES2015**), foi a última versão a incorporar grandes mudanças e, portanto, é considerada um marco divisor da linguagem.

?> A versão mais atual da especificação, bem como um breve histórico da linguagem, pode ser encontrada em https://tc39.es/ecma262/

## *Strict mode* [ES5]

O *strict mode*, introduzido no ES5, ativa uma série de validações mais rígidas no interpretador JavaScript, ajudando a evitar comportamentos inesperados e
identificar alguns enganos comuns.

Para ativar o *strict mode* insira a declaração `'use strict';` ou `"use strict";` no início do script, antes de qualquer outra declaração.

```js
'use strict';

function funcaoExemplo() {
	// sem o "strict mode" a declaração abaixo (sem 'let', 'var' ou 'const') cria uma variável GLOBAL!
	a = 5; // com "strict mode" é gerado um ERRO - Uncaught ReferenceError: a is not defined
}

funcaoExemplo();
console.log( a ); // sem o "strict mode" exibe 5
```

Para uma descrição de todas as diferenças do *strict mode*, consulte: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Strict_mode

## Constantes e Variáveis

### `const`

* **Imutável** - o valor deve ser atribuído na declaração, mas objetos podem ter **propriedades adicionadas ou modificadas** após a declaração
* **Escopo de Bloco** - existe dentro do bloco onde for declarada

```js
const max = 5;

max = 10; // ERRO! - Uncaught TypeError: Assignment to constant variable

// Arrays podem ser alteradas por métodos que modificam o objeto original e não requerem nova atribuição

const frutas = [ 'maçã', 'banana' ];

frutas.push( 'laranja' ); // isso funciona!
console.log( frutas ); // [ 'maçã', 'banana', 'laranja' ]

frutas.splice( 0, 1, 'abacate', 'melão' ); // isso também!
console.log( frutas ); // [ 'abacate', 'melão', 'banana', 'laranja' ]

// Propriedades de objetos podem ser adicionadas ou modificadas diretamente

const pessoa = {
	nome: 'Maria',
	idade: 61,
	profissao: 'Professora'
}

if ( pessoa.idade >= 60 ) {
	pessoa.idoso = true; // adiciona nova propriedade
	pessoa.profissao += ' aposentada'; // modifica propriedade existente

	const preferencial = true; // não existe fora do bloco do 'if'
}

console.log( preferencial ); // undefined
console.log( pessoa ); // { nome: 'Maria', idade: 61, profissao: 'Professora aposentada', idoso: true }
```

### `let`

* **Mutável** - pode ser declarada sem valor e ter um valor atribuído posteriormente
* **Escopo de Bloco** - existe dentro do bloco onde for declarada

```js
function funcaoExemplo() {
	let a = 1;
	let b; // neste momento é 'undefined'

	if ( a > 0 ) {
		b = 2; // funciona porque foi declarada no bloco externo
		let c = 3; // só existe dentro do bloco do 'if'
	}

	console.log( a ); // 1
	console.log( b ); // 2
	console.log( c ); // Uncaught ReferenceError: c is not defined
}

funcaoExemplo();
```

### `var`

* **Mutável** - pode ser declarada sem valor e ter um valor atribuído mais tarde
* **Escopo de Função** - existe dentro de toda a **função** onde for declarada, não importa o nível onde estiver a declaração

```js
function funcaoExemplo() {
	try {
		var a = 1; // o escopo de 'var' é a função inteira
		let b = 2; // existe apenas dentro do bloco do 'try'
	}
	catch( e ) {
		throw( e );
	}

	console.log( a ); // 1
	console.log( b ); // ERRO! - Uncaught ReferenceError: b is not defined
}

funcaoExemplo();
```

?> `const`, `let` ou `var` declaradas no **corpo principal** do script (fora de qualquer função) têm escopo **global**.


## Iteração em arrays e objetos

### `for ... in`

* Itera sobre as **propriedades de um objeto**
* Se utilizado em um array retorna os índices do array (0, 1, 2,...)

```js
const pessoa = {
	nome: 'Maria',
	idade: 61,
	profissao: 'Professora'
}

for ( const prop in pessoa ) {
	console.log( prop ); // nome; idade; profissao
	console.log( pessoa[ prop ] ); // 'Maria'; 61; 'Professora'
}

const megasena = [ 3, 18, 25, 37, 44, 51 ];

for ( const nro in megasena ) {
	console.log( nro ); // 0; 1; 2; 3; 4; 5
	console.log( megasena[ nro ] ); // 3; 18; 25; 37; 44; 51
}
```

### `for ... of`

* Itera sobre os **elementos de um array**
* Não funciona com objetos

```js
const pessoa = {
	nome: 'Maria',
	idade: 61,
	profissao: 'Professora'
}

for ( const prop of pessoa ) {
	console.log( prop ); // ERRO! - Uncaught TypeError: pessoa is not iterable
}

const megasena = [ 3, 18, 25, 37, 44, 51 ];

for ( const nro of megasena ) {
	console.log( nro ); // 3, 18, 25, 37, 44, 51
}
```

### *array*`.forEach()`

* Permite executar uma função para cada elemento do array
* É um **método** da classe *Array* - não funciona com outros objetos

```js
const frutas = [ 'maçã', 'banana', 'laranja' ];

frutas.forEach( function( item, index ) { // a função recebe dois parâmetros: o valor e o índice
	console.log( index, item ); // 0,'maçã'; 1,'banana'; 2,'laranja'
});

frutas.forEach( item => console.log( item ) ); // uso compacto com arrow function, sem utilizar o índice
```

### `Object.entries()`

* Retorna um array de arrays, onde o primeiro elemento é o nome da propriedade e o segundo elemento é o valor
* Método **estático** da classe *Object* - sempre chamado na própria classe e não na instância do objeto

```js
const pessoa = {
	nome: 'Maria',
	idade: 61,
	profissao: 'Professora'
}

console.log( Object.entries( pessoa ) ); // [ ['nome', 'Maria'], ['idade', 61], ['profissao', 'Professora'] ]

// Utilizando desestruturação
for ( const [ prop, valor ] of Object.entries( pessoa ) ) {
	console.log( prop + ': ' + valor ); // nome: Maria, idade: 61, profissao: Professora
}
```

## *Destructuring* (desestruturação)

```js
const arrayItem = [ 'maçã', 'vermelha', 'fruta' ];
const [ item, cor ] = arrayItem; // elementos são atribuídos em ordem
// Equivale a:
// const item = arrayItem[0], cor = arrayItem[1];

console.log( item ); // 'maçã'
console.log( cor ); // 'vermelha'

const [ , ,tipo ] = arrayItem;
console.log( tipo ); // 'fruta'
```

```js
const objItem = {
	tipo: 'fruta',
	nome: 'maçã',
	cor: 'vermelha'
}

const { cor, tipo } = objItem; // propriedades são atribuídas por nome

console.log( cor ); // 'vermelha'
console.log( tipo ); // 'fruta'

const { preco, nome } = objItem; // 'preco' não existe no objeto de origem

console.log( nome ); // 'maçã'
console.log( preco ); // undefined
```

### Troca de valores sem variável temporária

```js
let a = 1, b = 2;

[ a, b ] = [ b, a ];

console.log( a, b ); // 2, 1
```

## *Spread syntax* (sintaxe de espalhamento ou expansão)

### Copiar um array ou objeto, evitando atribuição por referência

```js
novoArray = [ ...arrayAntigo ];
novoObjeto = { ...objetoAntigo }; // ES2018
```

```js
let frutas = [ 'maçã', 'banana' ];

let frutasCopia = frutas; // atribui por referência!
let frutasNovas = [ ...frutas ]; // expande o array original e cria um novo array

frutas.push( 'laranja' );

console.log( frutas );      // [ 'maçã', 'banana', 'laranja' ]
console.log( frutasCopia ); // [ 'maçã', 'banana', 'laranja' ]
console.log( frutasNovas ); // [ 'maçã', 'banana' ]
```


### Combinar propriedades de múltiplos objetos em um novo objeto

```js
// cria um novo objeto, expandindo dentro dele os objetos listados
// propriedades com o mesmo nome ficam com o valor declarado por último
novoObjeto = { ...objeto1, ...objeto2, ...objeto3 };
```

Exemplo prático - aplicar valores *default* a propriedades não definidas:

```js
function validaOpcoes( opcoes = {} ) {
	const defaults = {
		min: 0,
		max: 10,
		incr: 1
	}

	return { ...defaults, ...opcoes };
}

console.log( validaOpcoes() ); // { min: 0, max: 10, incr: 1 }
console.log( validaOpcoes( { min: -1, max: 20 } ) ); // { min: -1, max: 20, incr: 1 }
```

## Funções

!> **EM CONSTRUÇÃO**

### Declarações x Expressões

*hoisting*, IIFEs, funções anônimas, parâmetros Rest...

### *Arrow functions*

```js
let obj = {
	i: 10,
	arrowFunction: () => console.log( this.i, this ),
	funcaoPadrao: function() {
		console.log( this.i, this );
	}
}

obj.arrowFunction(); // undefined, Window {...}
obj.funcaoPadrao();  // 10, Object {...}
```
