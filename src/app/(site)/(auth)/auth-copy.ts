type AuthCopy = {
  eyebrow: string
  headline: string
  headlineAccent: string
  introduction: string
  benefitOne: string
  benefitTwo: string
  benefitThree: string
  previewTitle: string
  previewSource: string
  previewResult: string
  previewPractice: string
  forgotLink: string
  forgotTitle: string
  forgotDescription: string
  sendLink: string
  sendingLink: string
  sentTitle: string
  sentDescription: string
  resetTitle: string
  resetDescription: string
  newPassword: string
  confirmPassword: string
  updatePassword: string
  updatingPassword: string
  updatedTitle: string
  updatedDescription: string
  invalidTitle: string
  invalidDescription: string
  requestNewLink: string
  passwordMismatch: string
  backToLogin: string
  noCard: string
  acceptTerms: string
  terms: string
  and: string
  privacy: string
}

const copies: Record<string, AuthCopy> = {
  fr: {
    eyebrow: 'Un espace pour mieux apprendre', headline: 'Tes cours prennent', headlineAccent: 'tout leur sens.',
    introduction: 'Transforme un PDF de cours en une fiche claire, puis entraîne-toi avec des cartes et des quiz.',
    benefitOne: 'Comprends les idées essentielles', benefitTwo: 'Révise activement, à ton rythme', benefitThree: 'Garde tes documents au même endroit',
    previewTitle: 'Ton espace de révision', previewSource: 'Cours de biologie.pdf', previewResult: 'Une fiche claire', previewPractice: 'Cartes + quiz',
    forgotLink: 'Mot de passe oublié ?', forgotTitle: 'Retrouve ton compte', forgotDescription: 'Indique ton adresse e-mail. Si un compte y est associé, tu recevras un lien pour choisir un nouveau mot de passe.',
    sendLink: 'Envoyer le lien', sendingLink: 'Envoi en cours…', sentTitle: 'Vérifie ta boîte mail', sentDescription: 'Si cette adresse est associée à un compte, un lien de réinitialisation vient de lui être envoyé. Pense aussi à vérifier les indésirables.',
    resetTitle: 'Choisis un nouveau mot de passe', resetDescription: 'Utilise au moins 8 caractères pour sécuriser ton compte.', newPassword: 'Nouveau mot de passe', confirmPassword: 'Confirmer le mot de passe',
    updatePassword: 'Mettre à jour le mot de passe', updatingPassword: 'Mise à jour…', updatedTitle: 'Mot de passe mis à jour', updatedDescription: 'Tu peux maintenant reprendre tes révisions.',
    invalidTitle: 'Lien invalide ou expiré', invalidDescription: 'Demande un nouveau lien de réinitialisation pour continuer.', requestNewLink: 'Demander un nouveau lien', passwordMismatch: 'Les mots de passe ne correspondent pas.',
    backToLogin: 'Retour à la connexion', noCard: 'Aucune carte bancaire nécessaire',
    acceptTerms: 'J’accepte les', terms: 'conditions d’utilisation', and: 'et la', privacy: 'politique de confidentialité',
  },
  en: {
    eyebrow: 'A calmer way to study', headline: 'Your course notes,', headlineAccent: 'finally in focus.',
    introduction: 'Turn a course PDF into clear notes, then practise with flashcards and quizzes.',
    benefitOne: 'Understand the essential ideas', benefitTwo: 'Practise active recall at your pace', benefitThree: 'Keep your documents together',
    previewTitle: 'Your study workspace', previewSource: 'Biology notes.pdf', previewResult: 'Clear study notes', previewPractice: 'Cards + quiz',
    forgotLink: 'Forgot your password?', forgotTitle: 'Get back to studying', forgotDescription: 'Enter your email address. If it belongs to an account, we will send a link to choose a new password.',
    sendLink: 'Send reset link', sendingLink: 'Sending…', sentTitle: 'Check your inbox', sentDescription: 'If this address belongs to an account, we have sent it a reset link. Check your spam folder too.',
    resetTitle: 'Choose a new password', resetDescription: 'Use at least 8 characters to secure your account.', newPassword: 'New password', confirmPassword: 'Confirm password',
    updatePassword: 'Update password', updatingPassword: 'Updating…', updatedTitle: 'Password updated', updatedDescription: 'You can get back to your studies now.',
    invalidTitle: 'Invalid or expired link', invalidDescription: 'Request a new reset link to continue.', requestNewLink: 'Request a new link', passwordMismatch: 'The passwords do not match.',
    backToLogin: 'Back to sign in', noCard: 'No payment card required',
    acceptTerms: 'I accept the', terms: 'terms of service', and: 'and the', privacy: 'privacy policy',
  },
  es: {
    eyebrow: 'Un espacio para aprender mejor', headline: 'Tus apuntes,', headlineAccent: 'por fin claros.',
    introduction: 'Convierte un PDF de clase en apuntes claros y practica con tarjetas y cuestionarios.',
    benefitOne: 'Comprende las ideas esenciales', benefitTwo: 'Repasa activamente a tu ritmo', benefitThree: 'Guarda tus documentos juntos',
    previewTitle: 'Tu espacio de estudio', previewSource: 'Biología.pdf', previewResult: 'Apuntes claros', previewPractice: 'Tarjetas + test',
    forgotLink: '¿Olvidaste tu contraseña?', forgotTitle: 'Recupera tu cuenta', forgotDescription: 'Introduce tu correo. Si está asociado a una cuenta, recibirás un enlace para crear una nueva contraseña.',
    sendLink: 'Enviar enlace', sendingLink: 'Enviando…', sentTitle: 'Revisa tu correo', sentDescription: 'Si existe una cuenta con esta dirección, te hemos enviado un enlace. Revisa también la carpeta de spam.',
    resetTitle: 'Crea una nueva contraseña', resetDescription: 'Usa al menos 8 caracteres.', newPassword: 'Nueva contraseña', confirmPassword: 'Confirmar contraseña',
    updatePassword: 'Actualizar contraseña', updatingPassword: 'Actualizando…', updatedTitle: 'Contraseña actualizada', updatedDescription: 'Ya puedes seguir estudiando.',
    invalidTitle: 'Enlace no válido o caducado', invalidDescription: 'Solicita otro enlace para continuar.', requestNewLink: 'Solicitar otro enlace', passwordMismatch: 'Las contraseñas no coinciden.',
    backToLogin: 'Volver al inicio de sesión', noCard: 'Sin tarjeta bancaria',
    acceptTerms: 'Acepto los', terms: 'términos de uso', and: 'y la', privacy: 'política de privacidad',
  },
  de: {
    eyebrow: 'Ein besserer Lernort', headline: 'Deine Unterlagen,', headlineAccent: 'endlich klar.',
    introduction: 'Mache aus deinem Kurs-PDF übersichtliche Notizen und übe mit Karteikarten und Quizzen.',
    benefitOne: 'Wichtige Ideen verstehen', benefitTwo: 'Aktiv im eigenen Tempo lernen', benefitThree: 'Alle Dokumente an einem Ort',
    previewTitle: 'Dein Lernbereich', previewSource: 'Biologie.pdf', previewResult: 'Klare Lernnotizen', previewPractice: 'Karten + Quiz',
    forgotLink: 'Passwort vergessen?', forgotTitle: 'Zurück zu deinem Konto', forgotDescription: 'Gib deine E-Mail-Adresse ein. Falls ein Konto besteht, senden wir dir einen Link für ein neues Passwort.',
    sendLink: 'Link senden', sendingLink: 'Wird gesendet…', sentTitle: 'Prüfe deine E-Mails', sentDescription: 'Falls zu dieser Adresse ein Konto gehört, haben wir einen Link gesendet. Prüfe auch den Spam-Ordner.',
    resetTitle: 'Neues Passwort wählen', resetDescription: 'Verwende mindestens 8 Zeichen.', newPassword: 'Neues Passwort', confirmPassword: 'Passwort bestätigen',
    updatePassword: 'Passwort ändern', updatingPassword: 'Wird geändert…', updatedTitle: 'Passwort geändert', updatedDescription: 'Du kannst jetzt weiterlernen.',
    invalidTitle: 'Link ungültig oder abgelaufen', invalidDescription: 'Fordere einen neuen Link an.', requestNewLink: 'Neuen Link anfordern', passwordMismatch: 'Die Passwörter stimmen nicht überein.',
    backToLogin: 'Zurück zur Anmeldung', noCard: 'Keine Kreditkarte erforderlich',
    acceptTerms: 'Ich akzeptiere die', terms: 'Nutzungsbedingungen', and: 'und die', privacy: 'Datenschutzerklärung',
  },
  it: {
    eyebrow: 'Uno spazio per studiare meglio', headline: 'I tuoi appunti,', headlineAccent: 'finalmente chiari.',
    introduction: 'Trasforma un PDF del corso in appunti chiari e ripassa con flashcard e quiz.',
    benefitOne: 'Comprendi le idee essenziali', benefitTwo: 'Ripassa attivamente al tuo ritmo', benefitThree: 'Tieni i documenti in un unico posto',
    previewTitle: 'Il tuo spazio di studio', previewSource: 'Biologia.pdf', previewResult: 'Appunti chiari', previewPractice: 'Carte + quiz',
    forgotLink: 'Password dimenticata?', forgotTitle: 'Recupera il tuo account', forgotDescription: 'Inserisci la tua email. Se è associata a un account, riceverai un link per scegliere una nuova password.',
    sendLink: 'Invia il link', sendingLink: 'Invio in corso…', sentTitle: 'Controlla la tua email', sentDescription: 'Se esiste un account con questo indirizzo, abbiamo inviato un link. Controlla anche lo spam.',
    resetTitle: 'Scegli una nuova password', resetDescription: 'Usa almeno 8 caratteri.', newPassword: 'Nuova password', confirmPassword: 'Conferma password',
    updatePassword: 'Aggiorna password', updatingPassword: 'Aggiornamento…', updatedTitle: 'Password aggiornata', updatedDescription: 'Ora puoi tornare a studiare.',
    invalidTitle: 'Link non valido o scaduto', invalidDescription: 'Richiedi un nuovo link per continuare.', requestNewLink: 'Richiedi un nuovo link', passwordMismatch: 'Le password non coincidono.',
    backToLogin: 'Torna all’accesso', noCard: 'Nessuna carta richiesta',
    acceptTerms: 'Accetto i', terms: 'termini di servizio', and: 'e l’', privacy: 'informativa sulla privacy',
  },
  pt: {
    eyebrow: 'Um espaço para estudar melhor', headline: 'Os seus apontamentos,', headlineAccent: 'finalmente claros.',
    introduction: 'Transforme um PDF do curso em notas claras e pratique com cartões e questionários.',
    benefitOne: 'Compreenda as ideias essenciais', benefitTwo: 'Reveja ao seu ritmo', benefitThree: 'Guarde os documentos num só lugar',
    previewTitle: 'O seu espaço de estudo', previewSource: 'Biologia.pdf', previewResult: 'Notas claras', previewPractice: 'Cartões + teste',
    forgotLink: 'Esqueceu-se da palavra-passe?', forgotTitle: 'Recupere a sua conta', forgotDescription: 'Introduza o seu email. Se existir uma conta, receberá uma ligação para escolher outra palavra-passe.',
    sendLink: 'Enviar ligação', sendingLink: 'A enviar…', sentTitle: 'Verifique o seu email', sentDescription: 'Se esta morada estiver associada a uma conta, enviámos uma ligação. Verifique também o spam.',
    resetTitle: 'Escolha outra palavra-passe', resetDescription: 'Use pelo menos 8 caracteres.', newPassword: 'Nova palavra-passe', confirmPassword: 'Confirmar palavra-passe',
    updatePassword: 'Atualizar palavra-passe', updatingPassword: 'A atualizar…', updatedTitle: 'Palavra-passe atualizada', updatedDescription: 'Pode continuar a estudar.',
    invalidTitle: 'Ligação inválida ou expirada', invalidDescription: 'Peça uma nova ligação para continuar.', requestNewLink: 'Pedir nova ligação', passwordMismatch: 'As palavras-passe não coincidem.',
    backToLogin: 'Voltar ao início de sessão', noCard: 'Sem cartão bancário',
    acceptTerms: 'Aceito os', terms: 'termos de utilização', and: 'e a', privacy: 'política de privacidade',
  },
  zh: {
    eyebrow: '更清晰的学习空间', headline: '让课程资料', headlineAccent: '变得更易理解。',
    introduction: '将课程 PDF 整理成清晰笔记，再用记忆卡和测验练习。',
    benefitOne: '理解重要概念', benefitTwo: '按自己的节奏主动复习', benefitThree: '集中管理学习资料',
    previewTitle: '你的学习空间', previewSource: '生物学课程.pdf', previewResult: '清晰的笔记', previewPractice: '记忆卡 + 测验',
    forgotLink: '忘记密码？', forgotTitle: '找回你的账户', forgotDescription: '输入电子邮箱。如果关联了账户，你将收到设置新密码的链接。',
    sendLink: '发送链接', sendingLink: '正在发送…', sentTitle: '请查看邮箱', sentDescription: '如果该邮箱关联了账户，重置链接已发送。也请检查垃圾邮件文件夹。',
    resetTitle: '设置新密码', resetDescription: '请使用至少 8 个字符。', newPassword: '新密码', confirmPassword: '确认密码',
    updatePassword: '更新密码', updatingPassword: '正在更新…', updatedTitle: '密码已更新', updatedDescription: '现在可以继续学习了。',
    invalidTitle: '链接无效或已过期', invalidDescription: '请重新申请重置链接。', requestNewLink: '申请新链接', passwordMismatch: '两次输入的密码不一致。',
    backToLogin: '返回登录', noCard: '无需银行卡',
    acceptTerms: '我同意', terms: '服务条款', and: '和', privacy: '隐私政策',
  },
  ja: {
    eyebrow: 'もっと学びやすい場所', headline: '授業の資料を', headlineAccent: 'もっと分かりやすく。',
    introduction: '授業の PDF を分かりやすいノートにまとめ、カードとクイズで練習できます。',
    benefitOne: '大切な内容を理解', benefitTwo: '自分のペースで復習', benefitThree: '資料を一か所に整理',
    previewTitle: 'あなたの学習スペース', previewSource: '生物学.pdf', previewResult: '分かりやすいノート', previewPractice: 'カード + クイズ',
    forgotLink: 'パスワードを忘れた場合', forgotTitle: 'アカウントを復元', forgotDescription: 'メールアドレスを入力してください。アカウントがある場合は、再設定リンクをお送りします。',
    sendLink: 'リンクを送信', sendingLink: '送信中…', sentTitle: 'メールを確認してください', sentDescription: 'アカウントがある場合は再設定リンクを送りました。迷惑メールも確認してください。',
    resetTitle: '新しいパスワードを設定', resetDescription: '8文字以上で入力してください。', newPassword: '新しいパスワード', confirmPassword: 'パスワードを確認',
    updatePassword: 'パスワードを更新', updatingPassword: '更新中…', updatedTitle: 'パスワードを更新しました', updatedDescription: '学習を再開できます。',
    invalidTitle: 'リンクが無効か期限切れです', invalidDescription: '新しいリンクをリクエストしてください。', requestNewLink: '新しいリンクをリクエスト', passwordMismatch: 'パスワードが一致しません。',
    backToLogin: 'ログインに戻る', noCard: 'カード登録は不要',
    acceptTerms: '以下に同意します：', terms: '利用規約', and: 'と', privacy: 'プライバシーポリシー',
  },
  ar: {
    eyebrow: 'مساحة أفضل للتعلّم', headline: 'دروسك أصبحت', headlineAccent: 'أوضح أخيرًا.',
    introduction: 'حوّل ملفات PDF الدراسية إلى ملخصات واضحة، ثم تدرّب بالبطاقات والاختبارات.',
    benefitOne: 'افهم الأفكار الأساسية', benefitTwo: 'راجع بالوتيرة التي تناسبك', benefitThree: 'احتفظ بمستنداتك في مكان واحد',
    previewTitle: 'مساحة المراجعة', previewSource: 'علم الأحياء.pdf', previewResult: 'ملخص واضح', previewPractice: 'بطاقات + اختبار',
    forgotLink: 'نسيت كلمة المرور؟', forgotTitle: 'استعد حسابك', forgotDescription: 'أدخل بريدك الإلكتروني. إذا كان مرتبطًا بحساب فسنرسل رابطًا لاختيار كلمة مرور جديدة.',
    sendLink: 'إرسال الرابط', sendingLink: 'جارٍ الإرسال…', sentTitle: 'تحقق من بريدك', sentDescription: 'إذا كان هذا البريد مرتبطًا بحساب فقد أرسلنا رابط إعادة التعيين. تحقق أيضًا من الرسائل غير المرغوبة.',
    resetTitle: 'اختر كلمة مرور جديدة', resetDescription: 'استخدم 8 أحرف على الأقل.', newPassword: 'كلمة المرور الجديدة', confirmPassword: 'تأكيد كلمة المرور',
    updatePassword: 'تحديث كلمة المرور', updatingPassword: 'جارٍ التحديث…', updatedTitle: 'تم تحديث كلمة المرور', updatedDescription: 'يمكنك العودة إلى الدراسة الآن.',
    invalidTitle: 'الرابط غير صالح أو منتهي', invalidDescription: 'اطلب رابطًا جديدًا للمتابعة.', requestNewLink: 'طلب رابط جديد', passwordMismatch: 'كلمتا المرور غير متطابقتين.',
    backToLogin: 'العودة إلى تسجيل الدخول', noCard: 'لا حاجة إلى بطاقة دفع',
    acceptTerms: 'أوافق على', terms: 'شروط الاستخدام', and: 'و', privacy: 'سياسة الخصوصية',
  },
}

export function getAuthCopy(language: string): AuthCopy {
  return copies[language] ?? copies.fr
}
