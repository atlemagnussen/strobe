import { XRPlanes } from "three/addons/webxr/XRPlanes.js"
import * as THREE from "three"

export class PlainRenderer {
    canvasEl: HTMLCanvasElement
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    animFrame = 0
    aspectRatio = 1
    cube: THREE.Mesh | null = null

    clock: THREE.Clock
    
    flickerHz = 7.83
    flipTime = 1

    constructor(canvas: HTMLCanvasElement, width: number, height: number) {

        canvas.height = height
        canvas.width = width

        this.flipTime = 1 / (this.flickerHz * 2)
        console.log("flipTime", this.flipTime)

        this.aspectRatio = width / height
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0xaaaaaa)
        
        this.camera = new THREE.PerspectiveCamera(45, this.aspectRatio, 1, 5000)
		this.camera.position.set(0, 75, 160)

        this.canvasEl = canvas
        this.renderer = new THREE.WebGLRenderer({
            canvas, 
            antialias: true
        })

        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(width, height)

        // this.addPlanes()
        // this.addRoom()
        // this.addCube()
        this.addLight()
        this.clock = new THREE.Clock()
    }

    async startSession(session: XRSession) {
        this.clock.start()
        this.start()
        await this.renderer.xr.setSession(session)
    }

    start() {
        this.animate()
    }

    light = false

    lastFlipTime = 0
    animate() {
        const renderer = this.renderer
        renderer.xr.enabled = true
        renderer.setAnimationLoop(() => {
            // if (this.cube) {
            //     this.cube.rotation.x += 0.01
            //     this.cube.rotation.y += 0.01
            // }
            renderer.render(this.scene, this.camera)
        })
    }
    onWindowResize(width: number, height: number) {
        this.aspectRatio = width / height
        this.camera.aspect = this.aspectRatio
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(width, height)

    }
    
    addLight() {
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3)
		light.position.set(0.5, 1, 0.25)
		this.scene.add(light)
    }
    addSunLight() {
        const sunLight = new THREE.DirectionalLight('rgb(255,255,255)', 3)
        sunLight.position.set(5, 7, - 1)
		sunLight.lookAt(this.scene.position)
		this.scene.add(sunLight)
    }
    addCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
        this.cube = new THREE.Mesh( geometry, material)
        this.scene.add(this.cube)

        this.camera.position.z = 10
    }

    addPlanes() {
        const planes = new XRPlanes(this.renderer)
		this.scene.add(planes as THREE.Object3D<THREE.Object3DEventMap>)
    }
    addRoom() {
        const planeGeo = new THREE.PlaneGeometry(100.1, 100.1)
        const planeBottom = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial({ color: 0xffffff }))
        planeBottom.rotateX(-Math.PI / 2)
        this.scene.add(planeBottom)
    }
}