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
        for(var i=0;i<children.length;i++) {
            this.colors.push(children[i].innerHTML)
        }
    }
    connectedCallback() {
        this.render()
        this.animationHandler = new AnimationHandler(this,this.container)
        this.div.onmousedown = (event) => {
            this.animationHandler.startAnimation()
        }
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        if(!this.container) {
            this.container = new ColorSlideContainer(this.colors)
        }
        this.container.draw(context)
        this.div.style.background = `url(${canvas.toDataURL()})`
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
        this.x -= this.dir * w/5
        if(this.prevX - this.x > w) {
            this.x = this.prevX - w
            this.prevX = this.x
            this.dir = 0
        }
    }
    stopped() {
        return this.dir == 0
    }
    start() {
        if(this.dir == 0 && this.x > -1*(this.colors.length -1)*w) {
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
            this.container.start()
            console.log(this.container)
            const interval = setInterval(()=>{
                 this.component.render()
                 this.container.update()
                 if(this.container.stopped() == true) {
                    this.animated = false
                    console.log(this.animated)
                    clearInterval(interval)
                 }
            },100)
        }
    }
}
customElements.define('horizontal-color-slide-component',HorizontalColorSlideComponent)
