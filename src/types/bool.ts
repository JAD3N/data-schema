import {DataType} from './dataType';
import {Cursor} from '../utils/cursor';

export class Bool extends DataType {

	public constructor() {
		super({name: 'bool'});
	}

	public read(array: DataType.Array, cursor: Cursor): boolean {
		const position = cursor.position;
		cursor.shift(1);
		return !!array[position];
	}

	public write(value: boolean): DataType.Array {
		const array = DataType.createArray(1);
		array[0] = value ? 1 : 0;
		return array;
	}

}
