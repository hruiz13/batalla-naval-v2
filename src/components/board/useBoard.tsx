import { DragEvent, useState, useEffect } from 'react'
import { SPOT_SIZE } from '../../config/board'

import { boats } from '../../config/boats'
import { useBoardStore } from '../../context/boardContext'
import { IBoats } from '../../types/boards'
import { allowedPosition, calculateOccupiedPositions, calculateAroundPositions } from '../../utils/shipPositions'

export const useBoard = (boardPosition: React.MutableRefObject<HTMLDivElement | null>) => {
  const [allBoats, setAllBoats] = useState<IBoats>(boats)
  const { board, setBoard } = useBoardStore()
  const [shipsIdentifiers, setShipsIdentifiers] = useState<string[]>([])

  const [occupiedPositions, setOccupiedPositions] = useState<number[]>([])

  const handleReferences = (ref: HTMLDivElement | null, name: string) => {
    if (allBoats[name].initialPosition !== undefined || ref === null) return
    allBoats[name].initialPosition = { x: ref.offsetLeft, y: ref.offsetTop }
    allBoats[name].x = ref.offsetLeft
    allBoats[name].y = ref.offsetTop
    allBoats[name].offset = { x: ref.offsetLeft, y: ref.offsetTop }
    setAllBoats(structuredClone(allBoats))
  }

  const handleStartDrag = (e: DragEvent<HTMLDivElement>, name: string) => {
    // to hide shadow while drag
    const emptyImage = document.createElement('img')
    emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
    e.dataTransfer.setDragImage(emptyImage, 0, 0)

    // selected ship
    const actualBoat = allBoats[name]
    if (actualBoat.initialPosition === undefined) return

    // General ship size
    const canvasSize = (SPOT_SIZE * actualBoat.wParts) / actualBoat.wParts
    // get drag position click on X
    const toXCero = e.pageX - actualBoat.initialPosition.x
    const positionX = Math.floor(toXCero / canvasSize)
    // get drag position click on Y
    const toYCero = e.pageY - actualBoat.initialPosition.y
    const positionY = Math.floor(toYCero / canvasSize)

    allBoats[name].startDragPosition = { x: e.pageX, y: e.pageY, part: actualBoat.vertical ? positionY : positionX }
    if (e.target instanceof HTMLElement) {
      allBoats[name].offset = { x: Number(e.target.style.left.replace('px', '')), y: Number(e.target.style.top.replace('px', '')) }
    }
    setAllBoats(structuredClone(allBoats))
  }

  const handleDrag = (e: DragEvent<HTMLDivElement>, name: string) => {
    const boat = allBoats[name]

    if (boat.startDragPosition === undefined || boat.offset === undefined || boat.initialPosition === undefined) return
    if (e.clientX === 0 || e.clientY === 0) {
      allBoats[name].x = boat.initialPosition.x
      allBoats[name].y = boat.initialPosition.y
      setAllBoats(structuredClone(allBoats))
      return
    }
    allBoats[name].x = e.clientX + boat.offset.x - boat.startDragPosition.x
    allBoats[name].y = e.clientY + boat.offset.y - boat.startDragPosition.y

    setAllBoats(structuredClone(allBoats))
  }

  const handleEndDrag = (e: DragEvent<HTMLDivElement>, name: string) => {
    const curentShip = allBoats[name]

    if (boardPosition.current === null || curentShip.startDragPosition === undefined) return

    // validate if coursor its outside board.
    if (e.pageX < boardPosition.current.offsetLeft ||
        e.pageX > (boardPosition.current?.offsetLeft + (SPOT_SIZE * 10)) ||
        e.pageY < boardPosition.current.offsetTop ||
        e.pageY > (boardPosition.current?.offsetTop + (SPOT_SIZE * 10))
    ) {
      return
    }

    allBoats[name].dropPosition = { x: e.pageX, y: e.pageY }

    const currentShipPart = curentShip.startDragPosition.part ?? 0
    const spotX = Math.floor((e.pageX - boardPosition.current.offsetLeft) / SPOT_SIZE)
    const spotY = Math.floor((e.pageY - boardPosition.current.offsetTop) / SPOT_SIZE)
    // new position in the board
    const newXPos = ((spotX) + (spotY * 10)) - (currentShipPart)
    let newPosition = -1
    if (newXPos >= 0 && newXPos < 100 && !curentShip.vertical) {
      newPosition = newXPos
    } else {
      newPosition = ((spotX) + (spotY * 10)) - ((currentShipPart) * 10)
    }

    const positions = calculateOccupiedPositions(curentShip, newPosition)
    const aroundPositions = calculateAroundPositions(positions)

    // check if it's valid position or crash with other ship
    const isValid = allowedPosition(curentShip, newPosition, [...positions, ...aroundPositions], occupiedPositions)
    if (!isValid) {
      return
    }

    allBoats[name].spot = newPosition
    setOccupiedPositions(occupied => [...occupied, ...positions])
    setAllBoats(structuredClone(allBoats))

    // set ships positions on global state
    positions.forEach(position => {
      board[position] = { ...board[position], ship: curentShip.identificator }
    })
    // set around ship positions on global state
    aroundPositions.forEach(position => {
      board[position] = { ...board[position], ship: 'waterAroundShip' }
    })
    setBoard(board)
  }

  const handleAlign = (name: string) => {
    allBoats[name].vertical = !allBoats[name].vertical
    setAllBoats(structuredClone(allBoats))
  }

  useEffect(() => {
    Object.values(boats).forEach(boat => {
      if (!shipsIdentifiers.includes(boat.identificator)) {
        setShipsIdentifiers(b => [...b, boat.identificator])
      }
    })
  }, [])

  return {
    allBoats,
    handleReferences,
    handleStartDrag,
    handleDrag,
    handleEndDrag,
    handleAlign,
    shipsIdentifiers
  }
}
