import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.125.2/build/three.module.js';
        import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.125.2/examples/jsm/loaders/GLTFLoader.js';
        import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.125.2/examples/jsm/controls/OrbitControls.js';

        // 创建场景
        const scene = new THREE.Scene();

        // 创建相机
        const camera = new THREE.PerspectiveCamera(5,window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(10, 0, 6);

        // 创建渲染器
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xcdcdcd);
        document.body.appendChild(renderer.domElement);
        
        // 创建环境光
        const ambientLight = new THREE.AmbientLight(0xffffff,12);
        scene.add(ambientLight);

        // 创建定向光
        const directionalLight = new THREE.DirectionalLight(0xffffff,5);
        directionalLight.position.set(1 , 1, -1);
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff,15); 
        scene.add(pointLight);

        // 创建 GLTFLoader 实例
        const loader = new GLTFLoader();
        let model;

        // 创建 OrbitControls 实例
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true;
        controls.zoomSpeed = 1;

        // 加载模型
        loader.load('models/scene.gltf', function (gltf) {
            model = gltf.scene;
            model.scale.set(1, 1, 1);
            scene.add(model);

            const boundingBox = new THREE.Box3().setFromObject(model);
            const center = boundingBox.getCenter(new THREE.Vector3());
            controls.target.copy(center);
            
            animate();
        }, undefined, function (error) {
            console.error(error);
        });

        // 动画循环
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }

        // 更新窗口大小时的处理
        window.addEventListener('resize', onWindowResize, false);
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }