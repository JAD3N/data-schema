export class Cursor {

	public position: number;

	public constructor(position: number = 0) {
		this.position = position | 0;
	}

	public shift(amount: number = 1): number {
		this.position += amount | 0;
		return this.position;
	}

	public unshift(amount: number = 1): number {
		this.position -= amount | 0;
		return this.position;
	}

	public reset(): void {
		this.position = 0;
	}

}