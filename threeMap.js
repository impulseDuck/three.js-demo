var THREE = require('three') //正确
import * as d3 from 'd3-geo';
import { event } from 'jquery';
// import { log, Vector2 } from 'three';
var OrbitControls = require('three-orbit-controls')(THREE)

export default class ThreeMap {
    constructor(set) {
        this.mapData = set;
        this.init();
    }

    init() {
        this.initRenderer();
        this.initCamera();
        this.initScene();
        this.render();
        this.setHelper();
        this.drawMap()
        // this.drawChangsha()
        // this.drawLines()
        // this.drawGeometry();
        this.setControl()
        document.body.addEventListener('click', this.mouseEvent.bind(this))
    }

    //初始化渲染场景
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    //初始化相机
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 1000);
        //向上的一个坐标系
        this.camera.up.x = 0;
        this.camera.up.y = 0;
        this.camera.up.z = 1;
        this.camera.position.set(100, 100, 100);
        this.camera.lookAt(0, 0, 0)
    }

    //初始化场景
    initScene() {
        this.scene = new THREE.Scene();
    }


    //渲染
    render() {
        this.animate()
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    setHelper() {
        //红色x,绿色y,蓝色z
        const axesHelper = new THREE.AxisHelper(5);
        this.scene.add(axesHelper);
    }

    // 绘制几何体
    // drawGeometry() {
    //     // console.log(this.mapData);
    //     this.vectorJson = []
    //     this.mapData.features.forEach(item => {
    //         // console.log('1', item.geometry.coordinates)
    //         const areas = item.geometry.coordinates
    //         areas.forEach(i => {
    //             const areaData = { coordinates: [] }
    //             i.forEach((point, index) => {
    //                 if (point[0] instanceof Array) {
    //                     areaData.coordinates[index] = []
    //                     point.forEach(ponitInner => {
    //                         areaData.coordinates[index].push(this.lnglatToVector(ponitInner))
    //                     })
    //                 }
    //                 // console.log(point)
    //                 this.vectorJson.push(areaData)
    //             })
    //         })
    //         // console.log('vectorJson', this.vectorJson.push(areaData));
    //     })
    //     // this.lnglatToVector(this.mapData);
    //     // 绘制模块
    //     const group = new THREE.Group()
    //     this.vectorJson.forEach(e => {
    //         e.coordinates.forEach(area => {
    //             const mesh = this.getMesh(area)
    //             group.add(mesh)
    //         })
    //     })
    //     this.scene.add(group)
    // }


    // 获取mesh
    getMesh(point) {
        const shape = new THREE.Shape()
        point.forEach((p, i) => {
            const [x, y] = p
            // console.log(p);
            if (i === 0) {
                shape.moveTo(x, y)
            }
            else if (i === point.length - 1) {
                //   二次曲线
                shape.quadraticCurveTo(x, y, x, y)
            } else {
                shape.lineTo(x, y, x, y)
            }
        })
        const geometry = new THREE.ExtrudeGeometry(shape, { depth: 2, bevelEnabled: false })
        const material = new THREE.MeshBasicMaterial({
            color: '#99cccc',
            transparent: true,
            opacity: 0.9,
        })
        const mesh = new THREE.Mesh(geometry, material)
        return mesh
    }
    // 绘制多线条
    // drawLines() {
    //     this.vectorJson = []
    //     this.mapData.features.forEach(item => {
    //         // console.log('1', item.geometry.coordinates)
    //         const areas = item.geometry.coordinates
    //         const areaData = { coordinates: [] }
    //         areas.forEach(i => {
    //             areaData.coordinates.push(this.lnglatToVector(i))
    //             this.vectorJson.push(areaData)
    //         })
    //     })
    //     const group = new THREE.Group()
    //     this.vectorJson.forEach(area => {
    //         const mesh = this.getLines(area.coordinates)
    //         group.add(mesh)
    //     })
    //     this.scene.add(group)
    // }

    // 绘制线条
    getLines(points) {
        const material = new THREE.LineBasicMaterial({
            color: '#330000',
            transparent:true,
            opacity:0.9,
        })
        const geometry = new THREE.Geometry()
        points.forEach(p => {
            const [x, y, z] = p
            geometry.vertices.push(new THREE.Vector3(x, y, z))
        })
        const line = new THREE.Line(geometry, material)
        return line

    }
    // drawMap绘制地图
    drawMap() {
        // console.log('1111', this.mapData);
        this.vectorJson = []
        this.mapData.features.forEach(item => {
            // console.log('1', item.geometry.coordinates)
            const areas = item.geometry.coordinates[0]
            const areaData = { ...item.properties, coordinates: [] }
            areas.forEach((area, i) => {
                if (area[0] instanceof Array) {
                    areaData.coordinates[i] = []
                    area.forEach(point => {
                        areaData.coordinates[i].push(this.lnglatToVector(point))
                    })
                } else {
                    areaData.coordinates.push(this.lnglatToVector(area))

                }
            })
            this.vectorJson[item.properties.name]=areaData
            this.vectorJson.push(areaData)
        })
        const group = new THREE.Group()
        const lineGroup = new THREE.Line()
        this.vectorJson.forEach(provinces => {
            if(provinces.coordinates[0][0] instanceof Array){
                provinces.coordinates.forEach(area=>{
                    const mesh = this.getMesh(area)
                    group.add(mesh)
                    const line = this.getLines(area);
                    lineGroup.add(line);
                })
            }else{
                const mesh= this.getMesh(provinces.coordinates)
                const line = this.getLines(provinces.coordinates)
                group.add(mesh)
                lineGroup.add(line)
            }
            
        })
        this.group=group
        group.rotation.y=Math.PI
        lineGroup.rotation.y=Math.PI
        this.scene.add(group)
        this.scene.add(lineGroup)
    }

    // drawMap绘制地图
    // drawChangsha() {
    //     console.log('1111', this.mapData);
    //     this.vectorJson = []
    //     this.mapData.features.forEach(item => {
    //         // console.log('1', item.geometry.coordinates)
    //         const areas = item.geometry.coordinates[0]
    //         const areaData = { ...item.properties, coordinates: [] }
    //         areas.forEach((area, i) => {
    //             if (area[0] instanceof Array) {
    //                 areaData.coordinates[i] = []
    //                 area.forEach(point => {
    //                     areaData.coordinates[i].push(this.lnglatToVector(point))
    //                 })
    //             } else {
    //                 areaData.coordinates.push(this.lnglatToVector(area))

    //             }
    //         })
    //         this.vectorJson.push(areaData)
    //     })
    //     const group = new THREE.Group()
    //     const lineGroup = new THREE.Line()
    //     this.vectorJson.forEach(provinces => {
    //         if(provinces.coordinates[0][0] instanceof Array){
    //             provinces.coordinates.forEach(area=>{
    //                 const mesh = this.getMesh(area)
    //                 const line = this.drawLine(area)
    //                 group.add(mesh)
    //                 lineGroup.add(line)
    //             })
    //         }else{
    //             const mesh= this.getMesh(provinces.coordinates)
    //             group.add(mesh)
    //         }
            
    //     })
    //     this.scene.add(group)
    //     this.scene.add(lineGroup)
    // }


    //经纬度转三维坐标
    lnglatToVector(lnglat) {
        if (!this.projection) {
            this.projection = d3
                .geoMercator()
                .center([112.946332, 28.236672])
                .scale(60)
                // .rotate(Math.PI / 4)
                .translate([0, 0]);
        }
        //const projection = d3.geoMercator().center([108.904496, 32.668849]).scale(80);
        const [y, x] = this.projection([...lnglat]);
        let z = 0;
        return [y, x, z];
    }
    // 控制角度
    setControl() {
        this.controls = new OrbitControls(this.camera);
        this.controls.update();
    }


    // 鼠标点击显示颜色
    mouseEvent (event) {
        if(!this.raycaster) {
            this.raycaster = new THREE.Raycaster()
        }
        if(!this.mouse){
            this.mouse = new THREE.Vector2()
        }

        // 将鼠标归为设备坐标x 和 y 方向的取值范围是 (-1 to +1)
        this.mouse.x=(event.clientX/window.innerWidth)*2-1
        this.mouse.y=-(event.clientY/window.innerHeight)*2+1
        // 通过摄像机和鼠标位置更新线
        this.raycaster.setFromCamera(this.mouse, this.camera)
        // 计算物体和射线的焦点
        const intersects=this.raycaster.intersectObjects(this.group.children)
        this.group.children.forEach(mesh=>{
            mesh.material.color.set("#99cccc")
        })
        for(var i=0;i<intersects.length;i++){
            intersects[i].object.material.color.set('#9966cc')
        }
    }
}