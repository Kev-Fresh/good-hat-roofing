import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import business from '../../shared/business.js';
import { supabase } from '../lib/supabase.js';
import { LogoMark, Wordmark } from '../components/Logo.jsx';

// Owner sign-in: email + password, then an authenticator-app code.
// The database only shows leads to sessions that passed BOTH steps.
const inputClass =
  'h-13 rounded border-[1.5px] border-line bg-white px-4 text-base text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none';

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState('loading'); // loading | signin | enroll | verify | none
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [factorId, setFactorId] = useState(null);
  const [qr, setQr] = useState(null);
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Figure out where this session is: not signed in, needs a code, or done.
  async function nextStep() {
    const { data: s } = await supabase.auth.getSession();
    const user = s.session?.user;
    if (!user || user.is_anonymous) return setStep('signin');
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal?.currentLevel === 'aal2') return navigate('/dashboard');
    const { data: factors } = await supabase.auth.mfa.listFactors();
    const verified = factors?.totp?.[0];
    if (verified) {
      setFactorId(verified.id);
      return setStep('verify');
    }
    // First sign-in: set up the authenticator app. Clear any half-finished setup first.
    for (const f of factors?.all || []) {
      if (f.status !== 'verified') await supabase.auth.mfa.unenroll({ factorId: f.id });
    }
    const { data, error: enrollError } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: `${business.shortName} owner` });
    if (enrollError) {
      setError('Could not start 2-step setup. Make sure MFA (TOTP) is turned on in Supabase.');
      return setStep('signin');
    }
    setFactorId(data.id);
    setQr(data.totp.qr_code);
    setSecret(data.totp.secret);
    setStep('enroll');
  }

  useEffect(() => {
    if (!supabase) {
      setStep('none');
      return;
    }
    nextStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signIn(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) return setError('That email and password didn’t match.');
    setPassword('');
    await nextStep();
  }

  async function verifyCode(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error: err } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: code.replace(/\s/g, '') });
    setBusy(false);
    if (err) return setError('That code didn’t work. Codes change every 30 seconds, so try the newest one.');
    navigate('/dashboard');
  }

  async function signOut() {
    await supabase.auth.signOut();
    setStep('signin');
    setCode('');
    setError('');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-accent-soft px-5 py-12">
      <div className="w-full max-w-[440px] rounded-md border border-line/70 bg-white p-8 sm:p-10">
        <Link to="/" className="mb-8 flex items-center gap-3 no-underline">
          <span className="[&>svg]:h-9 [&>svg]:w-auto"><LogoMark size={64} /></span>
          <Wordmark />
        </Link>

        {step === 'loading' && <p className="m-0 text-muted">Checking your session…</p>}

        {step === 'none' && (
          <p className="m-0 leading-relaxed text-muted">Owner sign-in isn’t set up on this copy of the site yet. The database keys need to be added first.</p>
        )}

        {step === 'signin' && (
          <form onSubmit={signIn} className="flex flex-col gap-4" noValidate>
            <h1 className="m-0 font-display text-3xl font-extrabold text-brand">Owner sign in</h1>
            <p className="m-0 text-[15px] text-muted">For the business owner and staff only. Customers don’t need an account.</p>
            <label htmlFor="l-email" className="mt-2 text-[15px] font-semibold">Email</label>
            <input id="l-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
            <label htmlFor="l-pass" className="text-[15px] font-semibold">Password</label>
            <input id="l-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required />
            {error && <p className="m-0 font-semibold text-[#8A3B2B]" role="alert">{error}</p>}
            <button type="submit" disabled={busy} className="press mt-2 h-13 rounded bg-accent font-display font-bold text-white hover:bg-brand disabled:opacity-60">
              {busy ? 'Signing in…' : 'Continue'}
            </button>
          </form>
        )}

        {step === 'enroll' && (
          <form onSubmit={verifyCode} className="flex flex-col gap-4" noValidate>
            <h1 className="m-0 font-display text-3xl font-extrabold text-brand">Set up 2-step sign-in</h1>
            <p className="m-0 text-[15px] leading-relaxed text-muted">
              Scan this with an authenticator app (Google Authenticator, 1Password, Authy). You’ll need a code from it every time you sign in.
            </p>
            {qr && <img src={qr} alt="QR code for your authenticator app" className="mx-auto h-48 w-48" />}
            <details className="text-sm text-muted">
              <summary className="cursor-pointer font-semibold">Can’t scan? Enter this key instead</summary>
              <code className="mt-2 block break-all rounded bg-well p-3 text-ink">{secret}</code>
            </details>
            <label htmlFor="l-code" className="text-[15px] font-semibold">6-digit code from the app</label>
            <input id="l-code" inputMode="numeric" autoComplete="one-time-code" maxLength={8} value={code} onChange={(e) => setCode(e.target.value)} className={`${inputClass} tracking-[0.3em]`} />
            {error && <p className="m-0 font-semibold text-[#8A3B2B]" role="alert">{error}</p>}
            <button type="submit" disabled={busy} className="press h-13 rounded bg-accent font-display font-bold text-white hover:bg-brand disabled:opacity-60">
              {busy ? 'Checking…' : 'Turn on and sign in'}
            </button>
            <button type="button" onClick={signOut} className="text-sm font-semibold text-muted underline">Use a different account</button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={verifyCode} className="flex flex-col gap-4" noValidate>
            <h1 className="m-0 font-display text-3xl font-extrabold text-brand">Enter your code</h1>
            <p className="m-0 text-[15px] text-muted">Open your authenticator app and enter the 6-digit code.</p>
            <label htmlFor="l-code2" className="sr-only">6-digit code</label>
            <input id="l-code2" inputMode="numeric" autoComplete="one-time-code" maxLength={8} autoFocus value={code} onChange={(e) => setCode(e.target.value)} className={`${inputClass} tracking-[0.3em]`} />
            {error && <p className="m-0 font-semibold text-[#8A3B2B]" role="alert">{error}</p>}
            <button type="submit" disabled={busy} className="press h-13 rounded bg-accent font-display font-bold text-white hover:bg-brand disabled:opacity-60">
              {busy ? 'Checking…' : 'Sign in'}
            </button>
            <button type="button" onClick={signOut} className="text-sm font-semibold text-muted underline">Use a different account</button>
          </form>
        )}
      </div>
    </div>
  );
}
