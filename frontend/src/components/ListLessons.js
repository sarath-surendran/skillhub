import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BsPencilFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import AuthContext from "../context/AuthContext";
import Swal from 'sweetalert2'

const ListLessons = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { authToken } = useContext(AuthContext);

	const [lessons, setLessons] = useState([]);
	const [addLesson, setAddLesson] = useState(false);
	const [newLesson, setNewLesson] = useState({});
	const [allUploadsComplete, setAllUploadsComplete] = useState(false);
	const [uploadProgress, setUploadProgress] = useState([]);

	const [errorIndex, setErrorIndex] = useState(0);
	const [errorMessages, setErrorMessages] = useState([]);

	useEffect(() => {
		if (errorMessages.length > 0) {
			alert(errorMessages[errorIndex][0]);
		}
	}, [errorMessages, errorIndex]);

	const fetchlessons = async (id) => {
		try {
			const response = await axios.get(
				`http://127.0.0.1:8000/courses/view_courses/lessons/?id=${id}`
			);
			setLessons(response.data);
		} catch (error) {
			console.error("Error listing lessons : ", error);
		}
	};

	const deleteLesson = async (lesson_id) => {
		// try {
		// 	const response = await axios.delete(
		// 		`http://127.0.0.1:8000/courses/view_courses/lessons/delete/?id=${lesson_id}`,

		// 		{
		// 			headers: {
		// 				Authorization: `Bearer ${authToken.access}`,
		// 			},
		// 		}
		// 	);

		// 	if (response.status === 204) {
		// 		fetchlessons(id);
		// 	}
		// } catch (error) {
		// 	console.error("Error deleting lesson : ", error);
		// }
		try{
			Swal.fire({
				title: 'Are you sure?',
				text: "You won't be able to revert this!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!'
			  }).then(async (result) => {
				if (result.isConfirmed) {
					try {
						const response = await axios.delete(
							`http://127.0.0.1:8000/courses/view_courses/lessons/delete/?id=${lesson_id}`,
			
							{
								headers: {
									Authorization: `Bearer ${authToken.access}`,
								},
							}
						);
			
						if (response.status === 204) {
							fetchlessons(id);
						}
					} catch (error) {
						console.error("Error deleting lesson : ", error);
					}

				//   Swal.fire(
				// 	'Deleted!',
				// 	'Your file has been deleted.',
				// 	'success'
				//   )
				}
			  })
		}
		catch(error){
			console.error("Error deleting lesson ",error)
		}
	};

	useEffect(() => {
		if (
			uploadProgress.length > 0 &&
			uploadProgress.every((progress) => progress === 100)
		) {
			setAllUploadsComplete(true);
		} else {
			setAllUploadsComplete(false);
		}
	}, [uploadProgress]);

	const handleLessonChange = (e) => {
		const { name, value } = e.target;
		setNewLesson({ ...newLesson, [name]: value });
	};

	const handleLessonVideoChange = (event) => {
		const videoFile = event.target.files[0];
		if (videoFile) {
			console.log("Video file present");
			try {
				const storage = getStorage();
				const storageRef = ref(storage, `lesson_videos/${videoFile.name}`);
				const uploadTask = uploadBytesResumable(storageRef, videoFile);

				uploadTask.on(
					"state_changed",
					(snapshot) => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log(`Upload is ${progress}% done`);
						console.log(newLesson);
						const updatedProgress = [...uploadProgress];
						updatedProgress[0] = progress;
						setUploadProgress(updatedProgress);
					},
					(error) => {
						console.error("Error uploading video : ", error);
					},
					async (e) => {
						const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
						console.log(downloadURL);
						setNewLesson((prevlesson) => ({
							...prevlesson,
							content_video_url: downloadURL,
						}));
					}
				);
			} catch (error) {
				console.error("error handling video upload : ", error);
			}
		}

		// handleLessonChange(index, "content_video", videoFile); {only this line is there in originally worked code after defining the video file. total 2 lines in this function}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("title", newLesson.title);
		formData.append("content_video_url", newLesson.content_video_url);
		formData.append("course", id);
		try {
			// const lessonData = {
			// 	title: newLesson.title,
			// 	content_video_url: newLesson.content_video_url,
			// 	course: id, // Associate the lesson with the course
			//   };

			const response = await axios.post(
				`http://127.0.0.1:8000/courses/view_courses/lessons/add_lesson/?id=${id}`,
				// newLesson,
				// lessonData,
				formData,

				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${authToken.access}`,
					},
				}
			);
			console.log("new lesson added.", response.data);
			setNewLesson({});
			setAddLesson(false);
			fetchlessons(id);
		} catch (error) {
			console.error("Error adding new lesson : ", error);
			if (error.response && error.response.data) {
				const errorData = error.response.data;
				setErrorMessages(Object.values(errorData));
				setErrorIndex(0);
			}
		}
	};

	useEffect(() => {
		fetchlessons(id);
	}, []);

	return (
		<div>
			{lessons.map((item, index) => {
				return (
					<div>
						<div className="flex justify-between">
							<li
								key={item.id}
								onClick={() => window.open(item.content_video_url, "_blank")}
								// className="cursor-pointer border-b border-gray-300 hover:bg-gray-100 p-2"
								className="flex items-center border-b border-gray-300 hover:bg-gray-100 p-2"
							>
								{index + 1}. {item.title}
							</li>
							<div className="flex space-x-6 mt-2">
								<button
									className="text-blue-500 hover:text-blue-700"
									onClick={() =>
										navigate(
											`/profile/my_courses/lessons/update_lesson/${id}/${item.id}`
										)
									}
								>
									<BsPencilFill />
								</button>
								<button
									className="text-red-500 hover:text-red-700"
									onClick={() => {
										deleteLesson(item.id);
									}}
								>
									<MdDelete />
								</button>
							</div>
						</div>
					</div>
				);
			})}
			{!addLesson && (
				<button
					onClick={() => {
						setAddLesson(!addLesson);
					}}
					className="bg-blue-500 text-white py-2 px-4 rounded"
				>
					Add Lesson
				</button>

			)}
			{addLesson && (
				<div>
					<form className="space-y-4">
						<div>
							<input
								type="text"
								name="title"
								placeholder="Lesson Title"
								value={newLesson.title}
								onChange={(e) => handleLessonChange(e)}
								className="w-full px-4 py-2 border rounded-lg shadow"
							/>
							<input
								type="file"
								accept="video/*"
								onChange={(e) => handleLessonVideoChange(e)}
								className="w-full px-4 py-2 border rounded-lg shadow"
							/>
						</div>
						{uploadProgress[0] < 100 && (
							<span className="text-red-500">
								Video uploading. {uploadProgress[0]} %
							</span>
						)}
						{uploadProgress[0] == 100 && (
							<span className="text-red-500">Video uploaded</span>
						)}
						<br></br>
						<div className="space-x-5"> 
						<button
							type="button"
							onClick={handleSubmit}
							className={`bg-blue-500 text-white py-2 px-4 rounded ${!allUploadsComplete && "cursor-not-allowed opacity-50"
								}`}
							disabled={!allUploadsComplete}
						>
							Add Lesson
						</button>
						<button
							onClick={() => {
								setAddLesson(false);
							}}
							className={`bg-red-400 text-white py-2 px-4 rounded ${allUploadsComplete && "cursor-not-allowed opacity-50"
								}`}
						>
							Cancel
						</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
};

export default ListLessons;
