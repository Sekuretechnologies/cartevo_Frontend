"use client";
import { useContext, useEffect } from "react";
import { capitalize } from "@/utils/capitalize";
import { context } from "@/context/ApplicationContext";
import { useRouter, usePathname } from "next/navigation";
import { selectCurrentToken, selectCurrentUser } from "@/redux/slices/auth";
import { useSelector } from "react-redux";

const useTitle = (title: string, isSecured?: boolean) => {
	// const router = useRouter();
	// const pathname = usePathname();
	// const token = useSelector(selectCurrentToken);
	// const user = useSelector(selectCurrentUser);
	// // console.log("token : ", token);
	
	useEffect(() => {
		if (typeof window !== "undefined") {
			window.document.title = capitalize(title);
		}
	}, [title]);
	
	// useEffect(() => {
	// 	if (!token) {
	// 		if (isSecured) {
	// 			router.push("/login");
	// 		}
	// 	}
	// }, [isSecured, router]);

	// useEffect(() => {
	// 	// const sktoken = localStorage.getItem('sktoken');
	// 	if(token && pathname=='/login') {
	// 		router.push("/dashboard");
	// 	}
	// 	// if(token && (pathname=='/dashboard/retrait-gb' || pathname=='/retrait-gb') && user.email !== "digitalixgroupltd@gmail.com" ) {
	// 	// 	router.push("/dashboard");
	// 	// }
    //     // console.log("Current URL:", pathname);
    // }, [pathname]);
};

export { useTitle };
