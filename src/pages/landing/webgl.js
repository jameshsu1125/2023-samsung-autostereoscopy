/* eslint-disable class-methods-use-this */
import EnterFrame from 'lesca-enterframe';
import * as THREE from 'three';
import dat from 'dat.gui';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import wood0 from './material/wood.jpg';
import wood1 from './material/2145.jpg';
import mtl from './cat/12221_Cat_v1_l3.mtl';
import obj from './cat/12221_Cat_v1_l3.obj';

const angle = { azimuthal: 0, polar: 0 };
const size = {
	width: 18.922,
	height: 10.819,
	depth: 6,
	weight: 10,
	catSize: 0.08,
};

export default class canvas3D {
	constructor(webgl) {
		this.webgl = webgl;
		this.mat0 = null;
		this.mat1 = null;
		this.cat = null;

		this.build();
		this.render();
	}

	gui() {
		const { camera, controls } = this.webgl;

		const gui = new dat.GUI({ name: 'My GUI' });
		const cameraFolder = gui.addFolder('Camera');

		const { center } = controls.controls;

		cameraFolder.add(center, 'y', -10, 10);
		cameraFolder.add(center, 'x', -10, 10);
		cameraFolder.add(camera, 'fov', 3, 100).onChange(() => {
			camera.updateProjectionMatrix();
		});
		cameraFolder.add(angle, 'azimuthal', -45, 45).onChange((v) => {
			controls.controls.setAzimuthalAngle((Math.PI / 180) * v);
		});

		cameraFolder.add(angle, 'polar', -45, 45).onChange((v) => {
			controls.controls.setPolarAngle((Math.PI / 180) * (90 + v));
		});

		const catFolder = gui.addFolder('fake cat');
		const { position: pos } = this.cat;
		catFolder.add(pos, 'y', -4.2, 10);
		catFolder.add(pos, 'z', -10, 20);
	}

	build() {
		const { scene } = this.webgl;

		this.loadMaterials().then(() => {
			const scale = 0.8;
			const depth = size.depth * scale;
			const width = size.width * scale;
			const height = size.height * scale;
			const weight = size.weight * scale;
			const catSize = size.catSize * scale;

			const group = new THREE.Group();

			const back = new THREE.Mesh(new THREE.PlaneGeometry(width, height), this.mat0);
			back.position.z = -depth;
			back.receiveShadow = true;
			// back.castShadow = true;
			group.add(back);

			const top = new THREE.Mesh(new THREE.BoxGeometry(width, weight, depth), this.mat1);
			top.position.y = (height + weight) * 0.5;
			top.position.z = -depth * 0.5;
			top.receiveShadow = true;
			// top.castShadow = true;
			group.add(top);

			const bottom = new THREE.Mesh(new THREE.BoxGeometry(width, weight, depth), this.mat1);
			bottom.position.y = 0 - (height + weight) * 0.5;
			bottom.position.z = -depth * 0.5;
			bottom.receiveShadow = true;
			group.add(bottom);

			const left = new THREE.Mesh(
				new THREE.BoxGeometry(weight, height + weight * 2, depth),
				this.mat1,
			);
			left.position.x = 0 - (width + weight) * 0.5;
			left.position.z = 0 - depth * 0.5;
			left.receiveShadow = true;
			// left.castShadow = true;
			group.add(left);

			const right = new THREE.Mesh(
				new THREE.BoxGeometry(weight, height + weight * 2, depth),
				this.mat1,
			);
			right.position.x = (width + weight) * 0.5;
			right.position.z = 0 - depth * 0.5;
			right.receiveShadow = true;
			// right.castShadow = true;
			group.add(right);

			group.add(this.cat);
			this.cat.scale.set(catSize, catSize, catSize);
			this.cat.castShadow = true;
			this.cat.rotation.x = (Math.PI / 180) * -90;
			this.cat.rotation.z = (Math.PI / 180) * 30;
			this.cat.position.y = -4.2;
			this.cat.position.z = -2;
			this.cat.castShadow = true;
			this.cat.receiveShadow = true;
			this.cat.traverse((child) => {
				const mesh = child;
				if (mesh.isMesh) mesh.castShadow = true;
			});

			// group.position.z = -depth * 0.5;
			scene.add(group);

			this.gui();
		});
	}

	loadMaterials() {
		return new Promise((resolve, reject) => {
			const loader = new THREE.TextureLoader();
			loader.load(
				wood0,
				(texture) => {
					this.mat0 = new THREE.MeshLambertMaterial({
						map: texture,
						side: THREE.DoubleSide,
					});
					loader.load(
						wood1,
						(tx) => {
							this.mat1 = new THREE.MeshLambertMaterial({
								map: tx,
								side: THREE.DoubleSide,
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
			stats.end();
		});
	}
}
