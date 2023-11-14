import { DBProblem } from '@/utils/types/problem';
import axios from 'axios';

export async function getProblemsList(): Promise<DBProblem[]> {
	try {
		const response = await axios.get('https://api.leetllm.com/problems?language=en');
		const problems: DBProblem[] = response.data.map((problem: DBProblem) => ({
			id: problem.id,
			title: problem.title,
			order: problem.order,
			problemStatement: problem.problemStatement,
		}));
		return problems;
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function solveProblem(solveRequest: { question_id: number; answer: string; language: string; }): Promise<any> {
	try {
		const response = await axios.post('https://api.leetllm.com/solve/', solveRequest);
		console.log(response);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}
