import { useState, type FormEvent } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { api } from '../api/client'
import type { Profile } from '../api/types'
import { Alert } from '../components/Alert/Alert'
import { Avatar } from '../components/Avatar/Avatar'
import { Badge } from '../components/Badge/Badge'
import { Button } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { Input } from '../components/Field/Input'
import { Skeleton } from '../components/Skeleton/Skeleton'
import { ErrorState } from '../components/StateMessage/ErrorState'
import { Switch } from '../components/Switch/Switch'
import { useToast } from '../components/Toast/toast-context'
import { formatPhone } from '../features/booking/validation'
import { useAsync } from '../hooks/useAsync'
import { useScenario } from '../lib/scenario'
import { useTheme, type ThemePreference } from '../lib/theme-context'
import page from './Page.module.css'
import styles from './ProfilePage.module.css'

const themeOptions: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'claro', label: 'Claro', icon: Sun },
  { value: 'escuro', label: 'Escuro', icon: Moon },
  { value: 'sistema', label: 'Sistema', icon: Monitor },
]

export function ProfilePage() {
  const scenario = useScenario()
  const { state, reload, setData } = useAsync(() => api.getProfile(), [scenario])

  return (
    <div className={page.stack}>
      <div className={page.pageHeader}>
        <h1 className={page.title}>Meu perfil</h1>
        <p className={page.subtitle}>Gerencie seus dados, a aparência do app e as notificações.</p>
      </div>

      {state.status === 'loading' && (
        <div className={styles.layout} aria-busy="true" aria-label="Carregando perfil">
          <Skeleton shape="rect" height="220px" />
          <Skeleton shape="rect" height="360px" />
        </div>
      )}

      {state.status === 'error' && (
        <ErrorState title="Não foi possível carregar seu perfil" description={state.error.message} onRetry={reload} />
      )}

      {state.status === 'success' && (
        <div className={styles.layout}>
          <Card padding="lg" className={styles.identity}>
            <Avatar name={state.data.name} size="lg" />
            <h2 className={styles.name}>{state.data.name}</h2>
            <span className={page.muted}>{state.data.city}</span>
            <Badge tone="primary">Viajante desde {state.data.memberSince}</Badge>
          </Card>

          <div className={styles.sections}>
            <ProfileForm profile={state.data} onSaved={(saved) => setData(() => saved)} />
            <AppearanceSection />
            <NotificationsSection />
          </div>
        </div>
      )}
    </div>
  )
}

function ProfileForm({ profile, onSaved }: { profile: Profile; onSaved: (profile: Profile) => void }) {
  const { showToast } = useToast()
  const [values, setValues] = useState(profile)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showErrors, setShowErrors] = useState(false)

  const fieldErrors = {
    name: values.name.trim().length < 3 ? 'Informe seu nome completo.' : undefined,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()) ? undefined : 'Informe um e-mail válido.',
  }
  const isDirty = JSON.stringify(values) !== JSON.stringify(profile)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setShowErrors(true)
    setError(null)
    if (fieldErrors.name || fieldErrors.email) return

    setSaving(true)
    try {
      const saved = await api.updateProfile(values)
      onSaved(saved)
      showToast({ tone: 'success', title: 'Perfil atualizado', description: 'Suas alterações foram salvas.' })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Erro inesperado.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card padding="lg">
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h2 className={page.sectionTitle}>Dados pessoais</h2>
        {error && (
          <Alert tone="danger" title="Não foi possível salvar">
            {error}
          </Alert>
        )}
        <div className={styles.row}>
          <Input
            label="Nome"
            name="name"
            required
            value={values.name}
            onChange={(event) => setValues({ ...values, name: event.target.value })}
            error={showErrors ? fieldErrors.name : undefined}
          />
          <Input
            label="E-mail"
            name="email"
            type="email"
            required
            value={values.email}
            onChange={(event) => setValues({ ...values, email: event.target.value })}
            error={showErrors ? fieldErrors.email : undefined}
          />
        </div>
        <div className={styles.row}>
          <Input
            label="Telefone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={(event) => setValues({ ...values, phone: formatPhone(event.target.value) })}
          />
          <Input
            label="Cidade"
            name="city"
            value={values.city}
            onChange={(event) => setValues({ ...values, city: event.target.value })}
          />
        </div>
        <div className={styles.formActions}>
          <Button type="submit" loading={saving} disabled={!isDirty}>
            Salvar alterações
          </Button>
        </div>
      </form>
    </Card>
  )
}

function AppearanceSection() {
  const { preference, setPreference } = useTheme()

  return (
    <Card padding="lg" className={page.stack}>
      <h2 className={page.sectionTitle} id="theme-title">
        Aparência
      </h2>
      <div className={styles.themeOptions} role="radiogroup" aria-labelledby="theme-title">
        {themeOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={preference === value}
            className={styles.themeOption}
            onClick={() => setPreference(value)}
          >
            <Icon size={20} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </Card>
  )
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState({ reminders: true, offers: false, newsletter: true })

  return (
    <Card padding="lg" className={page.stack}>
      <h2 className={page.sectionTitle}>Notificações</h2>
      <Switch
        label="Lembretes de viagem"
        description="Avisos 48 horas e 2 horas antes de cada experiência."
        checked={prefs.reminders}
        onChange={(reminders) => setPrefs({ ...prefs, reminders })}
      />
      <hr className={page.divider} />
      <Switch
        label="Ofertas e promoções"
        description="Descontos em experiências parecidas com as que você reservou."
        checked={prefs.offers}
        onChange={(offers) => setPrefs({ ...prefs, offers })}
      />
      <hr className={page.divider} />
      <Switch
        label="Newsletter mensal"
        description="Roteiros e dicas de destinos pelo Brasil."
        checked={prefs.newsletter}
        onChange={(newsletter) => setPrefs({ ...prefs, newsletter })}
      />
    </Card>
  )
}
