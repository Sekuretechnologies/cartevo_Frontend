import { Menu, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { BsDot } from 'react-icons/bs'
import { FaChevronDown } from 'react-icons/fa'

interface CustomDropdownProps {
    btnChild?:React.ReactElement;
    title?: string;
    cstyle: string;
    iconSize?: number;
    hasDropdownIcon?: boolean;
    icon?: React.ReactElement;
    items: React.ReactElement[];
}

const CustomDropdown2: React.FC<CustomDropdownProps> = ({ title, btnChild, cstyle, iconSize, icon, items, hasDropdownIcon=true }) => {
    let color = '';
    if (cstyle === 'green') {
       color = '#fff';
    } else if (cstyle === 'light-green') {
       color = '#18BC7A';
    } else {
        color = '#202020';
    }
    const iconElement = icon ? React.cloneElement(icon as React.ReactElement<any>, { size: iconSize ?? 15, color }) : null;

  return (
    <div className="text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button >
            <div 
            className={`flex justify-between items-center gap-3 py-2 px-4 rounded-full cursor-pointer
            ${cstyle == 'green'?
                'bg-[#18BC7A] hover:bg-[#18BC7A]/80'
                : cstyle == 'light-green'?
                'bg-[#18BC7A]/10 hover:bg-[#18BC7A]/20'
                : cstyle == 'outline'?
                'border border-solid border-[#444]'
                :''
             } `}>          
                {btnChild ?
                <>{btnChild}</>
                :
                <>
                {title ? 
                <span className={`text-sm text-[${color}]`}>
                    {title}
                </span> : <></>}
                {iconElement}
                {hasDropdownIcon ?
                <FaChevronDown size={15} color={color} />
                :<></>}
                </>
                }
            </div>

            {/* <div className="inline-flex w-full justify-center rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                Options
                <FaChevronDown
                className="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
                aria-hidden="true"
                />
            </div> */}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className={`absolute right-0 mt-2 min-w-[100px] origin-top-right divide-y 
          divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 
          focus:outline-none`}>
            <div className={`px-1 py-1 ${cstyle == 'green'?
                'bg-[#18BC7A] '
                : cstyle == 'light-green'?
                'bg-[#F3FFF8]'
                :''
             }`}>
                {items?.map((item, index) =>  {
                    return (
                        <Menu.Item key={index}>
                            <div className={`min-h-[30px] w-full py-1 px-2 cursor-pointer flex items-center 
                            `}>
                            {React.cloneElement(item as React.ReactElement<any>)}
                            </div>
                        </Menu.Item>
                )})}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>

    // <Menu>
    //   <Menu.Button>
    //   <div className='flex justify-between items-center gap-1 py-2 px-4 bg-[#18BC7A]/10 hover:bg-[#18BC7A]/20 rounded-full cursor-pointer'>          
    //       <span className='text-sm text-[#18BC7A]'>
    //         More
    //       </span>
    //       <FaChevronDown size={15} color={'#18BC7A'} />
    //     </div>
    //   </Menu.Button>
    //   <Menu.Items>
    //     <Menu.Item>
    //       {({ active }) => (
    //         <a
    //           className={`${active && 'bg-blue-500'}`}
    //           href="/account-settings"
    //         >
    //           Account settings
    //         </a>
    //       )}
    //     </Menu.Item>
    //     <Menu.Item>
    //       {({ active }) => (
    //         <a
    //           className={`${active && 'bg-blue-500'}`}
    //           href="/account-settings"
    //         >
    //           Documentation
    //         </a>
    //       )}
    //     </Menu.Item>
    //     <Menu.Item disabled>
    //       <span className="opacity-75">Invite a friend (coming soon!)</span>
    //     </Menu.Item>
    //   </Menu.Items>
    // </Menu>
  )
}


export default CustomDropdown2;





















// import Head from "next/head";
// import { Dropdown, Text, Grid, User, useSSR } from "@nextui-org/react";

// export default function SelectDropDown() {
//   const { isBrowser } = useSSR();

//   async function handelFilter({filter_option}:{filter_option:string}) {
//     const filter_option2 = filter_option.split(",").map(String);
//     console.log("THIS IS FILTER OPTION", filter_option2);
//   }

//   return (
//     isBrowser && (
//       <div
//         style={{
//           backgroundColor: "#E6F1F6",
//           height: "960px",
//           width: "1820px",
//         }}
//       >
//         <Head>
//           <title>Bunnyfied Labs</title>
//         </Head>

//         <span>
//           <Grid.Container
//             style={{
//               display: "flex",
//               marginLeft: "40%",
//               paddingTop: "200px",
//             }}
//             gap={2}
//           >
//             <Grid>
//               <Dropdown placement="bottom-left" color={"red"}>
//                 <Dropdown.Trigger>
//                   <User
//                     bordered
//                     as="button"
//                     size="lg"
//                     color="primary"
//                     name="BUNNYFIEDLABS PVT LTD"
//                     description="@BunnyfiedLabs"
//                     src="./img/5.png"
//                   />
//                 </Dropdown.Trigger>
//                 <Dropdown.Menu
//                   onAction={handelFilter}
//                   aria-label="User Actions"
//                   css={{ backgroundColor: "#CCCCCC" }}
//                 >
//                   <Dropdown.Item
//                     key="profile"
//                     css={{ height: "$18" }}
//                     color={"warning"}
//                     textValue
//                   >
//                     <Text b color="inherit" css={{ d: "flex" }}>
//                       Signed in as
//                     </Text>
//                     <Text b color="inherit" css={{ d: "flex" }}>
//                       info@bunnyfiedlabs.com
//                     </Text>
//                   </Dropdown.Item>
//                   <Dropdown.Item key="settings" withDivider>
//                     My Settings
//                   </Dropdown.Item>
//                   <Dropdown.Item key="team_settings">
//                     Team Settings
//                   </Dropdown.Item>
//                   <Dropdown.Item key="analytics" withDivider>
//                     Analytics
//                   </Dropdown.Item>
//                   <Dropdown.Item key="system">System</Dropdown.Item>
//                   <Dropdown.Item key="configurations">
//                     Configurations
//                   </Dropdown.Item>
//                   <Dropdown.Item key="help_and_feedback" withDivider>
//                     Help & Feedback
//                   </Dropdown.Item>
//                   <Dropdown.Item key="logout" color="error" withDivider>
//                     Log Out
//                   </Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </Grid>
//           </Grid.Container>
//         </span>
//       </div>
//     )
//   );
// }