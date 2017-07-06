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
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const context = canvas.getContext('2d')
        this.div.style.background = canvas.toDataURL()
    }
}
