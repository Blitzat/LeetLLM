import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import YouTube from "react-youtube";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { auth, firestore } from "@/firebase/firebase";
import { DBProblem } from "@/utils/types/problem";
import { useAuthState } from "react-firebase-hooks/auth";
import { getProblemsList } from "@/mockProblems/problems";
import { get } from "http";
import next from "next";

type ProblemsTableProps = {
	setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>;
	currentProblemId: number,
};

const ProblemsTable: React.FC<ProblemsTableProps> = ({ setLoadingProblems, currentProblemId }) => {
	const [youtubePlayer, setYoutubePlayer] = useState({
		isOpen: false,
		videoId: "",
	});
	const problems = useGetProblems(setLoadingProblems);
	const solvedProblems = useGetSolvedProblems();
	console.log("solvedProblems", solvedProblems);
	const closeModal = () => {
		setYoutubePlayer({ isOpen: false, videoId: "" });
	};
	const currentProblem = problems.find((problem) => problem.order === currentProblemId) || problems[0];
	const nextProblemInOrder = problems.find((problem) => problem.order > currentProblemId) ||  problems[0];
	console.log("nextProblemInOrder", nextProblemInOrder);

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeModal();
		};
		window.addEventListener("keydown", handleEsc);

		return () => window.removeEventListener("keydown", handleEsc);
	}, []);

	return (
		<>
			<div className='text-white text-xl font-bold ml-10 mt-5 tracking-wider'>Levels</div>
			<tbody className='text-white'>
				{problems.map((problem, idx) => {
					return (
						<tr className={`problem-row ${problem.order < currentProblemId ? 'text-gray-500' : ''}`} key={problem.id}>
							<th className='px-2 py-4 font-medium whitespace-nowrap text-dark-green-s'>
								{solvedProblems.includes(problem.id.toString())}
							</th>
							<td className='px-6 py-3'>
								{problem.order <= currentProblemId ? (
									<Link
										className='hover:text-blue-600 cursor-pointer'
										href={`/problems/${problem.id.toString()}`}
									>
										{problem.title}
									</Link>
								) : (
									(problem.id === nextProblemInOrder?.id && solvedProblems.includes(
										currentProblem.id.toString()
									) ) ? (
										<Link
											className='hover:text-blue-600 cursor-pointer'
											href={`/problems/${problem.id.toString()}`}
										>
											{problem.title}
										</Link>
									
									) :
									<>🔒 {problem.title}</>
								)}
							</td>
						</tr>
					);
				})}
			</tbody>
		</>
	);
};
export default ProblemsTable;

function useGetProblems(setLoadingProblems: React.Dispatch<React.SetStateAction<boolean>>) {
	const [problems, setProblems] = useState<DBProblem[]>([]);

	useEffect(() => {
		const getProblems = async () => {
			// fetching data logic
			setLoadingProblems(true);
			const problemList = await getProblemsList();
			setProblems(problemList);
			setLoadingProblems(false);
		};

		getProblems();
	}, [setLoadingProblems]);
	return problems;
}

function useGetSolvedProblems() {
	const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
	const [user] = useAuthState(auth);

	useEffect(() => {
		const getSolvedProblems = async () => {
			// Retrieve solved problems from localStorage
			const solvedProblemsString = localStorage.getItem(`solvedProblems`);

			if (solvedProblemsString) {
				const solvedProblemsArray = JSON.parse(solvedProblemsString);
				setSolvedProblems(solvedProblemsArray);
			} else {
				setSolvedProblems([]);
			}
		};

		// if (user) getSolvedProblems();
		// if (!user) setSolvedProblems([]);
		getSolvedProblems();
	}, [user]);

	return solvedProblems;
}