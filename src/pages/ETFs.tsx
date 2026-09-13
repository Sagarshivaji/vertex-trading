import { PageHeader } from '../components/PageHeader'
import { InstrumentTable } from '../components/InstrumentTable'
import { getETFs } from '../lib/stocks'

export default function ETFs() {
  const etfs = getETFs()
  return (
    <div className="pb-16">
      <PageHeader title="ETFs" subtitle={`Explore ${etfs.length} exchange-traded funds spanning broad market, sector and thematic exposure.`} />
      <div className="px-4 sm:px-6 mt-4">
        <div className="glass-panel rounded-2xl overflow-hidden">
          <InstrumentTable instruments={etfs} />
        </div>
      </div>
    </div>
  )
}
