import {test, stub} from 'supertape';
import {_createFile} from './file.js';

test('userito: file', (t) => {
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
