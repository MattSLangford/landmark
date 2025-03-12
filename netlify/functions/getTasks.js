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
		// Fetch active tasks
		const activeTasksResponse = await fetch(`https://api.todoist.com/rest/v2/tasks?project_id=${PROJECT_ID}`, {
			headers: { "Authorization": `Bearer ${API_KEY}` }
		});

		if (!activeTasksResponse.ok) {
			return {
				statusCode: activeTasksResponse.status,
				body: JSON.stringify({ error: "Failed to fetch active tasks" })
			};
		}

		const activeTasks = await activeTasksResponse.json();

		// Fetch completed tasks
		const completedTasksResponse = await fetch(`https://api.todoist.com/sync/v9/completed/get_all?project_id=${PROJECT_ID}`, {
			headers: { "Authorization": `Bearer ${API_KEY}` }
		});

		if (!completedTasksResponse.ok) {
			return {
				statusCode: completedTasksResponse.status,
				body: JSON.stringify({ error: "Failed to fetch completed tasks" })
			};
		}

		const completedData = await completedTasksResponse.json();
		const completedTasks = completedData.items.map(task => ({
			content: task.content,
			completed: true
		}));

		// Combine active and completed tasks into one response
		const allTasks = [...activeTasks, ...completedTasks];

		return {
			statusCode: 200,
			body: JSON.stringify(allTasks)
		};

	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Server error", details: error.message })
		};
	}
};
