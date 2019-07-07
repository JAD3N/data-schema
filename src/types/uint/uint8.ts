import {DataType} from '../dataType';
import {Cursor} from '../../utils/cursor';

export class Uint8 extends DataType {

	public constructor() {
		super({name: 'uint8'});
	}

	public read(array: DataType.Array, cursor: Cursor): number {
		const position = cursor.position;
		cursor.shift(1);
		return array[position];
	}

	public write(value: number): DataType.Array {
		const array = DataType.createArray(1);
		array[0] = Math.min(Math.max(value, 0), 255);
		return array;
	}

}
