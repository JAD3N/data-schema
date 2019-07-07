import {DataType} from '../dataType';
import {Cursor} from '../../utils/cursor';

export class Int32 extends DataType {

	public constructor() {
		super({name: 'int32'});
	}

	public read(array: DataType.Array, cursor: Cursor, {littleEndian = true}: Int32.Args = {}): number {
		const position = cursor.position;
		const view = new DataView(array.buffer);

		cursor.shift(4);

		return view.getInt32(position, littleEndian);
	}

	public write(value: number, {littleEndian = true}: Int32.Args = {}): DataType.Array {
		const array = DataType.createArray(4);
		const view = new DataView(array.buffer);

		view.setInt32(0, value, littleEndian);

		return array;
	}

}

export namespace Int32 {

	export interface Args extends DataType.Args {
		littleEndian?: boolean;
	}

}
