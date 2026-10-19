export const AUTH_TIMEOUT_MS = 12_000

export class AuthTimeoutError extends Error {
  constructor() {
    super('Authentication service did not respond in time')
    this.name = 'AuthTimeoutError'
  }
}

// Bounds initialization and browser lock waits as well as the request itself.
export async function withAuthTimeout<T>(request: PromiseLike<T>, timeoutMs = AUTH_TIMEOUT_MS): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      Promise.resolve(request),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new AuthTimeoutError()), timeoutMs)
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}

// Release stalled HTTP requests so they cannot keep holding the auth lock.
export const authFetch: typeof fetch = (input, init) => {
  const url = input instanceof Request ? input.url : String(input)
  if (!new URL(url).pathname.startsWith('/auth/v1/')) return fetch(input, init)
  const signal = AbortSignal.timeout(AUTH_TIMEOUT_MS)
  const existingSignal = init?.signal ?? (input instanceof Request ? input.signal : null)
  return fetch(input, { ...init, signal: existingSignal ? AbortSignal.any([existingSignal, signal]) : signal })
}

const messages: Record<string, { service: string; credentials: string; confirmation: string }> = {
  fr: { service: 'Le service de connexion est temporairement indisponible. Réessaie dans quelques instants. Tes champs sont conservés.', credentials: 'Adresse email ou mot de passe incorrect.', confirmation: 'Confirme ton adresse email avant de te connecter.' },
  en: { service: 'The sign-in service is temporarily unavailable. Try again shortly. Your entries have been kept.', credentials: 'Incorrect email address or password.', confirmation: 'Confirm your email address before signing in.' },
  es: { service: 'El servicio de acceso no está disponible temporalmente. Inténtalo de nuevo en unos momentos. Tus datos se conservan.', credentials: 'Correo o contraseña incorrectos.', confirmation: 'Confirma tu correo antes de iniciar sesión.' },
  de: { service: 'Der Anmeldedienst ist vorübergehend nicht verfügbar. Versuche es gleich erneut. Deine Eingaben bleiben erhalten.', credentials: 'E-Mail-Adresse oder Passwort falsch.', confirmation: 'Bestätige vor der Anmeldung deine E-Mail-Adresse.' },
  it: { service: 'Il servizio di accesso è temporaneamente non disponibile. Riprova tra poco. I dati inseriti sono conservati.', credentials: 'Email o password errati.', confirmation: 'Conferma la tua email prima di accedere.' },
  pt: { service: 'O serviço de acesso está temporariamente indisponível. Tenta novamente dentro de instantes. Os dados foram mantidos.', credentials: 'Email ou palavra-passe incorretos.', confirmation: 'Confirma o teu email antes de entrar.' },
  zh: { service: '登录服务暂时不可用。请稍后重试，已保留填写的内容。', credentials: '邮箱或密码不正确。', confirmation: '请先确认邮箱再登录。' },
  ja: { service: 'ログインサービスは一時的に利用できません。入力内容は保持されています。しばらくしてから再試行してください。', credentials: 'メールアドレスまたはパスワードが正しくありません。', confirmation: 'ログイン前にメールアドレスを確認してください。' },
  ar: { service: 'خدمة تسجيل الدخول غير متاحة مؤقتًا. حاول بعد قليل. تم الاحتفاظ بالبيانات المدخلة.', credentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', confirmation: 'أكد بريدك الإلكتروني قبل تسجيل الدخول.' },
}

export function getAuthErrorMessage(error: unknown, language: string, fallback: string): string {
  const copy = messages[language] ?? messages.fr
  if (error instanceof AuthTimeoutError || error instanceof TypeError) return copy.service
  if (typeof error !== 'object' || error === null) return fallback
  const { code, name, status, message } = error as { code?: string; name?: string; status?: number; message?: string }
  if (code === 'invalid_credentials') return copy.credentials
  if (code === 'email_not_confirmed') return copy.confirmation
  if (name === 'AbortError' || name === 'TimeoutError' || name === 'AuthRetryableFetchError' || name?.includes('LockAcquireTimeout') || status === 0 || (status !== undefined && status >= 500)) return copy.service
  return message || fallback
}
