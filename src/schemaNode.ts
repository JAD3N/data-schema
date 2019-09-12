import {ByteBuffer} from './byteBuffer';
import {Cursor} from './cursor';
import {DataType} from './dataType';
import {Schema} from './schema';

export class SchemaNode {

	public readonly schema: Schema;
	public readonly type: string;
	public readonly dataType: DataType;

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

		if(this.type !== 'array' && this.type !== 'object') {
			this.dataType = this.schema.registry.get(this.type);
		}
	}

	public read(buffer: ByteBuffer, cursor: Cursor): any {
		if(this.type === 'object') {
			const data: {[key: string]: any} = {};

			for(const attributeName in this.attributes) {
				if(this.attributes.hasOwnProperty(attributeName)) {
					const attribute = this.attributes[attributeName];
					data[attributeName] = attribute.read(buffer, cursor);
				}
			}

			return data;
		} else if(this.type === 'array') {
			const data = [];

			// TODO: Array end handling
		} else if(!!this.dataType) {
			return this.dataType
		}
	}

}

export namespace SchemaNode {

	export interface Options {
		type: string;
		attributes?: {[key: string]: SchemaNode.Options};
		children?: SchemaNode.Options;
		default?: any;
	}

}