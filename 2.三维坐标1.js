var THREE = require('three')
var camera, scene, renderer;
var geometry, material, mesh;

export default class ThreeMap{
    constructor() {
        this.init()
    }
    // 初始化
    init(){
        this.initRenderer()
        this.initCamera()
        this.initScene()
        this.render()
        this.setHelper()
    }
    initRenderer(){
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)
    }
    // 初始化相机
    initCamera(){
        this.camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 1000)
        this.camera.up.x = 0
        this.camera.up.y = 0
        this.camera.up.z = 1
        this.camera.position.set(100, 100, 100)
        this.camera.lookAt(0, 0, 0)
    }
    // 初始化场景
    initScene(){
        this.scene = new THREE.Scene()
    }

    // 渲染
    render(){
        this.animate()
    }
    // 动画方法
    animate(){
        requestAnimationFrame(this.animate.bind(this))
        this.renderer.render(this.scene, this.camera)
    }
    // 设置帮助器
    setHelper () {
        const axesHelper = new THREE.AxisHelper(5)
        this.scene.add(axesHelper)
    }

}

