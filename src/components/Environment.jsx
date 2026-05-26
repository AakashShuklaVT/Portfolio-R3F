import { useGLTF } from '@react-three/drei'

const Environment = () => {
    const { scene } = useGLTF('/models/environment/environment.glb');
    return (
        <primitive object={scene} scale={2} />
    )
}

export default Environment
