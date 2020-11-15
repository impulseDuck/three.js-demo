// import { get } from 'jquery';
import { Geometry, Material, Texture } from 'three';
import ThreeMap from './ThreeMap';
var THREE = require('three')
import pic1 from './img/lightray.jpg';
import pic2 from './img/lightray_yellow.jpg';

export default class ThreeMapLightBar extends ThreeMap {
    constructor(set, geojson) {
        super(set, geojson)
        this.textures = [new THREE.TextureLoader().load(pic1), new THREE.TextureLoader().load(pic2)]
        this.colors=['#fff','gold']
    }



    drawLightBar(data) {
        // console.log(data);
        var group = new THREE.Group()
        var texture = new THREE.TextureLoader().load(pic1)
        data.forEach((d,i)=> {
            console.log(this.vectorJson[d.name]);
            // console.log(data);
            const { cp } = this.vectorJson[d.name]
            const [x, y, z] = this.lnglatToVector(cp)
            var geomentry = new THREE.PlaneGeometry(1, d.value / 5)
            var material = new THREE.MeshBasicMaterial({
                map: this.textures[i % 2],
                // map:texture,
                color: '#ffff00',
                transparent: true,
                opacity: 0.7,
                depthTest: false, //深度测试属性
                blending: THREE.AdditiveBlending, //滤镜选择
                side: THREE.DoubleSide
            })
            var plane = new THREE.Mesh(geomentry, material)
            plane.position.set(x, y, -(z + d.value / 5 / 2))
            plane.rotation.x = Math.PI / 2
            group.add(plane)
            var plane2 = plane.clone()
            plane2.rotation.y = Math.PI / 2
            group.add(plane2)
            group.add(this.addBottomPlate([x,y,z]))
        })
        group.rotation.y=Math.PI
        this.scene.add(group)
    }
    addBottomPlate(point,i){
        var geometry=new THREE.CircleGeometry(0.5,6)
        var material=new THREE.MeshBasicMaterial({
            color:this.colors[i%2],
            side: THREE.DoubleSide
        })
        var circle=new THREE.Mesh(geometry,material)
        const [x,y,z]=point
        circle.position.set(x,y,z)
        return circle
    }
}