import {isNode} from './utils/isNode';

export class ByteBuffer {

	public readonly length: number;
	public readonly data: number[] | Uint8Array | Buffer;
	public readonly type: ByteBuffer.Type;

	public constructor(data: Buffer | Uint8Array | number[] | number) {
		if(typeof data === 'number') {
			this.length = data | 0;

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
		} else {
			this.length = data.length;
			this.data = data;

			if(isNode && data instanceof Buffer) {
				this.type = ByteBuffer.Type.BUFFER;
			} else if(Array.isArray(data)) {
				this.type = ByteBuffer.Type.ARRAY;
			} else if(data instanceof Uint8Array) {
				this.type = ByteBuffer.Type.UINT8;
			}
		}
	}

	public static readBytes(bytes: number[], signed: boolean, littleEndian: boolean = true): number {
		let result = 0;

		for(let i = 0; i < bytes.length; i++) {
			let index = littleEndian ? i : bytes.length - 1 - i;
			let byte = bytes[index];

			if(signed) {
				byte &= 0xff;
			}

			result |= byte << (i * 8);
		}

		return result;
	}

	public static convertBuffer(bytes: Buffer | Uint8Array): number[] {
		if(bytes && bytes.length > 0) {
			const array = new Array(bytes.length);

			for(let i = 0; i < bytes.length; i++) {
				array[i] = bytes[i];
			}

			return array;
		} else {
			return [];
		}
	}

}

export namespace ByteBuffer {

	export enum Type {
		BUFFER = 'buffer',
		UINT8 = 'uint8',
		ARRAY = 'array',
	}

}