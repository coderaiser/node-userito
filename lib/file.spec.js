import {test, stub} from 'supertape';
import {tryCatch} from 'try-catch';
import {tryToCatch} from 'try-to-catch';
import {
    _createFile,
    createFile,
    File,
} from './file.js';

const schema = {
    username: 'string',
    password: 'string',
};

test('userito: file: _createFile: ENOENT creates file', (t) => {
    const error = Error('x');
    
    error.code = 'ENOENT';
    const filePath = '/hello.json';
    
    const read = stub().throws(error);
    const write = stub();
    
    _createFile(filePath, {
        read,
        write,
    });
    
    t.calledWith(write, [
        filePath,
        [],
    ]);
    t.end();
});

test('userito: file: _createFile: file exists, no error', (t) => {
    const filePath = '/hello.json';
    
    const read = stub().returns({});
    const write = stub();
    
    _createFile(filePath, {
        read,
        write,
    });
    
    t.notCalled(write);
    t.end();
});

test('userito: file: _createFile: ENOENT write fails', (t) => {
    const error = Error('write failed');
    const filePath = '/hello.json';
    const enoent = Error('not found');
    
    enoent.code = 'ENOENT';
    const read = stub().throws(enoent);
    const write = stub().throws(error);
    
    const [caught] = tryCatch(_createFile, filePath, {
        read,
        write,
    });
    
    t.equal(caught.message, 'write failed');
    t.end();
});

test('userito: file: _createFile: non-ENOENT error does not write', (t) => {
    const filePath = '/hello.json';
    const read = stub().throws(Error('permission denied'));
    const write = stub();
    
    _createFile(filePath, {
        read,
        write,
    });
    
    t.notCalled(write);
    t.end();
});

test('userito: file: createFile: uses custom path', (t) => {
    const read = stub().returns([]);
    const write = stub();
    const file = createFile('/custom/path.json', schema, {
        read,
        write,
    });
    
    t.equal(file._path, '/custom/path.json');
    t.end();
});

test('userito: file: createFile: uses untildified path', (t) => {
    const read = stub().returns([]);
    const write = stub();
    const file = createFile('~/mydir/users.json', schema, {
        read,
        write,
    });
    
    t.ok(file._path.endsWith('/mydir/users.json'));
    t.end();
});

test('userito: file: createFile: uses default path when no path given', (t) => {
    const read = stub().returns([]);
    const write = stub();
    const file = createFile(null, schema, {
        read,
        write,
    });
    
    t.ok(file._path.endsWith('.userito.json'));
    t.end();
});

test('userito: file: createFile: returns File instance', (t) => {
    const read = stub().returns([]);
    const write = stub();
    const file = createFile('/custom.json', schema, {
        read,
        write,
    });
    
    t.ok(file instanceof File);
    t.end();
});

test('userito: file: createFile: passes overrides to _createFile', (t) => {
    const read = stub().returns([]);
    const write = stub();
    const file = createFile('/custom.json', schema, {
        read,
        write,
    });
    
    t.ok(file, 'should not throw');
    t.end();
});

test('userito: file: all: returns users array', async (t) => {
    const read = stub().returns([{
        username: 'hello',
    }]);
    
    const file = new File('/custom.json', schema);
    
    const result = await file.all({
        read,
    });
    
    t.deepEqual(result, [{
        username: 'hello',
    }]);
    t.end();
});

test('userito: file: all: calls read with path', async (t) => {
    const read = stub().returns([]);
    const file = new File('/custom.json', schema);
    
    await file.all({
        read,
    });
    
    t.calledWith(read, ['/custom.json']);
    t.end();
});

test('userito: file: get: finds user by username', async (t) => {
    const users = [{
        username: 'hello',
    }, {
        username: 'world',
    }];
    
    const read = stub().returns(users);
    const file = new File('/custom.json', schema);
    
    const result = await file.get('hello', {
        read,
    });
    
    t.deepEqual(result, {
        username: 'hello',
    });
    t.end();
});

test('userito: file: get: returns undefined when not found', async (t) => {
    const users = [{
        username: 'hello',
    }];
    
    const read = stub().returns(users);
    const file = new File('/custom.json', schema);
    
    const result = await file.get('notfound', {
        read,
    });
    
    t.notOk(result);
    t.end();
});

test('userito: file: get: skips null items', async (t) => {
    const users = [null, {
        username: 'hello',
    }];
    
    const read = stub().returns(users);
    const file = new File('/custom.json', schema);
    
    const result = await file.get('hello', {
        read,
    });
    
    t.deepEqual(result, {
        username: 'hello',
    });
    t.end();
});

test('userito: file: create: adds new user', async (t) => {
    const read = stub().returns([]);
    const write = stub();
    const file = new File('/custom.json', schema);
    
    const result = await file.create({username: 'hello', password: '123'}, {
        read,
        write,
    });
    
    t.notOk(result);
    t.end();
});

test('userito: file: create: calls write with new user', async (t) => {
    const read = stub().returns([]);
    const write = stub();
    const file = new File('/custom.json', schema);
    
    await file.create({username: 'hello', password: '123'}, {
        read,
        write,
    });
    
    t.calledWith(write, ['/custom.json', [{
        username: 'hello',
        password: '123',
    }]]);
    t.end();
});

test('userito: file: create: returns existing user', async (t) => {
    const existing = [{
        username: 'hello',
        password: '123',
    }];
    
    const read = stub().returns(existing);
    const write = stub();
    const file = new File('/custom.json', schema);
    
    const result = await file.create({username: 'hello', password: '456'}, {
        read,
        write,
    });
    
    t.deepEqual(result, {
        username: 'hello',
        password: '123',
    });
    t.end();
});

test('userito: file: create: skips null items', async (t) => {
    const existing = [null, {
        username: 'hello',
        password: '123',
    }];
    
    const read = stub().returns(existing);
    const write = stub();
    const file = new File('/custom.json', schema);
    
    const result = await file.create({username: 'hello', password: '456'}, {
        read,
        write,
    });
    
    t.deepEqual(result, {
        username: 'hello',
        password: '123',
    });
    t.end();
});

test('userito: file: update: returns updated user', async (t) => {
    const users = [{
        username: 'hello',
        password: '123',
    }];
    
    const read = stub().returns(users);
    const write = stub();
    const file = new File('/custom.json', schema);
    
    const result = await file.update('hello', {password: '456'}, {
        read,
        write,
    });
    
    t.deepEqual(result, {
        username: 'hello',
        password: '456',
    });
    t.end();
});

test('userito: file: update: calls write with updated data', async (t) => {
    const users = [{
        username: 'hello',
        password: '123',
    }];
    
    const read = stub().returns(users);
    const write = stub();
    const file = new File('/custom.json', schema);
    
    await file.update('hello', {password: '456'}, {
        read,
        write,
    });
    
    t.calledWith(write, ['/custom.json', [{
        username: 'hello',
        password: '456',
    }]]);
    t.end();
});

test('userito: file: update: throws when user not found', async (t) => {
    const users = [{
        username: 'hello',
    }];
    
    const read = stub().returns(users);
    const write = stub();
    const file = new File('/custom.json', schema);
    
    const boundUpdate = file.update.bind(file);
    const [error] = await tryToCatch(boundUpdate, 'notfound', {password: '456'}, {
        read,
        write,
    });
    
    t.match(error.message, 'username "notfound" not found');
    t.end();
});

test('userito: file: remove: removes existing user', async (t) => {
    const users = [{
        username: 'hello',
    }, {
        username: 'world',
    }];
    
    const read = stub().returns(users);
    const write = stub();
    const file = new File('/custom.json', schema);
    
    const result = await file.remove('hello', {
        read,
        write,
    });
    
    t.deepEqual(result, {
        username: 'hello',
    });
    t.end();
});

test('userito: file: remove: calls write with null', async (t) => {
    const users = [{
        username: 'hello',
    }, {
        username: 'world',
    }];
    
    const read = stub().returns(users);
    const write = stub();
    const file = new File('/custom.json', schema);
    
    await file.remove('hello', {
        read,
        write,
    });
    
    t.calledWith(write, ['/custom.json', [null, {
        username: 'world',
    }]]);
    t.end();
});

test('userito: file: remove: handles null items', async (t) => {
    const users = [null, {
        username: 'hello',
    }];
    
    const read = stub().returns(users);
    const write = stub();
    const file = new File('/custom.json', schema);
    
    const result = await file.remove('hello', {
        read,
        write,
    });
    
    t.deepEqual(result, {
        username: 'hello',
    });
    t.end();
});

test('userito: file: remove: returns undefined when not found', async (t) => {
    const users = [{
        username: 'hello',
    }];
    
    const read = stub().returns(users);
    const write = stub();
    const file = new File('/custom.json', schema);
    
    const result = await file.remove('notfound', {
        read,
        write,
    });
    
    t.notOk(result);
    t.end();
});
