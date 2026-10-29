import { NavLink, Outlet, ScrollRestoration, Link } from 'react-router'
import { CalendarCheck, Compass, Mountain } from 'lucide-react'
import { profile } from '../../api/data'
import { cx } from '../../lib/cx'
import { Avatar } from '../Avatar/Avatar'
import { ScenarioPanel } from './ScenarioPanel'
import styles from './AppLayout.module.css'

function navClass({ isActive }: { isActive: boolean }) {
  return cx(styles.navLink, isActive && styles.active)
}

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={cx(styles.container, styles.headerInner)}>
          <Link to="/" className={styles.logo} aria-label="Rota, página inicial">
            <span className={styles.logoMark} aria-hidden="true">
              <Mountain size={18} />
            </span>
            Rota
          </Link>
          <nav className={styles.nav} aria-label="Principal">
            <NavLink to="/" end className={navClass}>
              <Compass size={18} aria-hidden="true" />
              <span className={styles.navLabel}>Explorar</span>
            </NavLink>
            <NavLink to="/reservas" className={navClass}>
              <CalendarCheck size={18} aria-hidden="true" />
              <span className={styles.navLabel}>Minhas reservas</span>
            </NavLink>
            <NavLink to="/perfil" className={styles.profileLink} aria-label="Meu perfil">
              <Avatar name={profile.name} size="sm" />
            </NavLink>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={cx(styles.container, styles.footerInner)}>
          <span>Rota, projeto de demonstração com dados fictícios.</span>
          <span>Feito com React, Vite e React Router.</span>
        </div>
      </footer>

      <ScenarioPanel />
      <ScrollRestoration />
    </div>
  )
}
