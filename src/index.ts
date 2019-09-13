export {Schema} from './schema';
export {ByteBuffer} from './byteBuffer';

import {ByteBuffer} from './byteBuffer';
import {Schema} from './schema';
import {Cursor} from './cursor';

const schema = new Schema({
	type: 'object',
	attributes: {
		x: {type: 'uint32'},
		y: {type: 'uint32'},
		z: {type: 'uint32'},
	}
});

let bytes;

console.log(bytes = schema.node.write({
	x: 123,
	y: 456,
	z: 789,
}));

console.log(schema.node.read(new ByteBuffer(bytes), new Cursor()));