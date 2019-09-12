import {Registry} from './registry';
import {ByteBuffer} from './byteBuffer';
import {Cursor} from './cursor';
import {SchemaNode} from './schemaNode';

export abstract class DataType {

	public readonly name: string;

	protected constructor(name: string) {
		this.name = name;
		Registry.register(this);
	}

	public abstract read(node: SchemaNode, buffer: ByteBuffer, cursor: Cursor): any;

}