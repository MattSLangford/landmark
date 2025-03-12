exports.handler = async function () {
	const fetch = require("node-fetch");

	const API_KEY = process.env.TODOIST_API_KEY;
	const PROJECT_ID = process.env.TODOIST_PROJECT_ID;

	if (!API_KEY || !PROJECT_ID) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Missing API key or project ID" })
		};
	}

	try {
		// Fetch tasks from Todoist
		const response = await fetch(`https://api.todoist.com/rest/v2/tasks?project_id=${PROJECT_ID}`, {
			headers: {
				"Authorization": `Bearer ${API_KEY}`
			}
		});

		if (!response.ok) {
			return {
				statusCode: response.status,
				body: JSON.stringify({ error: "Failed to fetch tasks" })
			};
		}

		const tasks = await response.json();

		return {
			statusCode: 200,
			body: JSON.stringify(tasks)
		};

	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Server error", details: error.message })
		};
	}
};
