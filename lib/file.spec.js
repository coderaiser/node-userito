'use strict';

const {
    test,
    stub,
} = require('supertape');
const mockRequire = require('mock-require');

const {
    stopAll,
    reRequire,
} = mockRequire;

test('userito: file', (t) => {
    const error = Error('x');
    error.code = 'ENOENT';
    const filePath = '/hello.json';
    
    const readSync = stub().throws(error);
    const writeSync = stub();
    
    mockRequire('readjson', {
        sync: readSync,
    });
    
    mockRequire('writejson', {
        sync: writeSync,
    });
    
    const {_createFile} = reRequire('./file');
    
    _createFile(filePath);
    stopAll();
    
    t.calledWith(writeSync, [filePath, []]);
    t.end();
});

