import { createContext } from 'react';

export const LandingSteps = { unset: 0 };
export const LandingState = { steps: LandingSteps.unset };
export const LandingContext = createContext(LandingState);

export const config = {
	camera: { fov: 25, far: 500 },
	sky: {
		enabled: true,
	},
	controls: {
		distance: { min: 25, max: 25 },
		// polar: { min: 0, max: 0 },
		// azimuth: { min: 0, max: 0 },
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
			intensity: 0.6,
		},
		spot: {
			color: 0xffffff,
			intensity: 0.3,
			far: 100,
			position: { x: -3, y: 6, z: 2 },
		},
		shadowMapSize: 256,
		debug: true,
	},
	stats: false,
};
