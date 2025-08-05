import { IoIosStarOutline } from "react-icons/io";

const Flag = () => {
  return (
    <>
      <span className="py-[1px] px-2 ml-3 bg-[#007656] rounded-tl-md rounded-bl-md" />
      <span className="py-[1px] px-1 bg-[#D10E31]"><IoIosStarOutline size={10} color="#FCCC00" className="mb-1 inline"/></span>
      <span className="py-[1px] px-2 bg-[#007656] rounded-tr-md rounded-br-md" />
    </>
  )
}

export default Flag;
