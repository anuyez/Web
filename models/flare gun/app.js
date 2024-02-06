// 从CDN导入Three.js库的主模块。
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.125.2/build/three.module.js';
// 从Three.js的扩展中导入GLTFLoader模块，用于加载GLTF格式的模型。
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.125.2/examples/jsm/loaders/GLTFLoader.js';
// 从Three.js的扩展中导入OrbitControls模块，用于添加交互式控制（如旋转、缩放）。
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.125.2/examples/jsm/controls/OrbitControls.js';


// 创建场景
var scene = new THREE.Scene();


//创建一个具有透视投影的相机，参数分别是：
//视野角度：用度数表示,它决定了相机视野的宽度。
//长宽比：这里使用浏览器窗口的宽度除以高度来计算。
//近裁剪面：相机能够看到的最近的距离。在这个例子中，相机无法看到距离自己小于0.1单位的物体。
//远裁剪面：在这个例子中，相机无法看到距离自己超过1000单位的物体。
var camera = new THREE.PerspectiveCamera(80,window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 0, 10);


// 创建渲染器
var renderer = new THREE.WebGLRenderer();//创建一个WebGL渲染器。
renderer.setSize(window.innerWidth,window.innerHeight);//设置渲染器的大小。
renderer.setClearColor(0xcdcdcd);//设置背景颜色。
document.body.appendChild(renderer.domElement);//将渲染器的DOM元素添加到HTML文档中。


// 创建环境光，提供无方向的光。
var ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
scene.add(ambientLight);

// 创建平行光，模拟太阳光等远距离光源。
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.65);
directionalLight.position.set(1, 1, -1);
scene.add(directionalLight);

//创建点光源，从一个点向四面八方发射光线。
var pointLight = new THREE.PointLight(0xffffff);
scene.add(pointLight);


// 创建 GLTFLoader 实例
var loader = new GLTFLoader();//这是一个 Three.js 加载器，专门设计用于加载 GLTF 格式的模型。
var model;//声明一个未分配任何初始值的变量。此变量可能用于在使用 加载后存储加载的 3D 模型。


//创建一个轨道控制器，允许用户通过鼠标操作来旋转、缩放和平移场景。
var controls = new OrbitControls(camera, renderer.domElement);//创建一个OrbitControls实例，将相机 (camera) 和渲染器 (renderer) 的 DOM 元素传递给它。这样，控制器就知道它需要操控哪个相机以及在哪个 DOM 元素上响应用户输入。
controls.enableDamping = true;//启用阻尼效果，这可以使相机的运动更加平滑。启用阻尼后，相机在停止移动后会逐渐减速而不是立即停止。
controls.dampingFactor = 0.05;//设置阻尼的因子。这个值越大，阻尼效果就越强。
controls.enableZoom = true;//启用相机的缩放功能。
controls.zoomSpeed = 1;//设置缩放的速度。


// 加载模型
loader.load('models/scene.gltf', function (gltf) {//指定路径 来加载一个 GLTF 格式的模型文件。
model = gltf.scene;//通过 gltf.scene 获取了加载的模型数据。
model.scale.set(1, 1, 1);//设置模型的缩放比例为 (1, 1, 1)，即原始大小。以确保模型在加载时具有正常的尺寸。
scene.add(model);//将加载的模型添加到 Three.js 场景中，使其可以在场景中显示。

var boundingBox = new THREE.Box3().setFromObject(model);//创建一个 Box3 对象，表示模型的边界框，并使用 setFromObject 方法计算边界框。
var center = boundingBox.getCenter(new THREE.Vector3());// 使用 getCenter 方法获取了边界框的中心点，并且传递了一个新创建的 THREE.Vector3 对象，表示中心点的坐标。
controls.target.copy(center);//将控制器的目标点（controls.target）设置为模型的中心点。用于控制相机围绕模型旋转时的焦点。

// 调用 animate 函数，这可能是一个用于启动渲染循环的函数，以更新 Three.js 场景并进行动画渲染。
animate();
}, undefined, function (error) {
console.error(error);
});

// 动画循环
function animate() {//定义一个名为 animate 的函数，用于动画循环。
requestAnimationFrame(animate);// 使用 requestAnimationFrame方法来告诉浏览器在下一帧执行 animate 函数。这是一种优雅的方式来进行动画循环，因为它会在浏览器的渲染周期内执行，以获得最佳性能和平滑的动画效果。
controls.update();//调用相机控制器的 update 方法。这通常用于更新控制器的内部状态，以响应用户输入，例如鼠标或触摸屏的移动。
renderer.render(scene, camera);//使用 Three.js 渲染器 (renderer) 渲染场景 (scene) 中的相机 (camera)。
}

// 添加了一个事件监听器，更新窗口大小时的处理。
// 在窗口大小变化时更新相机和渲染器的相关参数，以确保场景在新的窗口尺寸下能够正确显示和渲染。
window.addEventListener('resize', onWindowResize, false);//使用 addEventListener 在窗口对象上注册了一个事件监听器。当窗口大小发生变化时，会触发名为 onWindowResize 的处理函数。
function onWindowResize() {//定义了一个名为 onWindowResize 的处理函数。用于在窗口大小变化时调整相机和渲染器的相关参数，以确保场景在新的窗口尺寸下能够正确渲染。
camera.aspect = window.innerWidth / window.innerHeight;//更新相机 (camera) 的横纵比（aspect ratio），以适应新的窗口宽高比。这是为了防止场景变形，保持渲染正常。
camera.updateProjectionMatrix();//调用 updateProjectionMatrix 方法，以确保相机的投影矩阵在横纵比更新后得到正确的更新。这是因为 Three.js 中的相机使用投影矩阵来定义其视锥体，这个视锥体决定了渲染的可见范围。
renderer.setSize(window.innerWidth,window.innerHeight);//调整渲染器 (renderer) 的大小以匹配新的窗口尺寸。这确保了渲染器占据整个窗口，并且渲染的画面会适应新的窗口大小。
}