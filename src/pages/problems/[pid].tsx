import Topbar from "@/components/Topbar/Topbar";
import Workspace from "@/components/Workspace/Workspace";
import useHasMounted from "@/hooks/useHasMounted";
import { getProblemsList } from "@/mockProblems/problems";
import { DBProblem } from "@/utils/types/problem";
import React from "react";

type ProblemPageProps = {
	problem: DBProblem;
};

const ProblemPage: React.FC<ProblemPageProps> = ({ problem }) => {
	const hasMounted = useHasMounted();

	if (!hasMounted) return null;

	return (
		<div>
			<Topbar problemPage />
			<Workspace problem={problem} />
		</div>
	);
};
export default ProblemPage;

// fetch the local data
//  SSG
// getStaticPaths => it create the dynamic routes
export async function getStaticPaths() {
	const problemData = await getProblemsList();
	const paths = problemData.slice(0, 100).map((problem) => ({
		params: { pid: problem.id.toString() },
	}));

	return {
		paths,
		fallback: 'blocking',
	};
}

// getStaticProps => it fetch the data

export async function getStaticProps({ params }: { params: { pid: string } }) {
	const { pid } = params;
	const problemsData = await getProblemsList();
	const problem = problemsData.find((problem) => problem.id === parseInt(pid));

	if (!problem) {
		return {
			notFound: true,
		};
	}
	// problem.handlerFunction = problem.handlerFunction.toString();
	return {
		props: {
			problem,
		},
		revalidate: 60 * 60 * 24,
	};
}
