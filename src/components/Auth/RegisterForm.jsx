import { useState } from 'react';
import { register } from '../../api/authApi';

export default function RegisterForm() {
  const [form, setForm] = useState({ email: '', password: '', name: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register(form);
      alert('Compte créé avec succès !');
    } catch (err) {
      alert('Erreur lors de l\'inscription');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nom" value={form.name} onChange={handleChange} required />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} required />
      <button type="submit">S'inscrire</button>
    </form>
  );
}
