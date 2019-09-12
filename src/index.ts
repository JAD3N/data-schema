export {Schema} from './schema';
export {ByteBuffer} from './byteBuffer';

import {ByteBuffer} from './byteBuffer';
import {Schema} from './schema';

const schema = new Schema({
	type: 'object',
	attributes: {
		x: {type: 'uint8'}
	}
});

console.log(schema);

const bytes = [64, 226, 1, 0];
// const bytes =  [192, 29, 254, 255];

console.log(ByteBuffer.readBytes(bytes, true, true));