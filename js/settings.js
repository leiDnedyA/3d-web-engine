var fov, guiSensitivity;
const gui = new dat.GUI();

const guiParameters = {
	fov: 75, 
	sensitivity: 0.7
};

function guiInit(){
	fov = gui.add(guiParameters, 'fov').name('FOV');
	guiSensitivity =  gui.add(guiParameters, 'sensitivity').name('Sensitivity');
}