var fov, guiSensitivity;
const gui = new dat.GUI();

const guiParameters = {
	fov: 75, 
	sensitivity: 0.7
};

function guiInit(){
	fov = gui.add(guiParameters, 'fov').name('FOV');
	guiSensitivity =  gui.add(guiParameters, 'sensitivity').name('Sensitivity');
	fov.min(30);
	fov.max(150);
	guiSensitivity.min(.1);
	guiSensitivity.max(1.5);

}

function updateInit(){

	sensitivity = guiParameters.sensitivity;
	camera.fov = guiParameters.fov;
	camera.updateProjectionMatrix();
}