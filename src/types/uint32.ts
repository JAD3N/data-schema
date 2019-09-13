import {DataType} from '../dataType';
import {ByteBuffer} from '../byteBuffer';
import {Cursor} from '../cursor';
import {SchemaNode} from '../schemaNode';
import {isNode} from '../utils/isNode';

export class Uint32 extends DataType {

	public static readonly BYTES = 4;

	public constructor() {
		super('uint32', ['littleEndian']);
	}

	public read(node: SchemaNode, buffer: ByteBuffer, cursor: Cursor): any {
		if(cursor.position < 0 || cursor.position > buffer.length - Uint32.BYTES) {
			throw new Error('Not enough bytes for data type!');
		}

		const littleEndian = !!node.getOption('littleEndian', true);
		let result;

		if(buffer.type === ByteBuffer.Type.BUFFER) {
			const data = <Buffer> buffer.data;

			if(littleEndian) {
				result = data.readUInt32LE(cursor.position);
			} else {
				result = data.readUInt32BE(cursor.position);
			}
		} else if(buffer.type === ByteBuffer.Type.UINT8) {
			const data = <Uint8Array> buffer.data;
			const view = new DataView(data.buffer);

			result = view.getUint32(cursor.position, littleEndian);
		} else if(buffer.type === ByteBuffer.Type.ARRAY) {
			const data = <number[]> buffer.data;
			const subData = data.slice(cursor.position, cursor.position + 4);

			result = ByteBuffer.readBytes(subData, false, littleEndian);
		} else {
			throw new Error(`Uknown buffer type: ${buffer.type}`)
		}

		cursor.shift(Uint32.BYTES);
		return result;
	}

	public write(node: SchemaNode, data: number): number[] {
		const littleEndian = !!node.getOption('littleEndian', true);

		// buffer overflow adjustment
		data %= 2 ** (8 * Uint32.BYTES);

		if(isNode) {
			const buffer = Buffer.alloc(Uint32.BYTES);

			if(littleEndian) {
				buffer.writeUInt32LE(data, 0);
			} else {
				buffer.writeUInt32BE(data, 0);
			}

			return ByteBuffer.convertBuffer(buffer);
		} else if(!!Uint8Array) {
			const buffer = new ArrayBuffer(Uint32.BYTES);
			const view = new DataView(buffer);
			const array = new Uint8Array(buffer);

			// set bytes
			view.setUint32(0, data, littleEndian);

			return ByteBuffer.convertBuffer(array);
		} else {
			console.error('Unsupported operation.');
		}
	}

}