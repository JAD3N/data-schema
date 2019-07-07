import {DataType} from '../dataType';
import {Cursor} from '../../utils/cursor';

export class Uint32 extends DataType {

	public constructor() {
		super({name: 'uint32'});
	}

	public read(array: DataType.Array, cursor: Cursor, {littleEndian = true}: Uint32.Args = {}): number {
		const position = cursor.position;
		const view = new DataView(array.buffer);

		cursor.shift(4);

		return view.getUint32(position, littleEndian);
	}

	public write(value: number, {littleEndian = true}: Uint32.Args = {}): DataType.Array {
		const array = DataType.createArray(4);
		const view = new DataView(array.buffer);

		view.setUint32(0, value, littleEndian);

		return array;
	}

}

export namespace Uint32 {

	export interface Args extends DataType.Args {
		littleEndian?: boolean;
	}

}
