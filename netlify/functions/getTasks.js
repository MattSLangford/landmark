// netlify/functions/getTasks.js
const fetch = require('node-fetch');

exports.handler = async () => {
  // 1) Sign in to Godspeed to get a token
  const signinRes = await fetch("https://api.godspeedapp.com/sessions/sign_in", {
	method:  "POST",
	headers: { "Content-Type": "application/json" },
	body:    JSON.stringify({
	  email:    process.env.GODSPEED_EMAIL,
	  password: process.env.GODSPEED_PASSWORD
	})
  });
  if (!signinRes.ok) {
	return { statusCode: signinRes.status, body: "Godspeed sign-in failed" };
  }
  const { token } = await signinRes.json(); 
  // --> Use your email+password to sign in and get an access token  [oai_citation:0‡godspeedapp.com](https://godspeedapp.com/guides/api?utm_source=chatgpt.com)

  // 2) Fetch tasks with that token
  const tasksRes = await fetch("https://api.godspeedapp.com/tasks", {
	headers: { Authorization: `Bearer ${token}` }
  });
  if (!tasksRes.ok) {
	return { statusCode: tasksRes.status, body: "Error fetching tasks" };
  }
  const godspeedTasks = await tasksRes.json();

  // 3) Massage into your front-end shape
  const tasks = godspeedTasks
	// .filter(t => t.list_id === process.env.GODSPEED_LIST_ID)
	.map(t => ({
	  content:     t.title,
	  description: t.notes,
	  due:         t.due_at ? { string: new Date(t.due_at).toLocaleDateString() } : null,
	  completed:   t.completed,
	  created_at:  t.created_at
	}));

  return {
	statusCode: 200,
	body:       JSON.stringify(tasks)
  };
};