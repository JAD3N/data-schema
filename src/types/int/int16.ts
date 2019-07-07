import {DataType} from '../dataType';
import {Cursor} from '../../utils/cursor';

export class Int16 extends DataType {

	public constructor() {
		super({name: 'int16'});
	}

	public read(array: DataType.Array, cursor: Cursor, {littleEndian = true}: Int16.Args = {}): number {
		const position = cursor.position;
		const view = new DataView(array.buffer);

		cursor.shift(2);

		return view.getInt16(position, littleEndian);
	}

	public write(value: number, {littleEndian = true}: Int16.Args = {}): DataType.Array {
		const array = DataType.createArray(2);
		const view = new DataView(array.buffer);

		view.setInt16(0, value, littleEndian);

		return array;
	}

}

export namespace Int16 {

	export interface Args extends DataType.Args {
		littleEndian?: boolean;
	}

}
