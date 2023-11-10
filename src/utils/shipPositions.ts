import { IBoat } from '../types/boards'

export const calculateOccupiedPositions = (ship: IBoat, position: number) => {
  const { vertical, wParts } = ship
  const occupiedPositions = []

  for (let i = 0; i < wParts; i++) {
    if (vertical) {
      occupiedPositions.push(position + (i * 10))
    } else {
      occupiedPositions.push(position + i)
    }
  }

  return occupiedPositions
}

export const allowedPosition = (ship: IBoat, position: number, positions: number[], occupiedPositions: number[]) => {
  const { wParts, vertical } = ship

  // check if ship is inside the board
  if (position < 0 || position > 99) return { valid: false }

  if (vertical) {
    const isNotValid = positions.some(number => number > 99 || number < 0)
    if (isNotValid) return { valid: false }
  } else {
    for (let i = position + 1; i < position + wParts; i++) {
      if (i % 10 === 0) {
        return { valid: false }
      }
    }
  }

  // Check if crash with other ship
  const isNotValidPosition = occupiedPositions.some((number) => positions.includes(number))
  const notValidPosition = occupiedPositions.filter((number) => positions.includes(number))
  if (isNotValidPosition) {
    return { valid: false, errorPosition: notValidPosition }
  }

  return { valid: true }
}

export const calculateAroundPositions = (occupiedPositions: number[]) => {
  const ocuppied = new Set()
  occupiedPositions.forEach(p => {
    ocuppied.add(p - 1)
    ocuppied.add(p + 1)
    ocuppied.add(p - 10)
    ocuppied.add(p + 10)
  })
  occupiedPositions.forEach(p => {
    ocuppied.delete(p)
  })
  return Array.from(ocuppied) as number[]
}
