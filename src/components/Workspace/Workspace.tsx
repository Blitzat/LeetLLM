import { useEffect, useState } from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Playground from "./Playground/Playground";
import { DBProblem } from "@/utils/types/problem";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";
import React from "react";

type WorkspaceProps = {
	problem: DBProblem;
};

const Workspace: React.FC<WorkspaceProps> = ({ problem }) => {
	const { width, height } = useWindowSize();
	const [success, setSuccess] = useState(false);
	const [solved, setSolved] = useState(false);
	const isMobile = width <= 768;

	useEffect(() => {
		if (!isMobile) document.body.style.overflow = 'hidden';

		// Clean up function
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, []);

	if (isMobile) {
		return (
			<div className='bg-dark-fill-2'>
				<ProblemDescription problem={problem} _solved={solved} />
				<Playground problem={problem} setSuccess={setSuccess} setSolved={setSolved} />
			</div>
		);
	}

	return (
		<Split className='split' direction='horizontal' sizes={[30, 70]} minSize={240}>
			<ProblemDescription problem={problem} _solved={solved} />
			<div className='bg-dark-fill-2'>
				<Playground problem={problem} setSuccess={setSuccess} setSolved={setSolved} />
				{success && <Confetti gravity={0.3} tweenDuration={4000} width={width - 1} height={height - 1} />}
			</div>
		</Split>
	);
};
export default Workspace;
