export type Example = {
	id: number;
	inputText: string;
	outputText: string;
	explanation?: string;
	img?: string;
};

export type DBProblem = {
	id: string;
	title: string;
	problemStatement: string;
	order: number;
};
