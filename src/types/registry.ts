import {DataType} from './dataType';
import {Uint8, Uint16, Uint32} from './uint';
import {Int8, Int16, Int32} from './int';
import {Float32, Float64} from './float';
import {Bool} from './bool';
import {String} from './string';

export class Registry {

	public static readonly DEFAULT_TYPES: DataType.Constructor[] = [];

	protected types: Map<string, DataType>;

	public constructor({useDefault = true}: Registry.Options = {}) {
		this.types = new Map<string, DataType>();

		if(useDefault) {
			this.useDefault();
		}
	}

	public useDefault(): void {
		const defaultTypes = Registry.DEFAULT_TYPES;

		defaultTypes.forEach((type: DataType.Constructor) => {
			this.add(type);
		});
	}

	public add(type: DataType.Constructor): boolean {
		const instance = new type();

		if(!this.types.has(instance.name)) {
			this.types.set(instance.name, instance);
			return true;
		} else {
			return false;
		}
	}

	public get(name: string): DataType {
		return this.types.get(name);
	}

	public remove(name: string): void {
		this.types.delete(name);
	}

}

export namespace Registry {

	export interface Options {
		useDefault?: boolean;
	}

}

Registry.DEFAULT_TYPES.push(
	// unsigned integers
	Uint8,
	Uint16,
	Uint32,

	// signed integers
	Int8,
	Int16,
	Int32,

	// floats
	Float32,
	Float64,

	// other custom types
	String,
	Bool
);
