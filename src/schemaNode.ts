import {ByteBuffer} from './byteBuffer';
import {Cursor} from './cursor';
import {DataType} from './dataType';
import {Schema} from './schema';

export class SchemaNode {

	public readonly schema: Schema;
	public readonly type: string;
	public readonly dataType: DataType;

	public options: {[key: string]: any};
	public attributes: {[key: string]: SchemaNode};
	public children: SchemaNode;
	public default: any;

	public constructor(schema: Schema, options: SchemaNode.Options) {
		this.schema = schema;
		this.type = options.type;

		if(this.type === 'object' && options.attributes !== undefined) {
			const attributes = options.attributes;

			// set empty attributes object
			this.attributes = {};

			// iterate any attributes
			for(const attributeName in attributes) {
				if(attributes.hasOwnProperty(attributeName)) {
					const attribute = attributes[attributeName];
					const name = new SchemaNode(schema, attribute);

					this.attributes[attributeName] = name;
				}
			}
		} else if(this.type === 'array' && options.children !== undefined) {
			this.children = new SchemaNode(this.schema, options.children);
		}

		if(this.default !== undefined) {
			this.default = options.default;
		}

		this.options = {};

		if(this.type !== 'array' && this.type !== 'object') {
			this.dataType = this.schema.registry.get(this.type);

			if(!this.dataType) {
				console.log('Unknown data type:', this.type);
				return;
			}

			for(let option of this.dataType.options) {
				if(options.hasOwnProperty(option)) {
					this.options[option] = options[option];
				}
			}
		}
	}

	public read(buffer: ByteBuffer, cursor: Cursor): any {
		if(this.type === 'object') {
			const data: {[key: string]: any} = {};

			for(const attributeName in this.attributes) {
				if(this.attributes.hasOwnProperty(attributeName)) {
					const attribute = this.attributes[attributeName];

					try {
						data[attributeName] = attribute.read(buffer, cursor);
					} catch(err) {
						console.error('Error reading attribute:', attributeName);
					}
				}
			}

			return data;
		} else if(this.type === 'array') {
			const data = [];

			// TODO: Array end handling
		} else if(!!this.dataType) {
			try {
				return this.dataType.read(this, buffer, cursor);
			} catch(err) {
				console.error('Error reading value for data type:', this.dataType.name);
			}
		}
	}

	public write(data: any): number[] {
		if(this.type === 'object') {
			if(data === undefined && this.default !== undefined) {
				data = this.default;
			}

			let result: number[] = [];

			for(const attributeName in this.attributes) {
				if(this.attributes.hasOwnProperty(attributeName)) {
					if(!data.hasOwnProperty(attributeName)) {
						throw new Error('Missing data');
					}

					const attribute = this.attributes[attributeName];
					const attributeResult = attribute.write(data[attributeName]);

					if(attributeResult.length) {
						result = result.concat(attributeResult);
					}
				}
			}

			return result;
		} else if(this.type === 'array') {
			return [];
		} else if(!!this.dataType) {
			return this.dataType.write(this, data);
		}

		return [];
	}

	public getOption(option: string, defaultValue?: any): any {
		if(this.options.hasOwnProperty(option)) {
			return this.options[option];
		}

		return defaultValue;
	}

}

export namespace SchemaNode {

	export interface Options {
		type: string;
		attributes?: {[key: string]: SchemaNode.Options};
		children?: SchemaNode.Options;
		default?: any;

		// for custom options
		[option: string]: any;
	}

}