# Userito

Manage users via REST.

Userito could work with users in:
- `~/.userito.json` (path could be overriden with `USERITO_DIR`);
- mongodb database

## Install

`npm i userito -g`

## API

### Initialization
`userito` tackes `options` object with properties:
- `type` (`db` or `file`) and 
- `db` with database url
- database schema

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
