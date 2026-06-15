import mockReference from '../../docs/reference/v2-command-center-mock.png'
import type { ViewMode } from './types'

type Props = {
  viewMode: ViewMode
}

export function ReferencePanel({ viewMode }: Props) {
  if (viewMode === 'lab3d') {
    return null
  }

  return (
    <aside className={`lab-reference ${viewMode === 'split' ? 'lab-reference--split' : ''}`}>
      <p className="lab-reference__title">Reference mock</p>
      <img
        src={mockReference}
        alt="v2 command center mock — hero tank target"
        className="lab-reference__img"
      />
    </aside>
  )
}
