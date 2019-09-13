import {Registry} from './registry';
import {ByteBuffer} from './byteBuffer';
import {Cursor} from './cursor';
import {SchemaNode} from './schemaNode';

export abstract class DataType {

	public readonly name: string;
	public readonly options: string[];

	protected constructor(name: string, options: string[] = []) {
		this.name = name;
		this.options = options;
	}

	public abstract read(node: SchemaNode, buffer: ByteBuffer, cursor: Cursor): any;
	public abstract write(node: SchemaNode, data: any): number[];

}