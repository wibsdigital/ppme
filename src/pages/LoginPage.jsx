import { useState } from 'react';
import apiStore from '../store/apiStore';

export default function LoginPage() {
  const login = apiStore(s => s.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Temporary bypass for testing
    if ((username === 'admin' || username === 'penningmeester') && password === 'ppme2024') {
      // Direct login without API call for testing
      apiStore.setState({
        isAuthenticated: true,
        adminUser: {
          id: `${username}_1`,
          username: username,
          name: username === 'admin' ? 'Administrator' : 'Penningmeester',
          role: username === 'admin' ? 'Admin' : 'Treasurer'
        }
      });
      setLoading(false);
      return;
    }
    
    try {
      const ok = await login(username, password);
      if (!ok) setError('Ongeldig gebruikersnaam of wachtwoord.');
    } catch (error) {
      setError('Inloggen mislukt. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0d1b2a' }}>
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 relative overflow-hidden p-12 geo-pattern"
        style={{ background: 'linear-gradient(160deg, #132233 0%, #0d1b2a 100%)' }}
      >
        {/* Amber accent bar */}
        <div className="absolute top-0 left-0 w-1 h-full" style={{ background: '#c8933a' }} />

        <div className="animate-enter">
          {/* Logo mark */}
          <div className="flex items-center gap-3 mb-16">
            <div
              className="w-10 h-10 rounded flex items-center justify-center"
              style={{ background: '#c8933a' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <polygon points="10,2 18,6 18,14 10,18 2,14 2,6" fill="white" fillOpacity="0.9"/>
                <polygon points="10,5 15,8 15,12 10,15 5,12 5,8" fill="#c8933a"/>
              </svg>
            </div>
            <div>
              <div className="font-display text-white text-sm tracking-widest uppercase" style={{ letterSpacing: '0.2em' }}>
                PPME
              </div>
              <div className="text-xs" style={{ color: '#7094b3' }}>Al Ikhlash Amsterdam</div>
            </div>
          </div>

          <div>
            <h1
              className="font-display text-white leading-tight mb-4"
              style={{ fontSize: '2.5rem', fontWeight: 300 }}
            >
              Ledenadministratie
              <br />
              <em style={{ color: '#c8933a', fontStyle: 'italic' }}>Dashboard</em>
            </h1>
            <p style={{ color: '#7094b3', fontSize: '0.875rem', lineHeight: 1.7 }}>
              Beheer van leden en contributie voor de islamitische gemeenschap in Amsterdam.
            </p>
          </div>
        </div>

        {/* Stats teaser */}
        <div className="grid grid-cols-2 gap-4 animate-enter" style={{ animationDelay: '0.2s', opacity: 0 }}>
          {[
            { label: 'Actieve leden', value: '11' },
            { label: 'Maand contributie', value: '€ 210' },
            { label: 'Betaald', value: '73%' },
            { label: 'Leden 2024', value: '12' },
          ].map(stat => (
            <div
              key={stat.label}
              className="p-4 rounded"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="font-display text-white text-2xl" style={{ fontWeight: 300 }}>{stat.value}</div>
              <div className="text-xs mt-1" style={{ color: '#4a6d90' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-xs" style={{ color: '#243d58' }}>
          © 2024 PPME Al Ikhlash Amsterdam
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-enter" style={{ animationDelay: '0.1s', opacity: 0 }}>
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: '#c8933a' }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <polygon points="10,2 18,6 18,14 10,18 2,14 2,6" fill="white" fillOpacity="0.9"/>
              </svg>
            </div>
            <span className="font-display text-white text-sm tracking-widest uppercase" style={{ letterSpacing: '0.15em' }}>PPME</span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-white text-3xl mb-2" style={{ fontWeight: 300 }}>Inloggen</h2>
            <p style={{ color: '#4a6d90', fontSize: '0.875rem' }}>
              Voer uw beheerders-gegevens in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium tracking-wider uppercase mb-2"
                style={{ color: '#7094b3', letterSpacing: '0.1em' }}
              >
                Gebruikersnaam
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full px-4 py-3 rounded text-sm transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#c8933a'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium tracking-wider uppercase mb-2"
                style={{ color: '#7094b3', letterSpacing: '0.1em' }}
              >
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded text-sm transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#c8933a'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {error && (
              <div
                className="px-4 py-3 rounded text-sm"
                style={{ background: 'rgba(139,58,58,0.2)', border: '1px solid rgba(139,58,58,0.4)', color: '#f4a0a0' }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded font-medium text-sm transition-all"
              style={{
                background: loading ? '#8a5a1a' : '#c8933a',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#daa85a'; }}
              onMouseLeave={e => { if (!loading) e.target.style.background = '#c8933a'; }}
            >
              {loading ? 'Bezig met inloggen…' : 'Inloggen'}
            </button>
          </form>

          <div
            className="mt-6 p-4 rounded text-xs"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#4a6d90' }}
          >
            <span style={{ color: '#c8933a' }}>Demo:</span> admin / ppme2024
          </div>
        </div>
      </div>
    </div>
  );
}
