interface Props {
  volume: number
}

export function VolumeBar({ volume }: Props) {
  return (
    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
        style={{ width: `${Math.round(volume * 100)}%` }}
      />
    </div>
  )
}
