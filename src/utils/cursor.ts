export class Cursor {

	public position: number;

	public constructor(position?: number) {
		if(position !== undefined) {
			this.position = position | 0;
		} else {
			this.position = 0;
		}
	}

	public shift(amount: number): number {
		this.position += amount | 0;
		return this.position;
	}

	public unshift(amount: number): number {
		return this.shift(-amount);
	}

	public reset(): void {
		this.position = 0;
	}

}
