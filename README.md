# Userito [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL]

Manage users from database or json.

Userito could work with users in:
- `~/.userito.json` (path could be overriden with `USERITO_DIR`);
- mongodb database

## Install

`npm i userito -g`

## API

### Initialization
`userito` takes `options` object with properties:
- `type` (`db` or `file`) and 
- `path` path of storage file
- `db` with database url
- `schema`

```js
let userito = require('userito')({
    type: 'file'
});

let userito = require('userito')({
    type: 'db',
    db: 'mongodb://login:password@dsxxxx.mongolab.com:43942/userito',
    schema: {
        port: Number,
        username: String,
        password: String
    }
});
```

### userito.all(callback)
Get all existing users.

```js
userito.all((error, users, info) => {
    console.log(error || info || users);
});
```
### userito.get(username, callback)
Get user by `username`.

```js
userito.get('coderaiser', (error, user, info) => {
    console.log(error || info || users);
});
```

### userito.create(data, callback)
Create user.

```js
userito.create({
    username: 'coderaiser',
    password: 'hello',
}, (error, msg) => {
    console.log(error || msg);
});
```

### userito.update(username, data, callback)
Modify user named with `username`.

```js
userito.update('coderaiser', {
    password: 'world'
}, (error, msg) => {
    console.log(error || msg);
});
```

### userito.remove(username, callback)
Remove user.

```js
userito.remove('coderaiser', (error, info) => {
    console.log(error || info || msg);
});
```

## License

MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/userito.svg?style=flat
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/node-userito/master.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/gemnasium/coderaiser/node-userito.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]:                   https://npmjs.org/package/node-userito "npm"
[BuildStatusURL]:           https://travis-ci.org/coderaiser/node-userito  "Build Status"
[DependencyStatusURL]:      https://gemnasium.com/coderaiser/node-userito "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"
