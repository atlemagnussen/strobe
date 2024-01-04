import { VRButton } from "three/addons/webxr/VRButton.js"
import * as THREE from "three"


export class ThreeWorldRenderer {
    canvasEl: HTMLCanvasElement
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.Camera
    animFrame = 0

    cube: THREE.Mesh | null = null
    constructor(canvas: HTMLCanvasElement, width: number, height: number) {

        canvas.height = height
        canvas.width = width

        const aspectRatio = width / height
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000)
        this.canvasEl = canvas
        this.renderer = new THREE.WebGLRenderer({
            canvas, 
            antialias: true
        })

        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(width, height)
        this.camera.position.z = 15

        this.addCube()
        this.animate()
    }
    animate() {
        const renderer = this.renderer
        renderer.xr.enabled = true
        renderer.setAnimationLoop(() => {
            if (this.cube) {
                this.cube.rotation.x += 0.01
                this.cube.rotation.y += 0.01
            }
            renderer.render(this.scene, this.camera)
        })
    }
    
    getVRButton() {
        return VRButton.createButton(this.renderer)
    }

    addCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1 )
        const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
        this.cube = new THREE.Mesh( geometry, material)
        this.scene.add(this.cube)

        this.camera.position.z = 5
    }

}