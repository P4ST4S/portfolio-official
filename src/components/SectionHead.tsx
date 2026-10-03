interface SectionHeadProps {
  id: string
  kicker: string
  title: string
}

export function SectionHead({ id, kicker, title }: SectionHeadProps) {
  return (
    <header className="sh-head">
      <p className="sh-head__kicker">{kicker}</p>
      <h2 className="sh-head__title" id={id} data-ghost={title.toLowerCase()}>
        {title}
      </h2>
    </header>
  )
}
