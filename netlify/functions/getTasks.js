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

	// 2) Fetch all tasks
	const tasksRes = await fetch("https://api.godspeedapp.com/tasks", {
	  headers: { Authorization: `Bearer ${token}` }
	});
	if (!tasksRes.ok) {
	  const text = await tasksRes.text();
	  throw new Error(`Tasks fetch failed (${tasksRes.status}): ${text}`);
	}
	const raw = await tasksRes.json();
	console.log("🔍 raw Godspeed response:", raw);

	// 3) Pull out the array (top-level, or .tasks, or .data)
	const items = Array.isArray(raw)
	  ? raw
	  : raw.tasks && Array.isArray(raw.tasks)
		? raw.tasks
		: raw.data && Array.isArray(raw.data)
		  ? raw.data
		  : null;

	if (!items) {
	  throw new Error(
		`Unexpected tasks response shape – expected an array but got: ${JSON.stringify(raw)}`
	  );
	}

	// 4) Filter to just the list you care about
	const listId = process.env.GODSPEED_LIST_ID;
	if (!listId) {
	  throw new Error("Missing GODSPEED_LIST_ID environment variable");
	}
	const filtered = items.filter(t => t.list_id === listId);

	// 5) Map into your front-end’s shape
	const tasks = filtered.map(t => ({
	  content:     t.title,
	  description: t.notes,
	  due:         t.due_at ? { string: new Date(t.due_at).toLocaleDateString() } : null,
	  completed:   t.completed,
	  created_at:  t.created_at
	}));

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