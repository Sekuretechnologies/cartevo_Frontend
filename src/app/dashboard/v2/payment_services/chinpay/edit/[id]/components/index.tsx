import React from 'react'
import DetailsMain from './DetailsMain'
import DetailsSide from './DetailsSide'

export default function Index() {
  return (
    <section className="px-4 flex flex-between items-start gap-10 mb-6">
      <DetailsMain />
      <DetailsSide />
    </section>
  )
}
