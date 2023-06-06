import { IBoats } from '../types/boards'

import Artillero from '../assets/art.svg'
import PortaAviones from '../assets/porta.svg'
import Submarine from '../assets/sub.svg'
import Rescue from '../assets/res.svg'

export const boats: IBoats = {
  porta_aviones: { id: 0, name: 'porta_aviones', identificator: 'P', image: PortaAviones, wParts: 4, vertical: false },
  Submarino: { id: 1, name: 'Submarino', identificator: 'S', image: Submarine, wParts: 3, vertical: false },
  Submarino2: { id: 2, name: 'Submarino2', identificator: 'S', image: Submarine, wParts: 3, vertical: false },
  artillero1: { id: 3, name: 'artillero1', identificator: 'A', image: Artillero, wParts: 2, vertical: false },
  artillero2: { id: 4, name: 'artillero2', identificator: 'A', image: Artillero, wParts: 2, vertical: false },
  artillero3: { id: 5, name: 'artillero3', identificator: 'A', image: Artillero, wParts: 2, vertical: false },
  Rescate1: { id: 6, name: 'Rescate1', identificator: 'R', image: Rescue, wParts: 1, vertical: false },
  Rescate2: { id: 7, name: 'Rescate2', identificator: 'R', image: Rescue, wParts: 1, vertical: false },
  Rescate3: { id: 8, name: 'Rescate3', identificator: 'R', image: Rescue, wParts: 1, vertical: false }
}
