import {ByteBuffer} from '../src/byteBuffer';

describe('ByteBuffer', () => {
	it('ByteBuffer is instantiable', () => {
		expect(new ByteBuffer(10)).toBeInstanceOf(ByteBuffer);
	});
});