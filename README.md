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
import {userito} from 'userito';

const useritoFile = userito({
    type: 'file',
});

const useritoDB = userito({
    type: 'db',
    db: 'mongodb://login:password@dsxxxx.mongolab.com:43942/userito',
    schema: {
        port: Number,
        username: String,
        password: String,
    },
});
```

### all()

Get all existing users.

```js
import {tryToCatch} from 'try-to-catch';

const [error, users] = await tryToCatch(all);
```

### get(username)

Get user by `username`.

```js
import {tryToCatch} from 'try-to-catch';

const [error, users] = await tryToCatch(get, 'coderaiser');
console.log(error || users);
```

### create(data)

Create user.

```js
import {tryToCatch} from 'try-to-catch';

const [error, msg] = await tryToCatch(create, {
    username: 'coderaiser',
    password: 'hello',
});

console.log(error || msg);
```

### update(username, data)

Modify user named with `username`.

```js
import {tryToCatch} from 'try-to-catch';

const [error, msg] = await tryToCatch(update, 'coderaiser', {
    password: 'world',
});

console.log(error || msg);
```

### remove(username)

Remove user.

```js
import {tryToCatch} from 'try-to-catch';

const [error, info] = await tryToCatch(remove, 'coderaiser');
console.log(error || info);
```

## License

MIT
