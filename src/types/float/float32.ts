import {DataType} from '../dataType';
import {Cursor} from '../../utils/cursor';

export class Float32 extends DataType {

	public constructor() {
		super({name: 'float32'});
	}

	public read(array: DataType.Array, cursor: Cursor, {littleEndian = true}: Float32.Args = {}): number {
		const position = cursor.position;
		const view = new DataView(array.buffer);

		cursor.shift(4);

		return view.getFloat32(position, littleEndian);
	}

	public write(value: number, {littleEndian = true}: Float32.Args): DataType.Array {
		const array = DataType.createArray(4);
		const view = new DataView(array.buffer);

		view.setFloat32(0, value, littleEndian);

		return array;
	}

}

export namespace Float32 {

	export interface Args extends DataType.Args {
		littleEndian?: boolean;
	}

}
