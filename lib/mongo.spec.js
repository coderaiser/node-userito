import {test, stub} from 'supertape';
import {tryCatch} from 'try-catch';
import {createMongo, Mongo} from './mongo.js';

const schema = {
    username: 'string',
    password: 'string',
};

const mockMongoose = (user) => {
    const Schema = stub();
    
    return {
        Schema,
        model: stub().returns(user || {
            find: stub(),
            findOne: stub(),
            findOneAndUpdate: stub(),
            findOneAndRemove: stub(),
        }),
        connect: stub(),
    };
};

const mockUser = () => {
    function Model(data) {
        Model.save = stub().returns(data);
        return Model;
    }
    
    Model.find = stub();
    Model.findOne = stub();
    Model.findOneAndUpdate = stub();
    Model.findOneAndRemove = stub();
    Model.save = stub();
    
    return Model;
};

test('userito: mongo: createMongo: throws on empty url', (t) => {
    const [error] = tryCatch(createMongo);
    
    t.equal(error.message, 'url could not be empty!');
    t.end();
});

test('userito: mongo: createMongo: returns Mongo instance', (t) => {
    const mongo = createMongo('url', schema, {
        mongoose: mockMongoose(),
    });
    
    t.ok(mongo instanceof Mongo);
    t.end();
});

test('userito: mongo: Mongo: uses custom schema', (t) => {
    const mongo = new Mongo('url', schema, {
        mongoose: mockMongoose(),
    });
    
    t.ok(mongo instanceof Mongo);
    t.end();
});

test('userito: mongo: Mongo: uses default schema', (t) => {
    const mongo = new Mongo('url', null, {
        mongoose: mockMongoose(),
    });
    
    t.ok(mongo instanceof Mongo);
    t.end();
});

test('userito: mongo: all: returns users', async (t) => {
    const _user = mockUser();
    
    _user.find = stub().returns([{
        username: 'hello',
    }]);
    const mongo = new Mongo('url', schema, {
        mongoose: mockMongoose(_user),
    });
    
    const result = await mongo.all();
    
    t.deepEqual(result, [{
        username: 'hello',
    }]);
    t.end();
});

test('userito: mongo: all: calls find', async (t) => {
    const _user = mockUser();
    
    _user.find = stub().returns([]);
    const mongo = new Mongo('url', schema, {
        mongoose: mockMongoose(_user),
    });
    
    await mongo.all();
    
    t.calledWithNoArgs(_user.find);
    t.end();
});

test('userito: mongo: get: finds user by username', async (t) => {
    const _user = mockUser();
    
    _user.findOne = stub().returns({
        username: 'hello',
    });
    const mongo = new Mongo('url', schema, {
        mongoose: mockMongoose(_user),
    });
    
    const result = await mongo.get('hello');
    
    t.deepEqual(result, {
        username: 'hello',
    });
    t.end();
});

test('userito: mongo: get: calls findOne with username', async (t) => {
    const _user = mockUser();
    
    _user.findOne = stub().returns(null);
    const mongo = new Mongo('url', schema, {
        mongoose: mockMongoose(_user),
    });
    
    await mongo.get('hello');
    const args = [{
        username: 'hello',
    }];
    
    t.calledWith(_user.findOne, args);
    t.end();
});

test('userito: mongo: create: adds new user', async (t) => {
    const _user = mockUser();
    
    _user.findOne = stub().returns(null);
    const mongo = new Mongo('url', schema, {
        mongoose: mockMongoose(_user),
    });
    
    const result = await mongo.create({
        username: 'hello',
        password: '123',
    });
    
    t.deepEqual(result, {
        username: 'hello',
        password: '123',
    });
    t.end();
});

test('userito: mongo: create: calls findOne', async (t) => {
    const _user = mockUser();
    
    _user.findOne = stub().returns(null);
    const mongo = new Mongo('url', schema, {
        mongoose: mockMongoose(_user),
    });
    
    await mongo.create({
        username: 'hello',
        password: '123',
    });
    const args = [{
        username: 'hello',
    }];
    
    t.calledWith(_user.findOne, args);
    t.end();
});

test('userito: mongo: create: returns existing user', async (t) => {
    const existing = {
        username: 'hello',
    };
    
    const _user = mockUser();
    
    _user.findOne = stub().returns(existing);
    const mongo = new Mongo('url', schema, {
        mongoose: mockMongoose(_user),
    });
    
    const result = await mongo.create({
        username: 'hello',
    });
    
    t.deepEqual(result, existing);
    t.end();
});

test('userito: mongo: update: calls findOneAndUpdate', async (t) => {
    const _user = mockUser();
    
    _user.findOneAndUpdate = stub().returns({
        username: 'hello',
    });
    const mongo = new Mongo('url', schema, {
        mongoose: mockMongoose(_user),
    });
    
    const result = await mongo.update('hello', {
        password: '456',
    });
    
    t.deepEqual(result, {
        username: 'hello',
    });
    t.end();
});

test('userito: mongo: update: passes args to findOneAndUpdate', async (t) => {
    const _user = mockUser();
    
    _user.findOneAndUpdate = stub();
    const mongo = new Mongo('url', schema, {
        mongoose: mockMongoose(_user),
    });
    
    await mongo.update('hello', {
        password: '456',
    });
    const args = [{
        username: 'hello',
    }, {
        password: '456',
    }];
    
    t.calledWith(_user.findOneAndUpdate, args);
    t.end();
});

test('userito: mongo: remove: calls findOneAndRemove', async (t) => {
    const _user = mockUser();
    
    _user.findOneAndRemove = stub().returns({
        username: 'hello',
    });
    const mongo = new Mongo('url', schema, {
        mongoose: mockMongoose(_user),
    });
    
    const result = await mongo.remove('hello');
    
    t.deepEqual(result, {
        username: 'hello',
    });
    t.end();
});

test('userito: mongo: remove: passes username to findOneAndRemove', async (t) => {
    const _user = mockUser();
    
    _user.findOneAndRemove = stub();
    const mongo = new Mongo('url', schema, {
        mongoose: mockMongoose(_user),
    });
    
    await mongo.remove('hello');
    const args = [{
        username: 'hello',
    }];
    
    t.calledWith(_user.findOneAndRemove, args);
    t.end();
});
