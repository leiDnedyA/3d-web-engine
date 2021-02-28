const gui= dat.GUI();
var fov, sensitivity;


const guiParameters = {
	fov: 75, 
	sensitivity: 0.7
};

function guiInit(){
	fov = gui.add(guiParameters, 'fov').name('FOV');
	sensitivity =  gui.add(guiParameters, 'sensitivity').name('Sensitivity');
}