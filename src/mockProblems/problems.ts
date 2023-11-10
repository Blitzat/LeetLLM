import { DBProblem } from '@/utils/types/problem';
import axios from 'axios';

export async function getProblemsList(): Promise<DBProblem[]> {
	try {
		const response = await axios.get('http://api.leetllm.com/problems?language=en');
		const problems: DBProblem[] = response.data.map((problem: any) => ({
			id: problem.id,
			title: problem.title,
			order: problem.order,
			problemStatement: problem.problemStatement,
		}));
		console.log(problems);
		return problems;
	} catch (error) {
		console.error(error);
		return [];
	}
}

export const problems: Promise<DBProblem[]> = getProblemsList();

// export const problems: DBProblem[] = [
// 	{
// 		id: "two-sum",
// 		title: "Two Sum",
// 		order: 1,
// 		problemStatement: "What is 1 + 1?",
// 	},
// 	{
// 		id: "three-sum",
// 		title: "Three Sum",
// 		order: 2,
// 		problemStatement: "What is 1 + 1 + 1?",
// 	},
// ];
