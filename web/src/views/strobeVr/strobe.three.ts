import * as THREE from "three"

const backgroundColors = [new THREE.Color(0xffffff), new THREE.Color(0x000000)]

export class StrobeThree {
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

    constructor(canvas: HTMLCanvasElement, width: number, height: number, flickerHz: number) {

        canvas.height = height
        canvas.width = width

        this.setFlickerHz(flickerHz)

        this.aspectRatio = width / height
        this.scene = new THREE.Scene()
        this.scene.background = backgroundColors[0]
        
        this.camera = new THREE.PerspectiveCamera(45, this.aspectRatio, 1, 5000)
		this.camera.position.set(0, 75, 160)

        this.canvasEl = canvas
        this.renderer = new THREE.WebGLRenderer({
            canvas, 
            antialias: true
        })

        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(width, height)

        // this.addLight()
        this.clock = new THREE.Clock()

        console.log(`StrobeThree init: width=${width}, height=${height}, flickerHz=${flickerHz}`)
    }

    endAnimation() {
        this.renderer.setAnimationLoop(null)
        this.clock.stop()
    }
    async start(session: XRSession) {
        this.clock.start()
        this.animate()
        await this.renderer.xr.setSession(session)
    }

    setFlickerHz(flickerHz: number) {
        this.flickerHz = flickerHz
        this.flipTime = 1 / (this.flickerHz * 2)
    }

    light = false
    lastFlipTime = 0
    animate() {
        const renderer = this.renderer
        renderer.xr.enabled = true
        renderer.setAnimationLoop(() => {
            const elapsed  = this.clock.getElapsedTime()

            const delta = elapsed - this.lastFlipTime

            if (this.flipTime < delta) {
                this.lastFlipTime = elapsed
                this.light = !this.light
                // console.log(`Flipped, time = ${delta}, flipTime=${this.flipTime}`)
            }

            let background = backgroundColors[1] // dark
            if (this.light)
                background = backgroundColors[0]
                
            this.scene.background = background

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
}