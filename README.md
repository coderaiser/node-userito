# Userito

Manage users via REST.

Userito could work with users in:
- `~/.userito.json` (path could be overriden with `USERITO_DIR`);
- mongodb database

## Install

`npm i userito -g`

## API

### Initialization
`userito` tackes `options` object with two properties: `type` (`db` or `file`) and `db` with String-address of needed database.

```js
let userito = require('userito')({
    type: 'file'
});

let userito = require('userito')({
    type: 'db',
    db: 'mongodb://login:password@dsxxxx.mongolab.com:43942/userito'
});
```

#### userito.all(callback)#
Get all existing users.

```js
userito.all((error, users, info) => {
    console.log(error || info || users);
});
```
#### userito.get(username, callback)#
Get user by `username`.

```js
userito.get('coderaiser', (error, user, info) => {
    console.log(error || info || users);
});
```

#### userito.create(data, callback)#
Create new user.

```js
userito.create({
    username: 'coderaiser',
    password: 'hello',
}, (error, msg, info) => {
    console.log(error || info || msg);
});
```

#### userito.modify(username, data, callback)#
Asynchronous modifying of existing user named with `username`.

```js
userito.create('coderaiser', {
    password: 'world'
}, (error, msg, info) => {
    console.log(error || info || msg);
});
```

#### userito.remove(username, callback)#
Asynchronous removing of specific user.

```js
userito.remove('coderaiser', (error, info) => {
    console.log(error || info || msg);
});
```

## License

MIT
