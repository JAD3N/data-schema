import {DataType} from '../dataType';
import {Cursor} from '../../utils/cursor';

export class Float64 extends DataType {

	public constructor() {
		super({name: 'float64'});
	}

	public read(array: DataType.Array, cursor: Cursor, {littleEndian = true}: Float64.Args = {}): number {
		const position = cursor.position;
		const view = new DataView(array.buffer);

		cursor.shift(8);

		return view.getFloat64(position, littleEndian);
	}

	public write(value: number, {littleEndian = true}: Float64.Args): DataType.Array {
		const array = DataType.createArray(8);
		const view = new DataView(array.buffer);

		view.setFloat64(0, value, littleEndian);

		return array;
	}

}

export namespace Float64 {

	export interface Args extends DataType.Args {
		littleEndian?: boolean;
	}

}
