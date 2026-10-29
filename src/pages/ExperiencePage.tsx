import { useParams } from 'react-router'
import { ArrowLeft, Check, Clock, MapPin, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { api, NotFoundError } from '../api/client'
import { Badge } from '../components/Badge/Badge'
import { Breadcrumb } from '../components/Breadcrumb/Breadcrumb'
import { ButtonLink } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { Rating } from '../components/Rating/Rating'
import { Skeleton } from '../components/Skeleton/Skeleton'
import { EmptyState } from '../components/StateMessage/EmptyState'
import { ErrorState } from '../components/StateMessage/ErrorState'
import { ExperienceArt } from '../features/experiences/ExperienceArt'
import { useAsync } from '../hooks/useAsync'
import { categoryLabels, formatCurrency, formatDuration, formatShortDate } from '../lib/format'
import { useScenario } from '../lib/scenario'
import page from './Page.module.css'
import styles from './ExperiencePage.module.css'

export function ExperiencePage() {
  const { experienceId = '' } = useParams()
  const scenario = useScenario()
  const { state, reload } = useAsync(() => api.getExperience(experienceId), [experienceId, scenario])

  if (state.status === 'loading') return <ExperienceSkeleton />

  if (state.status === 'error') {
    if (state.error instanceof NotFoundError) {
      return (
        <EmptyState
          title="Experiência não encontrada"
          description="Ela pode ter sido removida ou o link está incorreto."
          actions={
            <ButtonLink to="/" variant="secondary" iconLeft={<ArrowLeft size={16} aria-hidden="true" />}>
              Voltar para explorar
            </ButtonLink>
          }
        />
      )
    }
    return <ErrorState description={state.error.message} onRetry={reload} />
  }

  const experience = state.data

  return (
    <div className={page.stack}>
      <Breadcrumb items={[{ label: 'Explorar', to: '/' }, { label: experience.title }]} />

      <div className={styles.hero}>
        <ExperienceArt art={experience.art} className={styles.heroArt} label={`Ilustração de ${experience.city}`} />
      </div>

      <div className={page.split}>
        <div className={page.stack}>
          <div className={styles.heading}>
            <div>
              <Badge tone="primary">{categoryLabels[experience.category]}</Badge>
            </div>
            <h1 className={page.title}>{experience.title}</h1>
            <div className={styles.meta}>
              <Rating value={experience.rating} count={experience.reviewsCount} />
              <span className={styles.metaItem}>
                <MapPin size={16} aria-hidden="true" />
                {experience.city}, {experience.state}
              </span>
              <span className={styles.metaItem}>
                <Clock size={16} aria-hidden="true" />
                {formatDuration(experience.durationHours)}
              </span>
              <span className={styles.metaItem}>
                <Users size={16} aria-hidden="true" />
                Até {experience.maxGuests} pessoas
              </span>
            </div>
          </div>

          <p className={styles.description}>{experience.description}</p>

          <hr className={page.divider} />

          <div className={styles.columns}>
            <section className={page.stack} aria-labelledby="highlights-title">
              <h2 id="highlights-title" className={page.sectionTitle}>
                Destaques
              </h2>
              <ul className={page.list}>
                {experience.highlights.map((item) => (
                  <li key={item} className={page.listItem}>
                    <Sparkles size={18} className={page.listIcon} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
            <section className={page.stack} aria-labelledby="includes-title">
              <h2 id="includes-title" className={page.sectionTitle}>
                O que está incluso
              </h2>
              <ul className={page.list}>
                {experience.includes.map((item) => (
                  <li key={item} className={page.listItem}>
                    <Check size={18} className={page.listIcon} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <hr className={page.divider} />

          <section className={page.stack} aria-labelledby="meeting-title">
            <h2 id="meeting-title" className={page.sectionTitle}>
              Ponto de encontro
            </h2>
            <p className={page.muted}>{experience.meetingPoint}</p>
          </section>
        </div>

        <aside className={page.aside}>
          <Card padding="lg" className={styles.booking}>
            <div className={styles.price}>
              <span className={styles.priceValue}>{formatCurrency(experience.price)}</span>
              <span className={page.muted}>por pessoa</span>
            </div>
            <div className={page.stackSm}>
              <span className={page.muted}>Próximas datas</span>
              <div className={styles.dates}>
                {experience.availableDates.slice(0, 4).map((date) => (
                  <Badge key={date}>{formatShortDate(date)}</Badge>
                ))}
              </div>
            </div>
            <ButtonLink to={`/experiencias/${experience.id}/reservar`} size="lg" fullWidth>
              Reservar agora
            </ButtonLink>
            <span className={styles.note}>
              <ShieldCheck size={16} aria-hidden="true" />
              Cancelamento grátis até 48 horas antes.
            </span>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function ExperienceSkeleton() {
  return (
    <div className={page.stack} aria-busy="true" aria-label="Carregando experiência">
      <Skeleton width="220px" />
      <Skeleton shape="rect" className={styles.hero} height="auto" />
      <div className={page.split}>
        <div className={page.stack}>
          <Skeleton width="90px" height="24px" shape="circle" />
          <Skeleton width="70%" height="2.25rem" />
          <Skeleton width="50%" />
          <Skeleton />
          <Skeleton />
          <Skeleton width="80%" />
        </div>
        <Skeleton shape="rect" height="280px" />
      </div>
    </div>
  )
}
