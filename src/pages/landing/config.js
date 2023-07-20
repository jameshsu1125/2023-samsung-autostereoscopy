import { createContext } from 'react';

export const LandingSteps = { unset: 0 };
export const LandingState = { steps: LandingSteps.unset };
export const LandingContext = createContext(LandingState);

export const config = {
	camera: { fov: 50, far: 500 },
	sky: {
		enabled: true,
	},
	controls: {
		distance: { min: 7, max: 50 },
		polar: { min: -70, max: 70 },
		azimuth: { min: -Infinity, max: Infinity },
		default: {
			polar: 0,
			azimuth: 0,
		},
	},
	light: {
		ambient: {
			color: 0xffffff,
			intensity: 1,
		},
		spot: {
			color: 0xffffff,
			intensity: 1,
			far: 100,
			position: { x: 0, y: 3, z: 0 },
		},
		shadowMapSize: 256,
		debug: true,
	},
	stats: true,
};
