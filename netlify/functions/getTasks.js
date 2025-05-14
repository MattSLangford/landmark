// netlify/functions/getTasks.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
	// 1) Sign in to Godspeed to get a JWT
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

	// 2) Fetch your tasks
	const tasksRes = await fetch("https://api.godspeedapp.com/tasks", {
	  headers: { Authorization: `Bearer ${token}` }
	});
	if (!tasksRes.ok) {
	  const text = await tasksRes.text();
	  throw new Error(`Tasks fetch failed (${tasksRes.status}): ${text}`);
	}
	const godspeedTasks = await tasksRes.json();

	// 3) Map them into the shape your front-end expects
	const tasks = godspeedTasks.map(t => ({
	  content:     t.title,
	  description: t.notes,
	  due:         t.due_at ? { string: new Date(t.due_at).toLocaleDateString() } : null,
	  completed:   t.completed,
	  created_at:  t.created_at
	}));

	// 4) Return success
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