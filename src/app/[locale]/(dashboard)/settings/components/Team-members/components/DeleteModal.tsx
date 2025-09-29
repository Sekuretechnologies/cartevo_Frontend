import CButton from "@/components/shared/CButton";
import { X } from "lucide-react";
import React from "react";

const DeleteModal = () => {
	return (
		<div className="h-screen w-screen bg-black/20 backdrop-blur-sm absolute z-40 left-0 top-0 flex justify-center items-center">
			<div className="p-8 w-[500px] bg-white rounded-2xl">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold text-primary">
						Confirm Delete
					</h1>
					<button className="hover:bg-gray-200 duration-300 p-1 rounded-md">
						<X className="text-gray-500 hover:text-black" />
					</button>
				</div>
				<p>
					Are you sure you want to delete this team member? This
					action cannot be undone.
				</p>
				<div className=" flex justify-start items-center gap-4 mt-8">
					<CButton text="Delete" btnStyle="red" />
					<CButton text="Cancel" btnStyle="blue" />
				</div>
			</div>
		</div>
	);
};

export default DeleteModal;
