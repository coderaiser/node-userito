# Userito [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL]

[NPMIMGURL]: https://img.shields.io/npm/v/userito.svg?style=flat
[BuildStatusURL]: https://github.com/coderaiser/node-userito/actions?query=workflow%3A%22Node+CI%22 "Build Status"
[BuildStatusIMGURL]: https://github.com/coderaiser/node-userito/workflows/Node%20CI/badge.svg
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]: https://npmjs.org/package/node-userito "npm"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"

Manage users from database or json.

Userito could work with users in:

- `json` file
- `mongodb` database

## Install

`npm i userito -g`

## API

### Initialization

`userito` takes `options` object with properties:

- `type` (`db` or `file`) and
- `path` path of storage file (`~/.userito.json` default)
- `db` with database url
- `schema`

```js
const useritoFile = require('userito')({
    type: 'file',
});

const useritoDB = require('userito')({
    type: 'db',
    db: 'mongodb://login:password@dsxxxx.mongolab.com:43942/userito',
    schema: {
        port: Number,
        username: String,
        password: String,
    },
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
    password: 'world',
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
