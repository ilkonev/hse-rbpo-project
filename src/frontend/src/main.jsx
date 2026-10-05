import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5050';

function App() {
  const [user, setUser] = useState(null);
  const [registerMode, setRegisterMode] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('volt-token');
    if (!token) return;
    request('/api/users/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(setUser)
      .catch(() => localStorage.removeItem('volt-token'));
  }, []);

  async function request(path, options = {}) {
    const response = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.message ?? body.errors?.Email?.[0] ?? 'Не удалось выполнить запрос.');
    }
    return response.json();
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form);
    try {
      const result = await request(registerMode ? '/api/auth/register' : '/api/auth/login', {
        method: 'POST', body: JSON.stringify(payload)
      });
      localStorage.setItem('volt-token', result.token);
      setUser(result);
    } catch (exception) { setError(exception.message); }
  }

  if (user) return <Dashboard user={user} onLogout={() => { localStorage.removeItem('volt-token'); setUser(null); }} />;
  return <AuthForm registerMode={registerMode} error={error} onSubmit={submit} onSwitch={() => setRegisterMode(!registerMode)} />;
}

function AuthForm({ registerMode, error, onSubmit, onSwitch }) {
  return <main className="auth"><section><div className="logo">V</div><p className="eyebrow">Volt</p><h1>{registerMode ? 'Создать учётную запись' : 'Вход в Volt'}</h1><p className="muted">Рабочее пространство для секретов команды.</p>
    <form onSubmit={onSubmit}>{registerMode && <label>Имя<input name="displayName" maxLength="80" required /></label>}<label>Email<input type="email" name="email" autoComplete="email" required /></label><label>Пароль<input type="password" name="password" minLength="8" autoComplete={registerMode ? 'new-password' : 'current-password'} required /></label>{error && <p className="error">{error}</p>}<button>{registerMode ? 'Зарегистрироваться' : 'Войти'}</button></form>
    <button className="link" type="button" onClick={onSwitch}>{registerMode ? 'Уже есть учётная запись? Войти' : 'Нет учётной записи? Зарегистрироваться'}</button>
  </section></main>;
}

function Dashboard({ user, onLogout }) {
  return <main className="dashboard"><aside><div className="brand"><span>V</span> Volt</div><nav><a className="active">Обзор</a><a>Секреты <small>скоро</small></a><a>Участники <small>скоро</small></a><a>Журнал <small>скоро</small></a></nav><button className="link logout" onClick={onLogout}>Выйти</button></aside><section className="content"><header><div><p className="eyebrow">Личное хранилище</p><h1>Здравствуйте, {user.displayName}</h1></div><span className="avatar">{user.displayName[0].toUpperCase()}</span></header><article><h2>Пространство готово</h2><p>Здесь появятся секреты, участники и журнал действий. Сейчас доступна регистрация и вход.</p></article></section></main>;
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
