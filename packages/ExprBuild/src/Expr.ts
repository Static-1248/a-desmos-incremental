import { Mobj } from "./Mobj";

interface Callable {
	(input: string): string;
}

export class Expr extends Mobj implements Callable{
	type = 'Expr';
	(input: string): string {
		return '';
	}
	// ...
}


