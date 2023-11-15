import { create } from 'zustand'

interface IBoard {
  id: number
  name?: string
  ship?: string
}

interface BoardStore {
  board: IBoard[]
  setBoard: (board: IBoard[]) => void
  playerName: string
  setPlayerName: (name: string) => void
  otherPlayerName?: string
  setOtherPlayerName: (name: string) => void
}

const spots: IBoard[] = Array.from(Array(100).keys()).map((num) => {
  return { id: num }
})

export const useBoardStore = create<BoardStore>()((set) => ({
  board              : spots,
  setBoard           : (board) => set(() => ({ board })),
  playerName         : '',
  setPlayerName      : (name) => set(() => ({ playerName: name })),
  otherPlayerName    : '',
  setOtherPlayerName : (name) => set(() => ({ otherPlayerName: name }))

}))
