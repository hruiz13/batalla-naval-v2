interface IPosition {
  x: number
  y: number
  part?: number
}

interface IBoat {
  id: int
  name: string
  image: string
  wParts: number
  identificator: string
  initialPosition?: IPosition
  startDragPosition?: IPosition
  dropPosition?: IPosition
  spot?: number
  vertical: boolean
  x?: number
  y?: number
  offset?: IPosition
}

export interface IBoats {
  [key: string]: IBoat
}
