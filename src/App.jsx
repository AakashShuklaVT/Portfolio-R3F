import { KeyboardControls } from '@react-three/drei'
import Game from "./components/Game"

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'shoot', keys: ['Space'] },
]

function App() {
  return (
    <KeyboardControls map={keyboardMap}>
      <Game />
    </KeyboardControls>
  )
} 

export default App
