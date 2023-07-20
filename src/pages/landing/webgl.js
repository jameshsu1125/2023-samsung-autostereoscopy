/* eslint-disable no-multi-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import EnterFrame from 'lesca-enterframe';
import * as THREE from 'three';
import dat from 'dat.gui';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import woodFront from './material/wood-front.jpg';
import alpha from './material/wood-front-alpha.png';
import woodBack from './material/2145.jpg';
import woodSide from './material/wood.jpg';
import woodSide2 from './material/wood2.jpg';
import woodBottom from './material/wood3.jpg';
import mtl from './cat/12221_Cat_v1_l3.mtl';
import obj from './cat/12221_Cat_v1_l3.obj';
import { config } from './config';

const size = {
	width: 18.922,
	height: 10.819,
	depth: 6,
	weight: 0.1,
	// catSize: 0.09,
	catSize: 0.2,
	frontWidth: 30,
	frontHeight: 18.75,
};

const cameraSetting = { fov: config.camera.fov, distance: config.controls.distance.max };

export default class canvas3D {
	constructor(webgl) {
		this.webgl = webgl;
		this.woodFront = null;
		this.woodBack = null;
		this.woodSide = null;
		this.woodTop = null;
		this.woodBottom = null;
		this.cat = null;
		this.catGroup = null;
		this.box = null;
		this.rotation = -20;

		this.build();
		this.render();
	}

	gui() {
		const { camera, renderer, controls } = this.webgl;
		renderer.renderer.localClippingEnabled = true;

		const gui = new dat.GUI({ name: 'My GUI' });
		gui.close();

		const cameraGUI = gui.addFolder('camera');
		cameraGUI.add(cameraSetting, 'fov', 18, 100).onChange((v) => {
			camera.fov = v;
			camera.updateProjectionMatrix();
		});
		cameraGUI.add(cameraSetting, 'distance', 0, 30).onChange((v) => {
			controls.controls.minDistance = v;
			controls.controls.maxDistance = v;
		});

		const boxPosition = gui.addFolder('position');
		boxPosition.add(this.box.position, 'y', -5, 5);

		const boxRotation = gui.addFolder('rotation');
		boxRotation.add(this, 'rotation', -30, 30).onChange((v) => {
			this.catGroup.rotation.x = (Math.PI / 180) * v;
			this.box.rotation.x = (Math.PI / 180) * v;
		});

		const catFolder = gui.addFolder('cat');
		const { position: pos } = this.catGroup;
		catFolder.add(pos, 'y', -10, 10);
		catFolder.add(pos, 'z', -10, 20);
	}

	build() {
		const { scene } = this.webgl;
		this.loadMaterials().then(() => {
			const scale = 0.8;
			const depth = size.depth * scale;
			const width = size.width * scale;
			const height = size.height * scale;
			const catSize = size.catSize * scale;

			const front = new THREE.Mesh(
				new THREE.PlaneGeometry(size.frontWidth * scale, size.frontHeight * scale),
				this.woodFront,
			);
			scene.add(front);

			const group = new THREE.Group();
			const materials = [
				this.woodSide,
				this.woodSide,
				this.woodTop,
				this.woodBottom,
				this.woodBack,
				this.woodBack,
			];
			const box = new THREE.Mesh(
				new THREE.BoxGeometry(width + 0.1, height + 0.1, depth * 2),
				materials,
			);
			box.receiveShadow = true;
			box.castShadow = true;
			box.rotation.x = (Math.PI / 180) * this.rotation;
			box.position.y = -0.08;
			group.add(box);

			this.box = box;

			this.cat.scale.set(catSize, catSize, catSize);
			this.cat.rotation.x = (Math.PI / 180) * -90;
			this.cat.rotation.z = (Math.PI / 180) * 30;
			this.cat.position.y = -4.3;
			this.cat.position.z = -2;
			this.cat.traverse((child) => {
				const mesh = child;
				if (mesh.isMesh) {
					mesh.castShadow = true;
					mesh.receiveShadow = true;
				}
			});

			this.catGroup = new THREE.Group();
			this.catGroup.add(this.cat);
			this.catGroup.rotation.x = (Math.PI / 180) * this.rotation;
			group.add(this.catGroup);
			group.position.z = -0.0001;

			scene.add(group);

			this.gui();
		});
	}

	loadMaterials() {
		const localPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0);
		return new Promise((resolve, reject) => {
			const loader = new THREE.TextureLoader();
			loader.load(
				woodFront,
				(texture) => {
					loader.load(
						alpha,
						(tx) => {
							texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
							texture.offset.set(0, 0);
							texture.repeat.set(1.2, 1.2);

							this.woodFront = new THREE.MeshBasicMaterial({
								alphaMap: tx,
								side: THREE.DoubleSide,
								map: texture,
								transparent: true,
							});
							loader.load(woodBack, (tx2) => {
								this.woodBack = new THREE.MeshLambertMaterial({
									map: tx2,
									side: THREE.DoubleSide,
									clippingPlanes: [localPlane],
									clipShadows: true,
								});

								loader.load(woodSide, (tx3) => {
									this.woodSide = new THREE.MeshLambertMaterial({
										map: tx3,
										side: THREE.DoubleSide,
										clippingPlanes: [localPlane],
										clipShadows: true,
									});

									loader.load(woodSide2, (tx4) => {
										this.woodTop = new THREE.MeshLambertMaterial({
											map: tx4,
											side: THREE.DoubleSide,
											clippingPlanes: [localPlane],
											clipShadows: true,
										});

										loader.load(woodBottom, (tx5) => {
											tx5.wrapS = texture.wrapT = THREE.RepeatWrapping;
											tx5.offset.set(0.1, 0);
											tx5.repeat.set(0.8, 0.8);
											this.woodBottom = new THREE.MeshLambertMaterial({
												map: tx5,
												side: THREE.DoubleSide,
												clippingPlanes: [localPlane],
												clipShadows: true,
											});
											const mtlLoader = new MTLLoader();
											mtlLoader.load(mtl, (materials) => {
												materials.preload();
												const objLoader = new OBJLoader();
												objLoader.setMaterials(materials);
												objLoader.load(obj, (object) => {
													this.cat = object;
													resolve();
												});
											});
										});
									});
								});
							});
						},
						undefined,
						() => reject(),
					);
				},
				undefined,
				() => reject(),
			);
		});
	}

	render() {
		const { stats } = this.webgl;
		EnterFrame.add(() => {
			stats?.end();
		});
	}
}
