import Link from "next/link";
import { Button } from "../ui/button"
import { FaCopy, FaFileExcel, FaPrint } from "react-icons/fa"

const BtnTrio = () => {
  return (
    <div className='flex justify-between items-center gap-2'>
      <Button className='px-6 bg-[#33E89C]/30 text-[#33E89C] font-bold hover:bg-[#33E89C] hover:text-white text-xs group rounded-full' asChild>
        <Link href="#">
          <FaCopy size={10} className='group-hover:fill-white mr-1' /> Copy
        </Link>
      </Button>
      <Button className='px-6 bg-[#33E89C]/30 text-[#33E89C] font-bold hover:bg-[#33E89C] hover:text-white text-xs group rounded-full' asChild>
        <Link href="#">
          <FaFileExcel size={10} className='group-hover:fill-white mr-1' /> Excel
        </Link>
      </Button>
      <Button className='px-6 bg-[#33E89C]/30 text-[#33E89C] font-bold hover:bg-[#33E89C] hover:text-white text-xs group rounded-full' asChild>
        <Link href="#">
          <FaPrint size={10} className='group-hover:fill-white mr-1' /> Print
        </Link>
      </Button>
    </div>
  )
}

export default BtnTrio;
