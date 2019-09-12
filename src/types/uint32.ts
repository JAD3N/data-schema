import {DataType} from '../dataType';
import {ByteBuffer} from '../byteBuffer';
import {Cursor} from '../cursor';
import {SchemaNode} from '../schemaNode';

export class Uint32 extends DataType {

	public constructor() {
		super('uint32');
	}

	public read(node: SchemaNode, buffer: ByteBuffer, cursor: Cursor): any {
		if(buffer.type === ByteBuffer.Type.BUFFER) {
			let data = <Buffer> buffer.data;
		} else if(buffer.type === ByteBuffer.Type.UINT8) {
			let data = <Uint8Array> buffer.data;
		} else if(buffer.type === ByteBuffer.Type.ARRAY) {
			let data = <number[]> buffer.data;
			let subData = data.slice(cursor.position, cursor.position + 4);

			return ByteBuffer.readBytes(subData, false, true);
		}
	}

}