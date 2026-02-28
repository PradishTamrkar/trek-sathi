import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

// ─── Modal Wrapper ────────────────────────────────────────────────────────────
function Modal({ show, onClose, children }) {
    if (!show) return null;
    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 100,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1rem',
                animation: 'fadeIn .2s ease',
            }}
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div style={{
                background: '#f5f0e8',
                borderRadius: '20px',
                padding: '2.5rem',
                width: '100%',
                maxWidth: '420px',
                position: 'relative',
                boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
                animation: 'slideUp .25s ease',
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1.25rem', right: '1.25rem',
                        background: 'rgba(0,0,0,0.08)', border: 'none',
                        width: 32, height: 32, borderRadius: '50%',
                        cursor: 'pointer', color: '#8c7b6b', fontSize: '.8rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >✕</button>
                {children}
            </div>
        </div>
    );
}

// ─── Shared field style ───────────────────────────────────────────────────────
const fieldStyle = {
    width: '100%', padding: '.75rem 1rem',
    border: '1.5px solid rgba(0,0,0,0.12)',
    borderRadius: '10px',
    fontFamily: 'inherit', fontSize: '.95rem',
    background: '#fff', color: '#1e3a2f',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color .15s',
};

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginForm({ onSwitch }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '', password: '', remember: false,
    });

    const submit = e => {
        e.preventDefault();
        post(route('user.login'), { onFinish: () => reset('password') });
    };

    return (
        <div>
            <div style={{ marginBottom: '1.75rem' }}>
                <span style={{
                    display: 'inline-block', background: '#1e3a2f', color: '#d4b896',
                    fontSize: '.7rem', fontWeight: 600, letterSpacing: '.1em',
                    textTransform: 'uppercase', padding: '.25rem .75rem',
                    borderRadius: '100px', marginBottom: '.75rem',
                }}>Trekker</span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: '#1e3a2f', margin: '0 0 .25rem' }}>Welcome Back</h2>
                <p style={{ color: '#8c7b6b', fontSize: '.9rem', margin: 0 }}>Sign in to continue your journey</p>
            </div>

            <form onSubmit={submit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 600, color: '#8c7b6b', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.4rem' }}>Email</label>
                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="you@example.com" style={fieldStyle} autoFocus />
                    {errors.email && <span style={{ color: '#c0392b', fontSize: '.8rem', display: 'block', marginTop: '.3rem' }}>{errors.email}</span>}
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 600, color: '#8c7b6b', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.4rem' }}>Password</label>
                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="••••••••" style={fieldStyle} />
                    {errors.password && <span style={{ color: '#c0392b', fontSize: '.8rem', display: 'block', marginTop: '.3rem' }}>{errors.password}</span>}
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', fontSize: '.875rem', color: '#8c7b6b', marginBottom: '1.25rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} style={{ accentColor: '#2d5a3d' }} />
                    Remember me
                </label>

                <button type="submit" disabled={processing} style={{
                    width: '100%', padding: '.85rem', background: '#1e3a2f', color: '#fff',
                    border: 'none', borderRadius: '10px', fontFamily: 'inherit',
                    fontSize: '1rem', fontWeight: 600, cursor: processing ? 'not-allowed' : 'pointer',
                    opacity: processing ? .6 : 1, transition: 'all .2s',
                }}>
                    {processing ? 'Signing in…' : 'Sign In'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '.875rem', color: '#8c7b6b' }}>
                No account?{' '}
                <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: '#2d5a3d', fontWeight: 600, cursor: 'pointer', fontSize: '.875rem', textDecoration: 'underline' }}>
                    Create one free
                </button>
            </p>
        </div>
    );
}

// ─── Register Form ────────────────────────────────────────────────────────────
function RegisterForm({ onSwitch }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });

    const submit = e => {
        e.preventDefault();
        post(route('user.register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <div>
            <div style={{ marginBottom: '1.75rem' }}>
                <span style={{
                    display: 'inline-block', background: '#1e3a2f', color: '#d4b896',
                    fontSize: '.7rem', fontWeight: 600, letterSpacing: '.1em',
                    textTransform: 'uppercase', padding: '.25rem .75rem',
                    borderRadius: '100px', marginBottom: '.75rem',
                }}>Join Us</span>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: '#1e3a2f', margin: '0 0 .25rem' }}>Start Your Trek</h2>
                <p style={{ color: '#8c7b6b', fontSize: '.9rem', margin: 0 }}>Create a free account to explore Nepal</p>
            </div>

            <form onSubmit={submit}>
                {[
                    { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Tenzing Norgay' },
                    { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
                    { label: 'Password', key: 'password', type: 'password', placeholder: 'Min. 8 characters' },
                    { label: 'Confirm Password', key: 'password_confirmation', type: 'password', placeholder: '••••••••' },
                ].map(f => (
                    <div key={f.key} style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 600, color: '#8c7b6b', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '.4rem' }}>{f.label}</label>
                        <input
                            type={f.type} value={data[f.key]} placeholder={f.placeholder}
                            onChange={e => setData(f.key, e.target.value)}
                            style={fieldStyle} autoFocus={f.key === 'name'}
                        />
                        {errors[f.key] && <span style={{ color: '#c0392b', fontSize: '.8rem', display: 'block', marginTop: '.3rem' }}>{errors[f.key]}</span>}
                    </div>
                ))}

                <button type="submit" disabled={processing} style={{
                    width: '100%', padding: '.85rem', background: '#1e3a2f', color: '#fff',
                    border: 'none', borderRadius: '10px', fontFamily: 'inherit',
                    fontSize: '1rem', fontWeight: 600, cursor: processing ? 'not-allowed' : 'pointer',
                    opacity: processing ? .6 : 1, marginTop: '.25rem', transition: 'all .2s',
                }}>
                    {processing ? 'Creating account…' : 'Create Account'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '.875rem', color: '#8c7b6b' }}>
                Already have an account?{' '}
                <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: '#2d5a3d', fontWeight: 600, cursor: 'pointer', fontSize: '.875rem', textDecoration: 'underline' }}>
                    Sign in
                </button>
            </p>
        </div>
    );
}

// ─── Welcome Page ─────────────────────────────────────────────────────────────
export default function Welcome() {
    const [modal, setModal] = useState(null); // 'login' | 'register' | null

    return (
        <>
            <Head title="TrekSathi — Your Nepal Trekking Companion" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'DM Sans', sans-serif; }
                @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
                @keyframes slideUp { from { transform:translateY(20px); opacity:0 } to { transform:translateY(0); opacity:1 } }
                @keyframes pulse   { 0%,100% { opacity:1; transform:scale(1) } 50% { opacity:.5; transform:scale(1.5) } }
                @keyframes drift   { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-8px) } }
            `}</style>

            {/* ── Page ── */}
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', background: '#0d1f2d' }}>

                {/* ── Sky + Stars ── */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#0d1a2e 0%,#1a3a52 30%,#2a6070 55%,#2d6a4a 75%,#1e3a2f 100%)' }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `
                        radial-gradient(1px 1px at 15% 12%,rgba(255,255,255,.9) 0%,transparent 100%),
                        radial-gradient(1px 1px at 35%  8%,rgba(255,255,255,.6) 0%,transparent 100%),
                        radial-gradient(1.5px 1.5px at 55% 5%,rgba(255,255,255,1) 0%,transparent 100%),
                        radial-gradient(1px 1px at 75% 15%,rgba(255,255,255,.7) 0%,transparent 100%),
                        radial-gradient(1px 1px at 90%  9%,rgba(255,255,255,.8) 0%,transparent 100%),
                        radial-gradient(1px 1px at 25% 22%,rgba(255,255,255,.5) 0%,transparent 100%),
                        radial-gradient(1px 1px at 65% 18%,rgba(255,255,255,.6) 0%,transparent 100%),
                        radial-gradient(1px 1px at 45% 25%,rgba(255,255,255,.4) 0%,transparent 100%)`,
                }} />

                {/* ── Mountain SVG ── */}
                <svg style={{ position: 'absolute', bottom: 0, width: '100%', zIndex: 1 }} viewBox="0 0 1440 420" preserveAspectRatio="none">
                    {/* Far range */}
                    <path d="M0 420 L0 280 L100 220 L200 260 L320 170 L440 230 L560 140 L680 200 L800 110 L920 180 L1040 130 L1160 200 L1280 150 L1440 220 L1440 420Z" fill="#1a3a2a" opacity=".5"/>
                    {/* Snow peaks */}
                    <path d="M560 140 L575 162 L588 155 L600 172 L614 148 L628 168 L640 200 L620 192 L604 180 L588 190 L572 175 L556 185 Z" fill="white" opacity=".65"/>
                    <path d="M800 110 L816 133 L830 125 L844 144 L858 120 L872 142 L884 180 L864 170 L846 158 L830 168 L812 152 L796 162 Z" fill="white" opacity=".75"/>
                    {/* Mid range */}
                    <path d="M0 420 L0 320 L160 250 L280 300 L400 210 L520 275 L640 190 L760 255 L880 170 L1000 240 L1120 185 L1240 245 L1360 200 L1440 255 L1440 420Z" fill="#1e3a2f" opacity=".7"/>
                    {/* Foreground */}
                    <path d="M0 420 L0 355 L180 310 L360 345 L540 300 L720 335 L900 295 L1080 325 L1260 305 L1440 320 L1440 420Z" fill="#163020"/>
                    <path d="M0 420 L0 390 L1440 390 L1440 420Z" fill="#0f2018"/>
                </svg>

                {/* ── Navbar ── */}
                <nav style={{
                    position: 'relative', zIndex: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.5rem 3rem',
                }}>
                    {/* Logo */}
                    <a href="/" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.6rem', fontWeight: 900,
                        color: '#fff', textDecoration: 'none', letterSpacing: '-.02em',
                    }}>
                        Trek<span style={{ color: '#c8973a' }}>Sathi</span>
                    </a>

                    {/* Nav buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {/* Admin subtle link */}
                        <a href="/admin/login" style={{
                            color: 'rgba(255,255,255,.4)', fontSize: '.8rem',
                            textDecoration: 'none', padding: '.4rem .8rem',
                            transition: 'color .2s',
                        }}
                        onMouseEnter={e => e.target.style.color='rgba(255,255,255,.7)'}
                        onMouseLeave={e => e.target.style.color='rgba(255,255,255,.4)'}
                        >Admin</a>

                        {/* Sign In */}
                        <button
                            onClick={() => setModal('login')}
                            style={{
                                padding: '.55rem 1.4rem', borderRadius: '100px',
                                background: 'transparent',
                                border: '1.5px solid rgba(255,255,255,.4)',
                                color: '#fff', cursor: 'pointer',
                                fontFamily: 'inherit', fontSize: '.875rem', fontWeight: 500,
                                transition: 'all .2s',
                            }}
                            onMouseEnter={e => { e.target.style.borderColor='rgba(255,255,255,.8)'; e.target.style.background='rgba(255,255,255,.08)' }}
                            onMouseLeave={e => { e.target.style.borderColor='rgba(255,255,255,.4)'; e.target.style.background='transparent' }}
                        >Sign In</button>

                        {/* Get Started */}
                        <button
                            onClick={() => setModal('register')}
                            style={{
                                padding: '.55rem 1.4rem', borderRadius: '100px',
                                background: '#c8973a', border: 'none',
                                color: '#1e3a2f', cursor: 'pointer',
                                fontFamily: 'inherit', fontSize: '.875rem', fontWeight: 700,
                                transition: 'all .2s',
                                boxShadow: '0 4px 20px rgba(200,151,58,.4)',
                            }}
                            onMouseEnter={e => { e.target.style.background='#d9a84a'; e.target.style.transform='translateY(-1px)' }}
                            onMouseLeave={e => { e.target.style.background='#c8973a'; e.target.style.transform='translateY(0)' }}
                        >Get Started</button>
                    </div>
                </nav>

                {/* ── Hero ── */}
                <div style={{
                    position: 'relative', zIndex: 5,
                    flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    textAlign: 'center', padding: '4rem 2rem 14rem',
                }}>
                    {/* Eyebrow pill */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '.5rem',
                        background: 'rgba(255,255,255,.08)',
                        border: '1px solid rgba(255,255,255,.15)',
                        borderRadius: '100px', padding: '.4rem 1rem',
                        color: '#d4b896', fontSize: '.8rem', fontWeight: 500,
                        letterSpacing: '.08em', textTransform: 'uppercase',
                        marginBottom: '1.5rem',
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8973a', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                        AI-Powered Nepal Trekking
                    </div>

                    {/* Headline */}
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(3rem,8vw,6rem)',
                        fontWeight: 900, color: '#fff',
                        lineHeight: 1.0, letterSpacing: '-.03em',
                        marginBottom: '1rem',
                    }}>
                        Explore Nepal<br />
                        with your <em style={{ color: '#c8973a' }}>Sathi</em>
                    </h1>

                    <p style={{
                        fontSize: '1.1rem', color: 'rgba(255,255,255,.6)',
                        fontWeight: 300, maxWidth: '480px', lineHeight: 1.7,
                        marginBottom: '2.5rem',
                    }}>
                        Your intelligent trekking companion for routes, permits,
                        tea houses, and everything the Himalayas hold.
                    </p>

                    {/* CTAs */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                            onClick={() => setModal('register')}
                            style={{
                                padding: '.9rem 2.2rem', background: '#c8973a',
                                color: '#1e3a2f', border: 'none', borderRadius: '100px',
                                fontFamily: 'inherit', fontSize: '1rem', fontWeight: 700,
                                cursor: 'pointer', transition: 'all .25s',
                                boxShadow: '0 4px 24px rgba(200,151,58,.35)',
                            }}
                            onMouseEnter={e => { e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow='0 8px 32px rgba(200,151,58,.5)' }}
                            onMouseLeave={e => { e.target.style.transform='translateY(0)'; e.target.style.boxShadow='0 4px 24px rgba(200,151,58,.35)' }}
                        >Start Exploring Free</button>

                        <button
                            onClick={() => setModal('login')}
                            style={{
                                padding: '.9rem 2.2rem', background: 'transparent',
                                color: '#fff', border: '1.5px solid rgba(255,255,255,.3)',
                                borderRadius: '100px', fontFamily: 'inherit',
                                fontSize: '1rem', fontWeight: 400, cursor: 'pointer',
                                transition: 'all .25s',
                            }}
                            onMouseEnter={e => { e.target.style.borderColor='rgba(255,255,255,.7)'; e.target.style.background='rgba(255,255,255,.06)' }}
                            onMouseLeave={e => { e.target.style.borderColor='rgba(255,255,255,.3)'; e.target.style.background='transparent' }}
                        >Already a trekker?</button>
                    </div>

                    {/* Feature pills */}
                    <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '3rem' }}>
                        {[
                            { icon: '🗺️', label: 'AI Route Planning' },
                            { icon: '🏔️', label: '100+ Trekking Routes' },
                            { icon: '🍵', label: 'Tea House Finder' },
                            { icon: '📋', label: 'Permit Assistant' },
                            { icon: '👥', label: 'Community Reports' },
                        ].map(f => (
                            <div key={f.label} style={{
                                display: 'flex', alignItems: 'center', gap: '.4rem',
                                background: 'rgba(255,255,255,.07)',
                                border: '1px solid rgba(255,255,255,.12)',
                                borderRadius: '100px', padding: '.45rem 1rem',
                                color: 'rgba(255,255,255,.7)', fontSize: '.82rem',
                                backdropFilter: 'blur(8px)',
                            }}>
                                <span>{f.icon}</span>{f.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Login Modal ── */}
            <Modal show={modal === 'login'} onClose={() => setModal(null)}>
                <LoginForm onSwitch={() => setModal('register')} />
            </Modal>

            {/* ── Register Modal ── */}
            <Modal show={modal === 'register'} onClose={() => setModal(null)}>
                <RegisterForm onSwitch={() => setModal('login')} />
            </Modal>
        </>
    );
}
