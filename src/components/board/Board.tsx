import styles from './board.module.css'
import { useEffect, useRef } from 'react'
import { SPOT_SIZE } from '../../config/board'
import { useBoard } from './useBoard'
import { useBoardStore } from '../../context/boardContext'
import { useLocation } from 'wouter'
import { socket } from '../../socket'

export const Board = () => {
  const boardPosition = useRef<HTMLDivElement | null>(null)
  const [, setLocation] = useLocation()
  const searchParams = new URLSearchParams(window.location.search)
  const {
    allBoats,
    handleReferences,
    handleStartDrag,
    handleAlign,
    handleDrag,
    handleEndDrag,
    shipsIdentifiers,
    shipSelected,
    setShipSelected,
    handleBoardClick,
    errorPosition
  } = useBoard(boardPosition)
  const { board, playerName, otherPlayerName, setOtherPlayerName } = useBoardStore()

  useEffect(() => {
    const roomUuid = searchParams.get('room')
    if (!roomUuid) {
      setLocation('/')
    }
  }, [])

  useEffect(() => {
    function onJoinedRoom (data: any) {
      setOtherPlayerName(data.userName)
    }
    function onStartGame (data: any) {
      console.log('Ambos listos', data)
    }
    socket.on('joined_room', onJoinedRoom)
    socket.on('start_game', onStartGame)

    return () => {
      socket.off('joined_room', onJoinedRoom)
      socket.off('start_game', onStartGame)
    }
  }, [])

  const handleEndDragShip = (e: React.DragEvent<HTMLDivElement>, name: string) => {
    handleEndDrag(e, name)
  }

  return (
    <div >
      <div>Contrincante: {otherPlayerName}</div>
      <div className={styles.h2}><h2>Mis barcos</h2></div>
      <div className={styles.shipsContainer}>
        <div className={styles.shipsListContainer}>
          {
            Object.values(allBoats).map((boat, index) => {
              return (
                <div
                  key={`boat-name-${index}`}
                  className={styles.shipName}
                  onClick={() => setShipSelected(boat)}
                  style={{ backgroundColor: boat?.spot !== undefined ? 'var(--darkerGreen)' : '' }}
                >
                  {boat.label}
                </div>
              )
            })
          }
        </div>
        <div className={styles.shipInfo}>
          <div className={styles.col}>
            <h3>{shipSelected?.label}</h3>
            <h4>Cantidad de celdas: {shipSelected?.wParts}</h4>

            <div
              className={styles.shipContainer}
            >
              {
                Object.values(allBoats).filter(boat => boat.id === shipSelected?.id).map((boat, index) => {
                  return (
                    <div
                      key={`${index}-map`}
                      draggable={true}
                      onDragStart={(e) => handleStartDrag(e, boat.name)}
                      onDragEnd={(e) => handleEndDragShip(e, boat.name)}
                      ref={(r) => handleReferences(r, boat.name)}
                      onClick={() => handleAlign(boat.name)}
                      style={{
                        position  : 'fixed',
                        left      : boat.x,
                        top       : boat.y,
                        transform : boat.vertical ? 'rotate(-90deg)' : '',
                        minWidth  : boat.wParts * SPOT_SIZE,
                        minHeight : boat.wParts * SPOT_SIZE,
                        display   : boat.spot !== undefined ? 'none' : 'block',
                        zIndex    : 11
                        // display   : shipSelected === index ? 'block' : 'none'
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
          </div>
          <div className={styles.col}>
            <span>Arrastrar para poner en el tablero.</span>
            <span>Click en el barco para rotar</span>
          </div>
        </div>
      </div>
      <div className={styles.boardContainer} ref={boardPosition}>
        {
          board.slice(0, 100).map(spot => {
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
                id={`${playerName}-${spot.id}`}
                className={styles.boardSpot}
                style={{
                  backgroundColor : waterColor,
                  animation       : errorPosition?.includes(spot.id) ? 'blink 0.5s linear infinite alternate 1.5s' : ''
                }}
                onClick={() => handleBoardClick(spot.id)}
              >
                {
                  errorPosition?.includes(spot.id) && (
                    <span className={styles.tooltiptext}>Posicion invalida</span>
                  )
                }
                <div
                  className={styles.ship}
                  style={{
                    minWidth  : SPOT_SIZE * shipParts,
                    minHeight : SPOT_SIZE,
                    transform : isVertical ? `translate(-${verticalXtranslate}px, ${verticalYtranslate}px) rotate(-90deg)` : ''
                  }}
                >
                  <span style={{ position: 'absolute', left: 10, top: 10 }} >{spot.id}</span>
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
