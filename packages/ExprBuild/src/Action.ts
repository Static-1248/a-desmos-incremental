type Action = {mark: string};
type AsActionListLiteral<T extends Action[]> = (
	T extends [] 
		? never 
	: T extends AsActionListLiteral_1<T, []>
		? T
		: never
);
type AsActionListLiteral_1<A extends Action[], MR extends string[]> = (
	A extends []	
		? A
	: A extends [infer AT, ...infer AR extends Action[]]
		? AT extends {mark: infer M extends string}
			? M extends MR[number]
				? never
			: AR extends AsActionListLiteral_1<AR, [M, ...MR]>
				? A
				: never
			: never
		: never
);

declare function func<T extends Action[]>(l: AsActionListLiteral<T>): void;

type Type3 = AsActionListLiteral_1<[{mark: "0"}, {mark: "1"}, {mark: "2"}], []>;
type Type4 = AsActionListLiteral_1<[{mark: "0"}, {mark: "1"}, {mark: "0"}], []>;

type Type5 = AsActionListLiteral<[{mark: "0"}, {mark: "1"}, {mark: "2"}]>;
type Type6 = AsActionListLiteral<[{mark: "0"}, {mark: "1"}, {mark: "0"}]>;

type Type7 = AsActionListLiteral<Action[]>;

func([
	{mark: "0"},
	{mark: "1"},
	{mark: "2"},]);

func([
	{mark: "0"},
	{mark: "1"},
	{mark: "0"},
]);