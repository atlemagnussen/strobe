let blackColor = "#000"
let greyWhiteColor = "#AAA"

export class CanvasRenderer {

    interval = 0

    flickerHz = 7.83
    flipTime = 1
    
    private element: HTMLCanvasElement
    private context: CanvasRenderingContext2D
    
    private lightColor = greyWhiteColor

    constructor(element: HTMLCanvasElement, w: number, h: number, lightColor?: string) {
        this.element = element

        if (lightColor)
            this.lightColor = lightColor

        this.context = this.element.getContext("2d")!
        this.setSize(w, h)
        this.setBackgroundColor(this.lightColor)
    }

    setFlickerHz(flickerHz: number) {
        this.flickerHz = flickerHz
        this.flipTime = 1 / (this.flickerHz * 2) * 1000
    }

    setLightColor(color: string) {
        this.lightColor = color
    }
    setSize(w: number, h: number) {
        this.element.width = w
        this.element.height = h
        this.context.rect(0, 0, w, h)
    }

    setBackgroundColor(color: string) {
        this.context.fillStyle = color
        this.context.fill()
    }
    
    setFullScreen() {
        this.setSize(window.innerWidth, window.innerHeight)
    }
    isLight = true
    start() {
        this.interval = window.setInterval(() => {
            this.isLight = !this.isLight
            if (this.isLight)
                this.setBackgroundColor(this.lightColor)
            else
                this.setBackgroundColor(blackColor)

        }, this.flipTime)
    }
    stop() {
        if (this.interval)
            window.clearInterval(this.interval)
    }
}