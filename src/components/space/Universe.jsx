import Galaxy from './Galaxy'
import galaxies from '../../data/galaxies'

export default function Universe() {
  return (
    <group>
      {galaxies.map((galaxy) => (
        <Galaxy key={galaxy.id} data={galaxy} />
      ))}
    </group>
  )
}
