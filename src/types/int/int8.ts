import {DataType} from '../dataType';
import {Cursor} from '../../utils/cursor';

export class Int8 extends DataType {

	public constructor() {
		super({name: 'int8'});
	}

	public read(array: DataType.Array, cursor: Cursor): number {
		const position = cursor.position;
		cursor.shift(1);
		return array[position] - 128;
	}

	public write(value: number): DataType.Array {
		const array = DataType.createArray(1);
		array[0] = Math.min(Math.max(value + 128, 0), 255);
		return array;
	}

}
