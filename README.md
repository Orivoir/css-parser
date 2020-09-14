# [css-parser](https://npmjs.com/package/css-parser)

> Command line interface transform css files to javascript object

You want create a app [react-native](https://reactnative.dev/) but write you style inside **javascript object** is not you enjoy
now you can convert **css files** to **javascript object**.

- [installation](#installation)

- [config](#config)

- [usage](#usage)
  - [single file](#single-file)
  - [directory](#directory)
  - [watch](#watch)
  - [es6](#es6)
  - [optimize](#optimize)
- [more](#more)

## installation

**css-parser** should be local install for any project,
**css-parser** work only before prod you can install from *dev dependencies*

```bash
> npm install --save-dev css-parser
```

or with yarn

```bash
> yard add css-parser -D
```

## config

After installation from you **package.json** you should add *script* for access to command line

```json
{
  "scripts": {
    "css-parser": "css-parser"
  }
}
```

For check if access to command is right you can try show version with **--version** option

```bash
> npm run css-parser -- --version
```

# usage

Usage of command line interface is easy and fast,
**css-parser** convert class selector from you css files
as target to you javascript object.

*e.g*

foobar.css
```css

.container {

  width: 80%;
  margin: auto;
  z-index: 3;
}

#footer {

  padding: 12px;
}

```

foobar.js
```js
export default {

  "container": {

    "width": "80%",
    "margin": "auto",
    "zIndex": 3
  }
}
```

Only class selectors is transform,
but if you want ignore a class selector you can define
a annotation inside body style

*e.g*


foobar.css
```css

.container {

  width: 80%;
  margin: auto;
  z-index: 3;
}

.footer {
  /**
  * @CssParser/Ignore
  */
  padding: 12px;
}
```

foobar.js
```js
export default {

  "container": {

    "width": "80%",
    "margin": "auto",
    "zIndex": 3
  }
}
```

Any block styles can be ignore with annotation **@CssParser/Ignore**


### single file

for transform a single file from **command line interface**
you have need relative path of you css file.

```bash
> npm run css-parser -- ./css/foobar.css to ./react-styles/
```

The path **./css/foobar.css** should be exists if the output folder

not exists **css-parser** the create.

After parse you should have **./react-styles/foobar.js** with you *javascript object styles*

### directory

You can easy transform all css files of a folder from **command line interface**
you have need relative path of you folder.

```bash
> npm run css-parser -- ./css/ to ./react-styles/
```

if you folder contains not css files **css-parser** auto skipping file.s

### watch

You can use a watcher integrate for auto parse after changin inside [directory](#directory) or a [single file](#single-file)
add just **--watch** option


below command line **watch** folder **./css/** and write inside **./react-styles/**

```bash
> npm run css-parser -- ./css/ to ./react-styles/ --watch
```

### es6

With the default behavior command line interface generate a exports with
nodejs syntaxe

```js
module.exports = {
  // ...
}
```

if you want use **es6** export you can add option **--es6**

```js

export default {
  // ...
}

```

below command line **watch** and generate **es6** export

```bash
> npm run css-parser -- ./css/ to ./react-styles/ --es6 --watch
```

### optimize

After you phase develop you can generate a minimified styles for optimization run time

```bash
> npm run css-parser -- ./css/ to ./react-styles/ --es6 --optimize
```

## more

During transform of grouped selectors *e.g*
**.a, .b, .c**

**css-parser** persist only the first selector ( **.a** ) and skip all other selectors

During transform of extends selectors *e.g*

**.a .b .c**

**css-parser** replace white space by *underscore* ( **_** ) and remove **dot** for persist unified name style ( **a_b_c** )

*if selector contains operator ( +, >, ~, ... ) **css-parser** persist integrity selector*

**.a + .b > .c** should transform **a_+_b_>_c**

In next minor version a new annotation will added for allow you mannually rename output selector

*e.g*

```css
.a + .b > .c {
  /**
  * @CssParser/Rename("a_b_c")
  */

  padding: 12px;
}
```

```json
{
  "a_b_c": {
    "padding": "12px"
  }
}
```
