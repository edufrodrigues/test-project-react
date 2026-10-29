import { useState } from 'react'
import { FlaskConical, RotateCcw } from 'lucide-react'
import { api } from '../../api/client'
import { SCENARIOS, setScenario, useScenario } from '../../lib/scenario'
import { Button } from '../Button/Button'
import styles from './ScenarioPanel.module.css'

/** Painel flutuante para trocar o cenário da API falsa durante os testes. */
export function ScenarioPanel() {
  const scenario = useScenario()
  const [open, setOpen] = useState(false)
  const current = SCENARIOS.find((option) => option.value === scenario)

  function handleReset() {
    api.reset()
    window.location.reload()
  }

  return (
    <div className={styles.root}>
      {open && (
        <div id="scenario-panel" className={styles.panel}>
          <h2 className={styles.heading}>Simular cenário</h2>
          <p className={styles.hint}>
            Também funciona pela URL, por exemplo <code>?cenario=erro</code>.
          </p>
          <fieldset className={styles.options}>
            <legend className="visually-hidden">Cenário da API</legend>
            {SCENARIOS.map((option) => (
              <label key={option.value} className={styles.option}>
                <input
                  type="radio"
                  name="scenario"
                  value={option.value}
                  checked={scenario === option.value}
                  onChange={() => setScenario(option.value)}
                />
                <span>
                  <span className={styles.optionLabel}>{option.label}</span>
                  <span className={styles.optionDescription}>{option.description}</span>
                </span>
              </label>
            ))}
          </fieldset>
          <div className={styles.footer}>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={handleReset}
              iconLeft={<RotateCcw size={14} aria-hidden="true" />}
            >
              Restaurar dados de exemplo
            </Button>
          </div>
        </div>
      )}
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls="scenario-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <FlaskConical size={16} aria-hidden="true" />
        Cenário: {current?.label}
        <span className={styles.dot} data-scenario={scenario} aria-hidden="true" />
      </button>
    </div>
  )
}
