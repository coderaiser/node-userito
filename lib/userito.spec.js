import {test, stub} from 'supertape';
import {tryCatch} from 'try-catch';
import {tryToCatch} from 'try-to-catch';
import {createUserito} from './userito.js';

test('userito: createUserito: no options', (t) => {
    const [error] = tryCatch(createUserito);
    
    t.equal(error.message, 'options could not be empty!');
    t.end();
});

test('userito: createUserito: unknown type', (t) => {
    const [error] = tryCatch(createUserito, {
        type: 'unknown',
    });
    
    t.equal(error.message, 'options.type could be "file" or "mongo" only!');
    t.end();
});

test('userito: createUserito: mongo, no db', (t) => {
    const [error] = tryCatch(createUserito, {
        type: 'mongo',
    });
    
    t.equal(error.message, 'options.mongo could not be empty!');
    t.end();
});

test('userito: createUserito: mongo: db', (t) => {
    const [error] = tryCatch(createUserito, {
        type: 'mongo',
        mongo: 'mongo://hello',
    });
    
    t.notOk(error);
    t.end();
});

test('userito: all: returns users array', async (t) => {
    const all = stub().returns([{
        username: 'bob',
    }]);
    
    const userito = createUserito({type: 'file'}, {
        users: {
            all,
        },
    });
    
    const users = await userito.all();
    
    t.deepEqual(users, [{
        username: 'bob',
    }]);
    t.end();
});

test('userito: createUserito: file', (t) => {
    const [error] = tryCatch(createUserito, {
        type: 'file',
    });
    
    t.notOk(error);
    t.end();
});

test('userito: get: returns matching user', async (t) => {
    const get = stub().returns({
        username: 'bob',
    });
    
    const userito = createUserito({type: 'file'}, {
        users: {
            get,
        },
    });
    
    const user = await userito.get('bob');
    
    t.equal(user.username, 'bob');
    t.end();
});

test('userito: get: not found, throws', async (t) => {
    const get = stub();
    const userito = createUserito({type: 'file'}, {
        users: {
            get,
        },
    });
    
    const [error] = await tryToCatch(userito.get.bind(userito), 'alice');
    
    t.equal(error.message, 'user with username "alice" not found');
    t.end();
});

test('userito: create: new user, no message', async (t) => {
    const create = stub();
    const userito = createUserito({type: 'file'}, {
        users: {
            create,
        },
    });
    
    const msg = await userito.create({
        username: 'bob',
        password: 'hello',
    });
    
    t.notOk(msg, 'should return no message for new user');
    t.end();
});

test('userito: create: existing user, returns message', async (t) => {
    const create = stub().returns({
        username: 'bob',
    });
    
    const userito = createUserito({type: 'file'}, {
        users: {
            create,
        },
    });
    
    const msg = await userito.create({
        username: 'bob',
        password: 'hello',
    });
    
    t.equal(msg, 'username: "bob" already exist');
    t.end();
});

test('userito: update: backend resolves no user, returns notFound message', async (t) => {
    const update = stub();
    const userito = createUserito({type: 'file'}, {
        users: {
            update,
        },
    });
    
    const msg = await userito.update('alice', {
        password: 'world',
    });
    
    t.equal(msg, 'user with username "alice" not found');
    t.end();
});

test('userito: update: user found, returns success message', async (t) => {
    const update = stub().returns({
        username: 'bob',
    });
    
    const userito = createUserito({type: 'file'}, {
        users: {
            update,
        },
    });
    
    const msg = await userito.update('bob', {
        password: 'world',
    });
    
    t.equal(msg, 'user with username "bob" updated successfully');
    t.end();
});

test('userito: remove: user found, returns success message', async (t) => {
    const remove = stub().resolves({
        username: 'bob',
    });
    
    const userito = createUserito({type: 'file'}, {
        users: {
            remove,
        },
    });
    
    const msg = await userito.remove('bob');
    
    t.equal(msg, 'user with username "bob" removed successfully');
    t.end();
});

test('userito: remove: backend resolves no user, returns notFound message', async (t) => {
    const remove = stub();
    const userito = createUserito({type: 'file'}, {
        users: {
            remove,
        },
    });
    
    const msg = await userito.remove('alice');
    
    t.equal(msg, 'user with username "alice" not found');
    t.end();
});
