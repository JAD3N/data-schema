import {DataType} from '../dataType';
import {Cursor} from '../../utils/cursor';

export class Uint16 extends DataType {

	public constructor() {
		super({name: 'uint16'});
	}

	public read(array: DataType.Array, cursor: Cursor, {littleEndian = true}: Uint16.Args = {}): number {
		const position = cursor.position;
		const view = new DataView(array.buffer);

		cursor.shift(2);

		return view.getUint16(position, littleEndian);
	}

	public write(value: number, {littleEndian = true}: Uint16.Args = {}): DataType.Array {
		const array = DataType.createArray(2);
		const view = new DataView(array.buffer);

		view.setUint16(0, value, littleEndian);

		return array;
	}

}

export namespace Uint16 {

	export interface Args extends DataType.Args {
		littleEndian?: boolean;
	}

}
