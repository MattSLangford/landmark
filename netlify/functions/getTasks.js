// netlify/functions/getTasks.js
const fetch = require('node-fetch');

exports.handler = async () => {
  try {
	// 1. Sign in
	const signinRes = await fetch("https://api.godspeedapp.com/sessions/sign_in", {
	  method:  "POST",
	  headers: { "Content-Type": "application/json" },
	  body:    JSON.stringify({
		email:    process.env.GODSPEED_EMAIL,
		password: process.env.GODSPEED_PASSWORD
	  })
	});
	if (!signinRes.ok) {
	  const text = await signinRes.text();
	  throw new Error(`Sign-in failed (${signinRes.status}): ${text}`);
	}
	const { token } = await signinRes.json();

	// 2. Fetch tasks
	const tasksRes = await fetch("https://api.godspeedapp.com/tasks", {
	  headers: { Authorization: `Bearer ${token}` }
	});
	if (!tasksRes.ok) {
	  const text = await tasksRes.text();
	  throw new Error(`Tasks fetch failed (${tasksRes.status}): ${text}`);
	}
	const godspeedTasks = await tasksRes.json();

	// 3. Map to front-end shape
	const tasks = godspeedTasks.map(t => ({
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