interface StatsCardProps {
  label: string
  value: number | string
  icon: string
  colorClass?: string
}

export function StatsCard({ label, value, icon, colorClass = 'text-primary' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-premium flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center ${colorClass}`}>
        <span className="material-symbols-outlined text-2xl" aria-hidden="true">{icon}</span>
      </div>
      <div>
        <div className="font-heading text-2xl text-on-surface leading-none">{value}</div>
        <div className="font-body text-sm text-on-surface-variant mt-1">{label}</div>
      </div>
    </div>
  )
}
