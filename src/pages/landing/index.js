/* eslint-disable new-cap */
import Webgl from 'lesca-webgl-threejs';
import { memo, useEffect, useRef, useState } from 'react';
import { LandingContext, LandingSteps, config } from './config';
import canvas3D from './webgl';

const Landing = memo(() => {
	const ref = useRef();
	const value = useState(LandingSteps);

	useEffect(() => {
		const webgl = new Webgl(config);
		ref.current.appendChild(webgl.render.domElement);
		new canvas3D(webgl);
	}, []);

	return (
		<LandingContext.Provider value={value}>
			<div ref={ref} className='Landing' />
		</LandingContext.Provider>
	);
});
export default Landing;
