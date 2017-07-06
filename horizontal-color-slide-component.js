const w = window.innerWidth,h = window.innerHeight
class HorizontalColorSlideComponent extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({mode:'open'})
        this.div = document.createElement('div')
        this.div.style.width = w
        this.div.style.height = h
        shadow.appendChild(this.div)
        this.populateColors()
    }
    populateColors() {
        this.colors = []
        const children = this.children
        for(var i=0;children.length;i++) {
            this.colors.push(children[i].getAttribute('color'))
        }
    }
    connectedCallback() {
        this.render()
        this.animationHandler = new AnimationHandler(this,)
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        if(!this.container) {
            this.container = new ColorSlideContainer(this.colors)
        }
        this.div.style.background = canvas.toDataURL()
    }
}
class ColorSlideContainer {
    constructor(colors) {
        this.colors = colors.map((color,index)=>new ColorSlide(color,index*w))
        this.index = 0
        this.x = 0
        this.prevX = 0
        this.dir = 0
    }
    draw(context) {
        context.save()
        context.translate(this.x,0)
        this.colors.forEach((color)=>{
            color.draw(context)
        })
        context.restore()
    }
    update() {
        this.x += this.dir * w/5
    }
    stopped() {
        if(this.prevX - this.x > w) {
            this.x = this.prevX - w
            this.prevX = this.x
            this.dir = 0
        }
    }
    start() {
        if(this.dir == 0) {
            this.dir = 1
        }
    }
}

class ColorSlide {
    constructor(color,x) {
        this.x = x
        this.color = color
    }
    draw(context) {
        context.save()
        context.translate(this.x,0)
        context.fillStyle = this.color
        context.fillRect(0,0,w,h)
        context.restore()
    }
}
class AnimationHandler {
    constructor(component,container) {
        this.animated = false
        this.component = component
        this.container = container
    }
    startAnimation() {
        if(this.animated == false) {
            this.animated = true
            const interval = setInterval(()=>{
                 this.component.render()
                 this.container.update()
                 if(this.component.stopped() == true) {
                    this.animated = false
                    clearInterval(interval)
                 }
            },50)
        }
    }
}
customElements.define('horizontal-color-slide-component',HorizontalColorSlideComponent)
