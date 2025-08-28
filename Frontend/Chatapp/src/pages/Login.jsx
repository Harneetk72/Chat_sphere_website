import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		try {
			const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
			if (onLogin) onLogin(res.data.user);
		} catch (err) {
			setError('Login failed');
		}
	};

	return (
		<div className="max-w-md mx-auto p-6 bg-white rounded shadow">
			<h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={e => setEmail(e.target.value)}
					className="w-full p-2 border rounded"
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={e => setPassword(e.target.value)}
					className="w-full p-2 border rounded"
					required
				/>
				{error && <div className="text-red-500 text-sm">{error}</div>}
				<button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
			</form>
		</div>
	);
};

export default Login;
