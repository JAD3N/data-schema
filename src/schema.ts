import {Registry} from './registry';
import {SchemaNode} from './schemaNode';

export class Schema {

	public readonly registry: Registry;
	public readonly node: SchemaNode;

	public constructor(options: SchemaNode.Options, registry = Registry.DEFAULT) {
		this.registry = registry;
		this.node = new SchemaNode(this, options);
	}

}