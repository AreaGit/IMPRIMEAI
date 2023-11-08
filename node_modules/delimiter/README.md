# Delimiter [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Do%20you%20give%20a%20fRiCk%20about%20an%20Oxford%20comma?%20You%20can%20automatically%20delimit%20your%20arrays%20with%20the%20delimiter%20NPM%20package.&url=https://github.com/CharlesStover/delimiter&via=CharlesStover&hashtags=javascript,programming,webdev,webdeveloper,webdevelopment)

Places delimiters between items in an array.
Defaults to a comma-separated list with an Oxford comma.

[![version](https://img.shields.io/npm/v/delimiter.svg)](http://www.npmjs.com/package/delimiter)
[![minified size](https://img.shields.io/bundlephobia/min/delimiter.svg)](https://www.npmjs.com/package/delimiter)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/delimiter.svg)](https://www.npmjs.com/package/delimiter)
[![downloads](https://img.shields.io/npm/dt/delimiter.svg)](https://www.npmjs.com/package/delimiter)
[![build](https://travis-ci.com/CharlesStover/delimiter.svg)](https://travis-ci.com/CharlesStover/delimiter/)

## Install

* `npm install delimiter --save` or
* `yarn add delimiter`

## Parameters

`delimiter(arr, serial, del)`

#### arr

The array to which you want to add delimiters.

#### serial

The separator for the last item in the array. (default: `and`)

`delimiter([ 1, 2 ], 'or') === [ 1, ' or ', 2 ]);`

`delimiter([ 1, 2, 3 ], 'or') === [ 1, ', ', 2, ', or ', 3 ]`

#### del

The delimiter you want to use. (default: `,`)

```JS
delimiter(
  [ 'Stover, Charles', 'Quisido, Ace', 'Gates, Bill' ],
  'and', ';'
) === [ 'Stover, Charles', '; ', 'Quisido, Ace', '; and ', 'Gates, Bill' ]
```

## Examples

This package was designed to separate React links using an Oxford comma but is extensible to other use cases.

### Arrays with Two Items

```JS
import delimiter from 'delimiter';

// JSX
const myLinks = [
  <CharlesStover />,
  <Quisido />
];

delimiter(myLinks); // [ <CharlesStover />, ' and ', <Quisido /> ]
```

### Arrays with Three or More Items

```JS
import delimiter from 'delimiter';

// JSX
const myLinks = [
  <CharlesStover />,
  <Quisido />,
  <Mtgenius />
];

delimiter(myLinks); // [ <CharlesStover />, ', ', <Quisido />, ', and ', <Mtgenius /> ]
```
