// netlify/functions/getTasks.js
const fetch = require('node-fetch');

exports.handler = async () => {
  try {
	// 1) Sign in to Godspeed to get a JWT
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
	const { token } = await signinRes.json();  //  [oai_citation:0‡Godspeed](https://godspeedapp.com/guides/api?utm_source=chatgpt.com)

	// 2) Fetch tasks with that token
	const tasksRes = await fetch("https://api.godspeedapp.com/tasks", {
	  headers: { Authorization: `Bearer ${token}` }
	});
	if (!tasksRes.ok) {
	  const text = await tasksRes.text();
	  throw new Error(`Tasks fetch failed (${tasksRes.status}): ${text}`);
	}
	const raw = await tasksRes.json();
	console.log("🔍 raw Godspeed response:", raw);

	// 3) Extract the array (could be top-level, or under .tasks or .data)
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

	// 4) Map to the shape your front-end expects
	const tasks = items.map(t => ({
	  content:     t.title,
	  description: t.notes,
	  due:         t.due_at ? { string: new Date(t.due_at).toLocaleDateString() } : null,
	  completed:   t.completed,
	  created_at:  t.created_at
	}));

	// 5) Return success
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