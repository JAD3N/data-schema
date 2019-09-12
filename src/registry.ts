import {DataType} from './dataType';
import * as _ from './types';

export class Registry {

	public static readonly DEFAULT = new Registry();

	protected types: Map<string, DataType>;

	public constructor() {
		this.types = new Map();
	}

	public add(type: DataType): void {
		const typeName = type.name;

		// show warning
		if(this.types.has(typeName)) {
			console.warn('Overriding existing type:', typeName);
		}

		this.types.set(typeName, type);
	}

	public get(typeName: string): DataType {
		return this.types.get(typeName);
	}

	public static register(type: DataType) {
		Registry.DEFAULT.add(type);
	}

}