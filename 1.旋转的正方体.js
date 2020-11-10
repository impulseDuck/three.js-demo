// function a() {
//     alert('three.js场景demo')
// }

// a();

// import pic from './img/vue.jpg'
// console.log(pic);
// var img = new Image();
// img.src = pic;
// var app = document.querySelector('#app')
// app.append(img);

// import '@babel/polyfill'

// let a = '1'
// console.log(a);

// 1.首先安装 npm install three
// import * as three from 'three'
var THREE = require('three')

// 2.安装  npm install three-orbit-controls
// 3.安装材质文件 npm install three-obj-mtl-loader (包含两个加载器 .obj和.mtl)
// 3.安装 npm install --save three-css2drender
// console.log(three);
// 初始化场景设置
var camera,scene,renderer;
var geometry,material,mesh;
function initRenderer(){
    renderer=new THREE.WebGLRenderer({antialias:true})
    renderer.setSize(window.innerWidth,window.innerHeight)
    document.body.appendChild(renderer.domElement)
}
// 初始化相机
function initCamera(){
    camera = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.01,100)
    camera.position.z=1
}
// 初始化场景
function initScene(){
    scene=new THREE.Scene()
}

// 初始化对象
function initObj(){
    geometry=new THREE.BoxGeometry(0.2,0.2,0.2);
    material=new THREE.MeshNormalMaterial()
    mesh=new THREE.Mesh(geometry,material)
    scene.add(mesh)
}


// 渲染
function render(){
    animate()
}
// 动画方法
function animate(){
    requestAnimationFrame(animate)
    mesh.rotation.x+=0.01
    mesh.rotation.y+=0.02
    renderer.render(scene,camera)
}
function init(){
    initRenderer()
    initCamera()
    initScene()
    initObj()
    animate()
}
window.onload=init