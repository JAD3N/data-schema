import {DataType} from './dataType';
import {Cursor} from '../utils/cursor';

export class String extends DataType {

	protected encoder: TextEncoder;
	protected decoder: TextDecoder;

	public constructor() {
		super({name: 'string'});

		this.encoder = new TextEncoder();
		this.decoder = new TextDecoder();
	}

	public read(array: DataType.Array, cursor: Cursor, {lastByte = 0x00}: String.Args = {}): string {
		let byte, bytes = [];

		do {
			// get byte
			byte = array[cursor.position];

			// move cursor
			cursor.shift(1);

			if(byte !== lastByte) {
				bytes.push(byte);
			}
		} while(byte !== lastByte && cursor.position < array.length);

		if(bytes.length) {
			return this.decoder.decode(new Uint8Array(bytes));
		} else {
			return '';
		}
	}

	public write(value: string, {lastByte = 0x00}: String.Args = {}): DataType.Array {
		const bytes = this.encoder.encode(value);
		const array = DataType.createArray(bytes.length + 1);

		for(let i = 0; i < bytes.length; i++) {
			array[i] = bytes[i];
		}

		array[bytes.length] = lastByte;

		return array;
	}

}

export namespace String {

	export interface Args extends DataType.Args {
		lastByte?: number;
	}

}
