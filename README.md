# Userito

Manage users via REST.

Userito could work with users in:
- `~/.userito.json` (path could be overriden with `USERITO_DIR`);
- mongodb database

## Install

`npm i userito -g`

## API

### Initialization
You should `require` module as usual and then initialize it by options object with two properties: `type` (`db` or `file` which is default) and `db` with String-address of needed database.

```js
var options = {
      type: "db",
      db: "mongodb://userito:userito@dsxxxx.mongolab.com:43942/userito"
    },
    userito = require("userito")(options);
```

#### userito.all(callback)#
Asynchronous method to get all existing users.

#### userito.get(username, callback)#
Asynchronous method to get specific user with such `username`.

#### userito.create(data, callback)#
Asynchronous creating of new unexisting user. `data` should be object with `username`, `password` String-properties.

#### userito.modify(username, data, callback)#
Asynchronous modifying of existing user named with `username`.

#### userito.remove(username, callback)#
Asynchronous removing of specific user.

## License

MIT
