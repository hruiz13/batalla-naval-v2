import styles from './board.module.css'
import { useRef } from 'react'
import { SPOT_SIZE } from '../../config/board'
import { useBoard } from './useBoard'
import { useBoardStore } from '../../context/boardContext'

interface BoardProps {
  name: string
}

export const Board: React.FC<BoardProps> = ({
  name
}) => {
  const boardPosition = useRef<HTMLDivElement | null>(null)
  const { board } = useBoardStore()
  const {
    allBoats,
    handleReferences,
    handleStartDrag,
    handleAlign,
    handleDrag,
    handleEndDrag,
    shipsIdentifiers
  } = useBoard(boardPosition)

  return (
    <div >
      <div style={{ width: 600, height: 300 }}>
        {
          Object.values(allBoats).map((boat, index) => {
            return (
              <div
              draggable={true}
              key={`${index}-map`}
              onDragStart={(e) => handleStartDrag(e, boat.name)}
              onDragEnd={(e) => handleEndDrag(e, boat.name)}
              ref={(r) => handleReferences(r, boat.name)}
              onClick={() => handleAlign(boat.name)}
              style={{
                position: 'fixed',
                left: boat.x,
                top: boat.y,
                transform: boat.vertical ? 'rotate(-90deg)' : '',
                minWidth: boat.wParts * SPOT_SIZE,
                minHeight: boat.wParts * SPOT_SIZE,
                display: boat.spot !== undefined ? 'none' : 'block',
                zIndex: 11
              }}
              onDrag={(e) => handleDrag(e, boat.name)}
              >

              <img
              width={boat.wParts * SPOT_SIZE}
              height={boat.wParts * SPOT_SIZE}
              src={boat.image}
              draggable={false}
              />
              </div>

            )
          })
        }
      </div>
      <div className={styles.boardContainer} ref={boardPosition}>
        {
          board.map(spot => {
            const boat = Object.values(allBoats).find(bar => bar.spot === spot.id)
            const waterColor = shipsIdentifiers.some(l => spot.ship?.includes(l))
              ? 'var(--waterWithShip)'
              : spot.ship === 'waterAroundShip'
                ? 'var(--waterAroundShip)'
                : 'inherit'
            const shipParts = boat?.wParts ?? 0
            const isVertical = boat?.vertical ?? false
            const differenceDrag = boat?.startDragPosition?.part ?? 0
            const verticalXtranslate = ((SPOT_SIZE / 2) * shipParts) - SPOT_SIZE / 2
            const verticalYtranslate = ((differenceDrag * SPOT_SIZE) / 2) + ((SPOT_SIZE * shipParts) / 2) - (SPOT_SIZE + (differenceDrag * SPOT_SIZE) / 2) + (SPOT_SIZE / 2)
            return (
              <div
                key={spot.id}
                id={`${name}-${spot.id}`}
                className={styles.boardSpot}
                style={{
                  backgroundColor: waterColor
                }}
              >
                <div
                className={styles.ship}
                style={{
                  minWidth: SPOT_SIZE * shipParts,
                  minHeight: SPOT_SIZE,
                  transform: isVertical ? `translate(-${verticalXtranslate}px, ${verticalYtranslate}px) rotate(-90deg)` : ''
                }}
                >
                  <span style={{ position: 'absolute', left: 10, top: 10 }}>{spot.id}</span>
                  <img
                  src={boat?.image}
                  width={shipParts * SPOT_SIZE}
                  height={ SPOT_SIZE}
                  />
                </div>
              </div>
            )
          }
          )
        }
      </div>

    </div>
  )
}
