import { Link } from 'react-router'
import { Clock, MapPin } from 'lucide-react'
import type { Experience } from '../../api/types'
import { Badge } from '../../components/Badge/Badge'
import { Card } from '../../components/Card/Card'
import { Rating } from '../../components/Rating/Rating'
import { Skeleton } from '../../components/Skeleton/Skeleton'
import { categoryLabels, formatCurrency, formatDuration } from '../../lib/format'
import { ExperienceArt } from './ExperienceArt'
import styles from './ExperienceCard.module.css'

export function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <Card padding="none" interactive>
      <Link to={`/experiencias/${experience.id}`} className={styles.card}>
        <div className={styles.media}>
          <ExperienceArt art={experience.art} className={styles.art} />
          <Badge className={styles.category}>{categoryLabels[experience.category]}</Badge>
        </div>
        <div className={styles.body}>
          <span className={styles.location}>
            <MapPin size={12} aria-hidden="true" />
            {experience.city}, {experience.state}
          </span>
          <h3 className={styles.title}>{experience.title}</h3>
          <p className={styles.summary}>{experience.summary}</p>
          <div className={styles.footer}>
            <div className={styles.price}>
              a partir de
              <strong>{formatCurrency(experience.price)}</strong>
            </div>
            <div className={styles.meta}>
              <Rating value={experience.rating} count={experience.reviewsCount} />
              <span className={styles.duration}>
                <Clock size={12} aria-hidden="true" />
                {formatDuration(experience.durationHours)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  )
}

export function ExperienceCardSkeleton() {
  return (
    <Card padding="none" aria-hidden="true">
      <div className={styles.card}>
        <Skeleton shape="rect" height="auto" className={styles.media} />
        <div className={styles.body}>
          <Skeleton width="45%" />
          <Skeleton width="85%" height="1.25em" />
          <Skeleton width="100%" />
          <Skeleton width="70%" />
          <div className={styles.footer}>
            <Skeleton width="30%" height="1.5em" />
            <Skeleton width="25%" height="1.5em" />
          </div>
        </div>
      </div>
    </Card>
  )
}
