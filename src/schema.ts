import {Registry} from './types/registry';
import {DataType} from './types/dataType';
import {Cursor} from './utils/cursor';

export class Schema {

	public readonly registry: Registry;
	public readonly nodes: Schema.Node[];

	public constructor({
		registry = new Registry(),
		nodes
	}: Schema.Options) {
		this.registry = registry;
		this.nodes = nodes;
	}

	public read(array: DataType.Array): Schema.Data {
		const context: Schema.Context = {
			schema: this,
			mode: 'read',
			data: null,
			array: array,
			cursor: new Cursor()
		};

		this.readObject(context, {
			type: 'object',
			nodes: this.nodes,
		}, context.data);

		return context.data;
	}

	protected readData(context: Schema.Context, node: Schema.Node, data: Schema.Data | Schema.Data[]): void {
		const type = node.type;

		// allow skipped nodes
		if(node.skip && node.skip(context)) {
			return;
		}

		if(type === 'object') {
			this.readObject(context, node, data);
		} else if(type === 'array') {
			this.readArray(context, node, data);
		} else {
			this.readDataType(context, node, data);
		}
	}

	protected readObject(context: Schema.Context, node: Schema.Node, data: Schema.Data): void {
		const nodes = node.nodes;
		let value: Schema.Data = {};

		if(!!context.data) {
			if(Array.isArray(data)) {
				data.push(value);
			} else {
				Reflect.set(data, node.name, value);
			}
		} else {
			context.data = value;
		}

		for(const subNode of nodes) {
			this.readData(context, subNode, value);
		}
	}

	protected readArray(context: Schema.Context, node: Schema.Node, data: Schema.Data): void {
		let value: Schema.Data[] = [];

		if(Array.isArray(data)) {
			data.push(value);
		} else {
			Reflect.set(data, node.name, value);
		}

		const length = (function(): number {
			if(typeof node.length === 'function') {
				return node.length(context);
			} else {
				return node.length;
			}
		})();

		if(length !== undefined) {
			for(let i = 0; i < length; i++) {
				this.readData(context, node.entry, value);
			}
		} else {
			const array = context.array;
			const cursor = context.cursor;

			let lastByte: number;

			if(node.args && node.args.lastByte !== undefined) {
				lastByte = node.args.lastByte | 0;
			}

			while(cursor.position < array.length) {
				if(array[cursor.position] === lastByte) {
					break;
				}

				this.readData(context, node.entry, value);
			}
		}
	}

	protected readDataType(context: Schema.Context, node: Schema.Node, data: Schema.Data | Schema.Data[]): void {
		const type = node.type;
		const dataType = this.registry.get(type);

		if(!dataType) {
			throw new Error('Invalid data type!');
		}

		let value = dataType.read(context.array as DataType.Array, context.cursor, node.args);

		if(Array.isArray(data)) {
			data.push(value);
		} else {
			Reflect.set(data, node.name, value);
		}
	}

	public write(data: Schema.Data): DataType.Array {
		const context: Schema.Context = {
			schema: this,
			mode: 'write',
			data: data,
			array: []
		};

		this.writeObject(context, {
			type: 'object',
			nodes: this.nodes
		}, data);

		const length = context.array.length;
		const array = DataType.createArray(length);

		for(let i = 0; i < length; i++) {
			array[i] = context.array[i];
		}

		return array;
	}

	protected writeData(context: Schema.Context, node: Schema.Node, data: Schema.Data | Schema.Data[]): void {
		const type = node.type;

		// allow skipped nodes
		if(node.skip && node.skip(context, data)) {
			return;
		}

		if(type === 'object') {
			this.writeObject(context, node, data as Schema.Data);
		} else if(type === 'array') {
			this.writeArray(context, node, data as Schema.Data[]);
		} else {
			this.writeDataType(context, node, data as any);
		}
	}

	protected writeObject(context: Schema.Context, node: Schema.Node, data: Schema.Data): void {
		const nodes = node.nodes;

		for(const subNode of nodes) {
			this.writeData(context, subNode, data[subNode.name]);
		}
	}

	protected writeArray(context: Schema.Context, node: Schema.Node, data: Schema.Data[]): void {
		const entry = node.entry;

		for(const value of data) {
			this.writeData(context, entry, value);
		}

		if(node.args) {
			const args = node.args;
			const lastByte = args.lastByte;

			if(lastByte !== undefined) {
				const array = context.array as number[];
				array.push(lastByte);
			}
		}
	}

	protected writeDataType(context: Schema.Context, node: Schema.Node, data: any): void {
		const type = node.type;
		const dataType = this.registry.get(type);

		if(!dataType) {
			throw new Error('Invalid data type!');
		}

		let value = data;

		if(node.value) {
			let tempValue = node.value(context, data);

			if(tempValue !== undefined) {
				value = tempValue;
			}
		}

		const valueArr = dataType.write(value, node.args);

		if(valueArr.length) {
			const array = context.array as number[];

			for(let i = 0; i < valueArr.length; i++) {
				array.push(valueArr[i]);
			}
		}
	}

}

export namespace Schema {

	export interface Options {
		registry?: Registry;
		nodes: Schema.Node[];
	}

	export interface Node {
		type: string;
		name?: string;
		id?: string | number;

		nodes?: Schema.Node[];
		entry?: Schema.Node;
		length?: number | ((context: Schema.Context) => number);

		args?: Schema.Data;
		value?: (context: Schema.Context, parent?: any) => any;
		skip?: (context: Schema.Context, parent?: any) => boolean;
	}

	export interface Context {
		schema: Schema;
		mode: 'read' | 'write';
		data: Schema.Data;
		array: DataType.Array | number[];
		cursor?: Cursor;
	}

	export interface Data {
		[key: string]: any | Schema.Data | Schema.Data[];
	}

}
