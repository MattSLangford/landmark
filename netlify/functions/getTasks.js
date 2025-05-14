// netlify/functions/getTasks.js
const fetch = require('node-fetch');

exports.handler = async () => {
  try {
	// 1) Sign in to Godspeed → get JWT
	const signinRes = await fetch(
	  "https://api.godspeedapp.com/sessions/sign_in",
	  {
		method:  "POST",
		headers: { "Content-Type": "application/json" },
		body:    JSON.stringify({
		  email:    process.env.GODSPEED_EMAIL,
		  password: process.env.GODSPEED_PASSWORD
		})
	  }
	);
	if (!signinRes.ok) {
	  const text = await signinRes.text();
	  throw new Error(`Sign-in failed (${signinRes.status}): ${text}`);
	}
	const { token } = await signinRes.json();

	// 2) Fetch only incomplete tasks from your list
	const listId = process.env.GODSPEED_LIST_ID;
	if (!listId) {
	  throw new Error("Missing GODSPEED_LIST_ID environment variable");
	}
	const url = `https://api.godspeedapp.com/tasks?status=incomplete&list_id=${encodeURIComponent(listId)}`;
	const tasksRes = await fetch(url, {
	  headers: { Authorization: `Bearer ${token}` }
	});
	if (!tasksRes.ok) {
	  const text = await tasksRes.text();
	  throw new Error(`Tasks fetch failed (${tasksRes.status}): ${text}`);
	}

	// 3) Extract the array out of raw.tasks
	const raw = await tasksRes.json();
	const items = Array.isArray(raw.tasks) ? raw.tasks : null;
	if (!items) {
	  throw new Error(`Unexpected response shape: ${JSON.stringify(raw)}`);
	}

	// 4) Map into the shape your front-end expects
	const tasks = items.map(t => ({
	  content:     t.title,
	  description: t.notes,
	  due:         t.due_at ? { string: new Date(t.due_at).toLocaleDateString() } : null,
	  completed:   t.completed,
	  created_at:  t.created_at
	}));

	// 5) Return to client
	return {
	  statusCode: 200,
	  headers:    { "Content-Type": "application/json" },
	  body:       JSON.stringify(tasks)
	};

  } catch (error) {
	console.error("getTasks error:", error);
	return {
	  statusCode: 500,
	  headers:    { "Content-Type": "application/json" },
	  body:       JSON.stringify({ message: error.message })
	};
  }
};