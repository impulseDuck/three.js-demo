var THREE = require('three') //正确
import * as d3 from 'd3-geo';
import { log, Vector2 } from 'three';

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
        this.drawGeometry();
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
    drawGeometry() {
        console.log(this.mapData);
        this.vectorJson=[]
        this.mapData.features.forEach(item=>{
            const areas = item.geometry.coordinates
            const areaData={coordinates:[]}
            areas.forEach(i=>{
                i.forEach(point=>{
                    areaData.coordinates.push(this.lnglatToVector(point))
                    console.log(point)
                })
                this.vectorJson.push(areaData)
            })
            console.log(this.vectorJson);
        })
        // this.lnglatToVector(this.mapData);
        // 绘制模块
        const group = new THREE.Group()
        this.vectorJson.forEach(e=>{
            const mesh = this.getMesh(e.coordinates)
            group.add(mesh)
        })
        this.scene.add(group)
    }


    // 获取mesh
    getMesh(point){
        console.log('ponit', point);
      const shape = new THREE.Shape()
      point.forEach((p,i)=>{
          const [x,y]=p
          if(i===0){
              shape.moveTo(x,y)
          }
          else if (i===point.length-1){
            //   二次曲线
            shape.quadraticCurveTo(x,y,x,y)
          } else{
              shape.lineTo(x,y,x,y)
          }
      })
      const geometry=new THREE.ExtrudeGeometry(shape,{depth:-2,bevelEnabled:false})
      const material=new THREE.MeshBasicMaterial({
          color:'#007cff',
          transparent:true,
          opacity:0.5
      })
      const mesh = new THREE.Mesh(geometry,material)
      return mesh
    }



    //经纬度转三维坐标
    lnglatToVector(lnglat) {
        if (!this.projection) {
            this.projection = d3
                .geoMercator()
                .center([117.189316, 39.107538])
                .scale(80)
                //.rotate(Math.PI / 4)
                //.translate([0, 0]);
        }
        //const projection = d3.geoMercator().center([108.904496, 32.668849]).scale(80);
        const [y, x] = this.projection([...lnglat]);
        let z = 0;
        return [y, x, z];
    }
}