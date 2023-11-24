import { useState, useEffect } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from '@codemirror/view';
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { DBProblem } from "@/utils/types/problem";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/firebase";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import useLocalStorage from "@/hooks/useLocalStorage";
import { solveProblem } from "@/mockProblems/problems";
import useWindowSize from "@/hooks/useWindowSize";

type PlaygroundProps = {
	problem: DBProblem;
	setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
	setSolved: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISettings {
	fontSize: string;
	settingsModalIsOpen: boolean;
	dropdownIsOpen: boolean;
}

const Playground: React.FC<PlaygroundProps> = ({ problem, setSuccess, setSolved }) => {
	const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
	let [userCode, setUserCode] = useState<string>("");

	const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");

	const [settings, setSettings] = useState<ISettings>({
		fontSize: fontSize,
		settingsModalIsOpen: false,
		dropdownIsOpen: false,
	});

	const [user] = useAuthState(auth);
	const {
		query: { pid },
	} = useRouter();

	const [response, setResponse] = useState<{ answer: string; correct: boolean; explanation: string } | null>(null);

	const { width, height } = useWindowSize();
	const isMobile = width <= 768;

	const router = useRouter();
	const handleNext = async () => {
		router.push(`/problems/${problem.id + 1}`);
		router.reload();
	}

	const handleSubmit = async () => {
		// if (!user) {
		// 	toast.error("Please login to submit your code", {
		// 		position: "top-center",
		// 		autoClose: 3000,
		// 		theme: "dark",
		// 	});
		// 	return;
		// }
		const user = {
			uid: 'mockUserId',
		};
		userCode = userCode.slice(userCode.indexOf(""));
		const response = await solveProblem({ question_id: Number(problem.id), answer: userCode, language: 'en' });
		setResponse(response);
		if (response && response.correct) {
			toast.success("Congrats! All tests passed!", {
				position: "top-center",
				autoClose: 3000,
				theme: "dark",
			});
			setSuccess(true);
			setTimeout(() => {
				setSuccess(false);
			}, 4000);

			if (user.uid != 'mockUserId') {
				const userRef = doc(firestore, "users", user.uid);
				await updateDoc(userRef, {
					solvedProblems: arrayUnion(pid),
				});
			}
			setSolved(true);
		}
	};

	useEffect(() => {
		const code = localStorage.getItem(`code-${pid}`);
		if (user) {
			setUserCode(code ? JSON.parse(code) : "");
		} else {
			setUserCode("");
		}
	}, [pid, user, "problem.starterCode"]);

	const onChange = (value: string) => {
		setUserCode(value);
		localStorage.setItem(`code-${pid}`, JSON.stringify(value));
	};

	return (
		<div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
			<PreferenceNav settings={settings} setSettings={setSettings} />

			<Split className={isMobile ? 'h-[calc(75vh-94px)]' : 'h-[calc(100vh-94px)]'} direction='vertical' sizes={isMobile ? [40, 60] : [60, 40]} minSize={120}>
				<div className='w-full overflow-auto'>
					<CodeMirror
						value={userCode}
						theme={vscodeDark}
						onChange={onChange}
						extensions={[EditorView.lineWrapping]}
						style={{ fontSize: settings.fontSize }}
					/>
				</div>
				<div className='w-full h-full px-5 overflow-auto'>
					{/* testcase heading */}
					<div className='flex h-10 items-center space-x-6 justify-between'>
						<div className='relative flex h-full flex-col justify-center cursor-pointer'>
							<div className='text-sm font-medium leading-5 text-white'>Answer</div>
							<hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />
						</div>
						<div className='ml-auto flex items-center space-x-4'>
							<button
								className='mt-3 px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-white bg-dark-green-s hover:bg-green-3 rounded-lg'
								onClick={handleSubmit}
							>
								Submit
							</button>
							{response && response.correct && (
								<button
									className='mt-3 px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-white bg-dark-blue-s hover:bg-green-3 rounded-lg'
									onClick={handleNext}
								>
									Next
								</button>
							)}
						</div>
					</div>

					{/* <div className='flex'>
						{problem.examples.map((example, index) => (
							<div
								className='mr-2 items-start mt-2 '
								key={example.id}
								onClick={() => setActiveTestCaseId(index)}
							>
								<div className='flex flex-wrap items-center gap-y-4'>
									<div
										className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
										${activeTestCaseId === index ? "text-white" : "text-gray-500"}
									`}
									>
										Case {index + 1}
									</div>
								</div>
							</div>
						))}
					</div> */}

					<div className='font-semibold my-4'>
						{/* <p className='text-sm font-medium mt-4 text-white'>Input:</p>
						<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
							{problem.examples[activeTestCaseId].inputText}
						</div> */}
						<h1 className={`text-2xl ${response ? (response.correct ? 'text-green-500' : 'text-red-500') : ''}`}>
							{response ? (response.correct ? 'Correct' : 'Incorrect') : ''}
						</h1>
						<p className='text-sm font-medium mt-4 text-white'>Output:</p>
						<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
							{response && response.answer}
						</div>
						<p className='text-sm font-medium mt-4 text-white'>explanation:</p>
						<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
							{response && response.explanation}
						</div>
					</div>
				</div>
			</Split>
			{/* <EditorFooter handleSubmit={handleSubmit} /> */}
		</div>
	);
};
export default Playground;
