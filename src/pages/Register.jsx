import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'client' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.email, form.password, form.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16 p-8 bg-white rounded-xl shadow-md">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">Créer un compte Vitrina</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-gray-700">
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-gray-700">
          Mot de passe (8 caractères minimum)
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-gray-700">
          Je suis
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="client">Client</option>
            <option value="commercant">Commerçant</option>
          </select>
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Création...' : "S'inscrire"}
        </button>
      </form>
      <p className="text-sm text-gray-600 mt-4">
        Déjà un compte ?{' '}
        <Link to="/login" className="text-primary font-medium">
          Se connecter
        </Link>
      </p>
    </div>
  );
}