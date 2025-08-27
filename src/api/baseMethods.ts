class BaseMethods {
	//////////////// Internal usage //////////////////////
	static getHeaders(isFile: boolean = false): Headers {
		const headers = new Headers();
		if (!isFile) {
			headers.append("Content-Type", "application/json");
		}
		headers.append("Accept", "application/json");
		headers.append("Access-Control-Allow-Origin", "*");
		headers.append("Origin", "*");
		headers.append("Credentials", "same-origin");
		return headers;
	}

	static getHeadersAuth(
		isFile: boolean = false,
		inputToken?: string
	): Headers {
		const headers = BaseMethods.getHeaders(isFile);
		const token = inputToken
			? inputToken
			: localStorage.getItem("sktoken")
			? localStorage.getItem("sktoken") || ""
			: "";
		// TODO: redirect if not logged in
		// if (token === '') {
		//     window.location.pathname = `/auth/login/?redirect=${window.location.pathname}`;
		// }
		headers.append("Authorization", `Bearer ${token}`);
		return headers;
	}

	///////////////// External usage ////////////////////
	static postRequest = async (
		url: string,
		body: any,
		required_auth: boolean,
		queryParams?: Record<string, string>,
		inputToken?: string
	): Promise<Response> => {
		// console.log({ url });
		// console.log({ body });
		// console.log({ required_auth });
		// console.log({ queryParams });
		let finalUrl = url;
		if (queryParams && Object.keys(queryParams).length > 0) {
			const params = new URLSearchParams(queryParams);
			finalUrl += "?" + params.toString();
		}

		let headers: HeadersInit;
		if (required_auth) {
			headers = BaseMethods.getHeadersAuth(false, inputToken);
		} else {
			headers = BaseMethods.getHeaders();
		}

		const requestOptions: RequestInit = {
			method: "POST",
			headers: headers,
			mode: "cors",
			cache: "default",
			body: JSON.stringify(body),
		};

		return fetch(finalUrl, requestOptions);
	};

	static postFileRequest = async (
		url: string,
		body: any,
		required_auth: boolean,
		queryParams?: Record<string, string>,
		inputToken?: string
	): Promise<Response> => {
		let finalUrl = url;
		if (queryParams && Object.keys(queryParams).length > 0) {
			const params = new URLSearchParams(queryParams);
			finalUrl += "?" + params.toString();
		}
		const head = required_auth
			? BaseMethods.getHeadersAuth(true, inputToken)
			: BaseMethods.getHeaders(true);

		const headers: RequestInit = {
			method: "POST",
			headers: head,
			mode: "cors",
			cache: "default",
			body: body,
		};
		const response = await fetch(finalUrl, headers)
			.then((response) => {
				return response;
			})
			.catch((err) => {
				return err;
			});
		return response;
	};

	static getRequest = async (
		url: string,
		required_auth: boolean,
		queryParams?: Record<string, string>,
		inputToken?: string
	) => {
		let finalUrl = url;

		// Append query parameters if provided
		if (queryParams && Object.keys(queryParams).length > 0) {
			const params = new URLSearchParams(queryParams);
			finalUrl += "?" + params.toString();
		}
		// console.log(`finalUrl : ${finalUrl}`, queryParams);

		const head = required_auth
			? BaseMethods.getHeadersAuth(false, inputToken)
			: BaseMethods.getHeaders();

		const headers: RequestInit = {
			method: "GET",
			headers: head,
			mode: "cors",
			cache: "default",
		};
		return fetch(finalUrl, headers);
	};

	static putFileRequest = async (
		url: string,
		body: any,
		required_auth: boolean,
		queryParams?: Record<string, string>,
		inputToken?: string
	): Promise<Response> => {
		let finalUrl = url;
		if (queryParams && Object.keys(queryParams).length > 0) {
			const params = new URLSearchParams(queryParams);
			finalUrl += "?" + params.toString();
		}

		const head = required_auth
			? BaseMethods.getHeadersAuth(true, inputToken)
			: BaseMethods.getHeaders(true);

		const headers: RequestInit = {
			method: "PUT",
			headers: head,
			mode: "cors",
			cache: "default",
			body: body,
		};
		const response = await fetch(finalUrl, headers)
			.then((response) => {
				return response;
			})
			.catch((err) => {
				return err;
			});
		return response;
	};

	static putRequest = async (
		url: string,
		body: any,
		required_auth: boolean,
		queryParams?: Record<string, string>,
		inputToken?: string
	): Promise<Response> => {
		let finalUrl = url;
		if (queryParams && Object.keys(queryParams).length > 0) {
			const params = new URLSearchParams(queryParams);
			finalUrl += "?" + params.toString();
		}

		const head = required_auth
			? BaseMethods.getHeadersAuth(true, inputToken)
			: BaseMethods.getHeaders();

		const headers: RequestInit = {
			method: "PUT",
			headers: head,
			mode: "cors",
			cache: "default",
			body: JSON.stringify(body),
		};
		return fetch(finalUrl, headers);
	};

	static patchRequest = async (
		url: string,
		body: any,
		required_auth: boolean,
		queryParams?: Record<string, string>,
		inputToken?: string
	): Promise<Response> => {
		let finalUrl = url;
		if (queryParams && Object.keys(queryParams).length > 0) {
			const params = new URLSearchParams(queryParams);
			finalUrl += "?" + params.toString();
		}

		const head = required_auth
			? BaseMethods.getHeadersAuth(true, inputToken)
			: BaseMethods.getHeaders();

		const headers: RequestInit = {
			method: "PATCH",
			headers: head,
			mode: "cors",
			cache: "default",
			body: JSON.stringify(body),
		};
		return fetch(finalUrl, headers);
	};

	static deleteRequest = async (
		url: string,
		body: any,
		required_auth: boolean,
		inputToken?: string
	): Promise<Response> => {
		let head = required_auth
			? BaseMethods.getHeadersAuth(true, inputToken)
			: BaseMethods.getHeaders();

		let headers: RequestInit = {
			method: "DELETE",
			headers: head,
			mode: "cors",
			cache: "default",
			body: JSON.stringify(body),
		};
		return fetch(url, headers);
	};
}

export default BaseMethods;
