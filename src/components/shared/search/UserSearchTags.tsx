import { useState, ChangeEvent, useEffect } from "react";
import { MdClose } from "react-icons/md";
import SearchUserInput from "./UserSearchInput";

interface iTag {
	tags?: string[];
	addTag?: (tag: string) => void;
	removeTag?: (tag: string) => void;
	onChange?: (tags: string[]) => void;
	max?: number;
	field?: any;
}

export const UserSearchTags = ({
	field,
	tags,
	onChange,
	addTag,
	removeTag,
	max = 2,
}: iTag) => {
	// track the use input
	// console.log("TagField field : ", field);
	const [placeholder, setPlaceholder] =
		useState<string>("Ajouter un élément");
	const [userInput, setUserInput] = useState<string>(" ");
	const [items, setItems] = useState<string[]>(tags ?? []);

	useEffect(() => {
		if (items !== field.value) {
			console.log("updateField : ", items);

			onChange && onChange(items);
		}
		setPlaceholder(
			items.length === max
				? `Vous avez atteint la limite de ${max} éléments`
				: "Ajouter un élément"
		);
	}, [items]);

	// Function to handle adding the tag to the array

	const handleAddTag = (newItem: any) => {
		if (newItem?.phone && !items.includes(newItem) && items.length < max) {
			setItems([...items, newItem.phone]);
		}
	};

	// Function to remove tag from array
	const handleRemoveTag = (tag: string) =>
		setItems(items.filter((t) => t !== tag));

	return (
		<div className="flex flex-col gap-2 w-full">
			<SearchUserInput onSelected={(data) => handleAddTag(data)} />
			{/* <input
        name={field?.name ?? "keyword_tags"}
        type="text"
        placeholder={placeholder}
        className={`w-full border border-gray-200 ${items.length === max ? "bg-gray-200":"bg-[#F4EFE3]"} text-gray-900 font-normal rounded-md px-4 py-2`}
        onKeyDown={handleKeyPress}
        onChange={handleInputChange}
        value={userInput}
        disabled={items.length === max}
      /> */}

			{/* ===== Render the tags here ===== */}

			<div className="flex flex-row flex-wrap gap-3 rounded-md min-w-[250px] min-h-[43px] py-2 px-3">
				{items.map((tag: string, index: number) => (
					<span
						key={`${index}-${tag}`}
						className="flex items-center justify-center px-3 py-2 rounded-[32px] text-sm shadow-sm font-medium bg-gray-200 text-gray-900 h-fit"
					>
						{tag}
						<span
							className="ml-2 text-gray-900 font-normal"
							onClick={() => handleRemoveTag(tag)}
							title={`Remove ${tag}`}
						>
							<MdClose size={18} />
						</span>
					</span>
				))}
			</div>
			{/* <div className="flex flex-row flex-wrap gap-3 mt-4">
        {tags.map((tag: string, index: number) => (
          <span
            key={`${index}-${tag}`}
            className="inline-flex items-start justify-start px-3 py-2 rounded-[32px] text-sm shadow-sm font-medium bg-blue-100 text-blue-800 mr-2"
          >
            {tag}
            <button
              className="ml-2 hover:text-blue-500"
              onClick={() => removeTag(tag)}
              title={`Remove ${tag}`}
            >
              &times;
            </button>
          </span>
        ))}
      </div> */}
		</div>
	);
};
