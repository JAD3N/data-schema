import {isNode} from './utils/isNode';

export class ByteBuffer {

	public readonly length: number;
	public readonly data: number[] | Uint8Array | Buffer;
	public readonly type: ByteBuffer.Type;

	public constructor(data: number[] | number) {
		if(Array.isArray(data)) {
			this.length = data.length;
		} else {
			this.length = data | 0;
		}

		if(isNode) {
			this.data = Buffer.alloc(this.length);
			this.type = ByteBuffer.Type.BUFFER;
		} else if('Uint8Array' in window) {
			this.data = new Uint8Array(this.length);
			this.type = ByteBuffer.Type.UINT8;
		} else {
			this.data = new Array(this.length);
			this.data.fill(0);
			this.type = ByteBuffer.Type.ARRAY;
		}
	}

	public static readBytes(bytes: number[], signed: boolean, littleEndian: boolean = true): number {
		let result = 0;

		for(let i = 0; i < bytes.length; i++) {
			let index = littleEndian ? bytes.length - 1 - i : i;
			let byte = bytes[index];

			if(signed) {
				byte &= 0xff;
			}

			result |= byte << (index * 8);
		}

		/*if(!!littleEndian) {
			for(let i = bytes.length - 1; i >= 0; i--) {
				let byte = bytes[i];

				if(signed) {
					byte &= 0xff;
				}

				result |= byte << (i * 8);
			}
		} else {
			for(let i = bytes.length - 1; i >= 0; i--) {
				let byte = bytes[i];

				if(signed) {
					byte &= 0xff;
				}

				result |= byte << (i * 8);
			}
		}*/

		return result;
	}

}

export namespace ByteBuffer {

	export enum Type {
		BUFFER = 'buffer',
		UINT8 = 'uint8',
		ARRAY = 'array',
	}

}