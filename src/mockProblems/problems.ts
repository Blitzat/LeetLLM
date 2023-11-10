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
		return problems;
	} catch (error) {
		console.error(error);
		return [];
	}
}

export const problems: Promise<DBProblem[]> = getProblemsList();

export async function solveProblem(solveRequest: { problem_id: number; answer: string; language: string; }) {
    try {
        const response = await axios.post('http://api.leetllm.com/solve', solveRequest);
		console.log(response);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
