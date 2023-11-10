export type Example = {
	id: number;
	inputText: string;
	outputText: string;
	explanation?: string;
	img?: string;
};

export type DBProblem = {
	id: number;
	title: string;
	problemStatement: string;
	order: number;
};
