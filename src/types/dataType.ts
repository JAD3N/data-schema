import {Cursor} from '../utils/cursor';

export abstract class DataType {

	public readonly name: string;

	public constructor({name}: DataType.Options) {
		this.name = name;
	}

	public abstract read(data: DataType.Array, cursor: Cursor, args?: DataType.Args): any;
	public abstract write(data: any, args?: DataType.Args): DataType.Array;

	public static createArray(length: number, value?: number | ((i: number) => number)): DataType.Array {
		let array: DataType.Array;

		if(Uint8ClampedArray) {
			array = new Uint8ClampedArray(length);
		} else if(Uint8Array) {
			array = new Uint8Array(length);
		} else {
			throw new Error('Typed Arrays not supported!');
		}

		if(value === undefined) {
			value = 0;
		}

		// skip zero-ing of typed arrays
		if(value !== 0) {
			for(let i = 0; i < length; i++) {
				let result: number;

				if(typeof value === 'function') {
					result = value(i);
				} else {
					result = value;
				}

				// clamp value between 0 and 255
				array[i] = Math.min(Math.max(result | 0, 0), 255);
			}
		}

		return array;
	}

}

export namespace DataType {

	export interface Options {
		name: string;
	}

	export type Constructor = new () => DataType;
	export type Array = Uint8ClampedArray | Uint8Array;
	export type Args = {[key: string]: any};

}
