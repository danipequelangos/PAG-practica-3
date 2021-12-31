//Variables de modelado
var scene, renderer, camera, model;
var textures = ["https://raw.githubusercontent.com/danipequelangos/PAG-practica-3/main/textures/brushed_brown_metal.txt",
                "https://raw.githubusercontent.com/danipequelangos/PAG-practica-3/main/textures/very_brushed_brown_metal.txt",
                "https://raw.githubusercontent.com/danipequelangos/PAG-practica-3/main/textures/scratched_scraped_metal.txt",
                "https://raw.githubusercontent.com/danipequelangos/PAG-practica-3/main/textures/red_plastic.txt",
                "https://raw.githubusercontent.com/danipequelangos/PAG-practica-3/main/textures/oiled_brown_metal.txt"];

//variables de controles
var controls;
var step = 0;
var key_up = false;
var key_down = false;
var key_left = false;
var key_right = false;
var key_camera_left = false;
var key_camera_right = false;

/**
 * Funcion de inicio del programa donde se crea el modelado de la escena y se añaden los
 * controladores de eventos
 **/
function init() {

    //Añado los controladores de eventos
    window.addEventListener('keydown', handleKeyDown, true)
    window.addEventListener('keyup', handleKeyUp, true)

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

    //Creo el render y le doy un tamaño ajustado a la ventana
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    //Creo un suelo para ver las sombras que genera el robot
    var planeGeometry = new THREE.PlaneGeometry(200, 200, 1, 1);
    var planeMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333, shininess:20
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0,0,0);
    plane.rotation.x-=Math.PI/2;
    plane.castShadow = true;
    plane.receiveShadow = true;
    scene.add(plane);

    //----- MODELADO DEL ROBOT -----
    model = new THREE.Object3D();
    scene.add(model);
    // creo la cabeza
    var headGroup = createHead();
    headGroup.position.set(0, 13, 0);

    // creo el cuerpo
    var bodyGroup = createBody();
    bodyGroup.position.set(0, 8, -2);

    // creo las piernas
    var rightLegGroup = createLeg("rightLeg");
    rightLegGroup.position.set(-2, 4, -2);

    var leftLegGroup = createLeg("leftLeg");
    leftLegGroup.position.set(2, 4, -2);
    leftLegGroup.rotation.y += Math.PI;

    // creo los pies
    var rightFootGroup = createFoot("rightFoot");
    rightFootGroup.position.set(0, -2.8, 0);
    rightLegGroup.add(rightFootGroup);

    var leftFootGroup = createFoot("leftFoot");
    leftFootGroup.position.set(0, -2.8, 0);
    leftLegGroup.add(leftFootGroup);

    // creo los brazos y las manos
    var rightArmGroup = createArm("rightArm");
    rightArmGroup.position.set(-4.2, 9.5, -2);
    rightArmGroup.rotation.x += 0.349066;
    rightArmGroup.rotation.z += -0.349066;

    var leftArmGroup = createArm("leftArm");
    leftArmGroup.position.set(4.2, 9.5, -2);
    leftArmGroup.rotation.x += 0.349066;
    leftArmGroup.rotation.z += 0.349066;

    var rightPostArmGroup = createPostArm("rightPostArm");
    rightPostArmGroup.position.set(0, -2.1, 0);
    rightArmGroup.add(rightPostArmGroup);

    var leftPostArmGroup = createPostArm("leftPostArm");
    leftPostArmGroup.position.set(0, -2.1, 0);
    leftArmGroup.add(leftPostArmGroup);

    // creo las manos
    var rightHandGroup = createRightHand();
    rightHandGroup.position.set(0, 0, 4.25);
    rightPostArmGroup.add(rightHandGroup);

    var leftHandGroup = createLeftHand();
    leftHandGroup.position.set(0, 0, 4.25);
    leftPostArmGroup.add(leftHandGroup);

    //Posiciono la camara y la apunto hacia el modelo
    camera.position.set(-30, 30, 60);
    camera.lookAt(model.position);

    //Creo una fuente de luz direccional encima del centro de la plataforma
    var spotLight = new THREE.DirectionalLight(0xffffff);
    spotLight.position.set(0, 70, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    //Controlo las variables del mapeado de sombras para que se vean en toda la escena
    spotLight.shadow.mapSize.width = 5120; // default
    spotLight.shadow.mapSize.height = 5120; // default
    spotLight.shadow.camera.near = 0.1; // default
    spotLight.shadow.camera.far = 500; // default
    spotLight.shadow.camera.top = -100 // default
    spotLight.shadow.camera.right = 100 // default
    spotLight.shadow.camera.left = -100 // default
    spotLight.shadow.camera.bottom = 100 // default

    //Doy luz ambiente
    var ambientLight = new THREE.AmbientLight( 0xffffff ); // soft white light
    scene.add(ambientLight);

    document.getElementById("contenedor").appendChild(renderer.domElement);

    createControls();

    renderer.render(scene, camera);
}
/**
 * Funcion que crea toda la agrupación de la cabeza
 **/
function createHead(){
    var headGroup = new THREE.Object3D();
    headGroup.name = "head";
    model.add(headGroup);

    var sphereHead = new THREE.SphereGeometry(3, 20, 20);
    var sphereMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xA19782,
        metalness: 0.3,
        roughness: 0.7,
        map: getTexture(textures[0])

    });
    var head = new THREE.Mesh(sphereHead, sphereMaterial);
    head.castShadow = true;
    headGroup.add(head);

    // añado los ojos
    var eyeCylinder = new THREE.CylinderGeometry(0.5, 0.5,0.2,20);
    var eyeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xF86C68,
        metalness: 0,
        roughness: 1,
        envMapIntensity: 0.9,
        transparent: true,
        opacity: 1,
        reflectivity: 0.2,
        map: getTexture(textures[3])
    });
    var leftEye = new THREE.Mesh(eyeCylinder, eyeMaterial);

    leftEye.position.set(-1.3, 0, 2.65);
    leftEye.rotation.x += 1.5708;
    leftEye.rotation.z += 0.383972;
    headGroup.add(leftEye);

    //Añado focos de luz a los ojos 
    var spotLightEye1 = new THREE.SpotLight(0xff0000);
    spotLightEye1.position.set(-1.3, 0, 2.45);
    spotLightEye1.target = leftEye;
    headGroup.add(spotLightEye1);
    spotLightEye1.castShadow = true;

    var rightEye = new THREE.Mesh(eyeCylinder, eyeMaterial);

    rightEye.position.set(1.3, 0, 2.65);
    rightEye.rotation.x += 1.5708;
    rightEye.rotation.z += -0.383972;
    headGroup.add(rightEye);

    var spotLightEye2 = new THREE.SpotLight(0xff0000);
    spotLightEye2.position.set(1.3, 0, 2.45);
    spotLightEye2.target = rightEye;
    headGroup.add(spotLightEye2);
    spotLightEye2.castShadow = true;

    return headGroup;
}

/**
 * Funcion para crear la agrupación del tronco del cuerpo
 **/
function createBody(){
    var bodyGroup = new THREE.Object3D();
    bodyGroup.name = "body";
    model.add(bodyGroup);

    var topBodySphere = new THREE.SphereGeometry(3.8, 20, 20);
    var bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xBDAC9A,
        metalness: 0.3,
        roughness: 0.7,
        map: getTexture(textures[1])
    });
    var topBody = new THREE.Mesh(topBodySphere, bodyMaterial);
    topBody.castShadow = true;

    topBody.position.set(0, 3, 0);
    bodyGroup.add(topBody);

    var middleBodyCylinder = new THREE.CylinderGeometry(3.8, 3.8, 5.5, 20);
    var middleBody = new THREE.Mesh(middleBodyCylinder, bodyMaterial);
    middleBody.castShadow = true;

    middleBody.position.set(0, 0, 0);
    bodyGroup.add(middleBody);

    var bottomBodySphere = new THREE.CylinderGeometry(3.8, 3.3, 1, 20);
    var bottomBody = new THREE.Mesh(bottomBodySphere, bodyMaterial);
    bottomBody.castShadow = true;

    bottomBody.position.set(0, -3.25, 0);
    bodyGroup.add(bottomBody);

    return bodyGroup;
}

/**
 * Funcion para crear la agrupación de una pierna, uso la misma funcion para
 * ambas piernas cambiando el nombre que se le asigna
 **/
function createLeg(name){
    var legGroup = new THREE.Object3D();
    legGroup.name = name;
    model.add(legGroup);

    var topLegCylinder = new THREE.CylinderGeometry(0.7, 0.7, 0.7, 20);
    var legMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x84786A,
        metalness: 0.3,
        roughness: 0.7,
        map: getTexture(textures[1])
    });
    var topLeg = new THREE.Mesh(topLegCylinder, legMaterial);
    topLeg.castShadow = true;

    topLeg.position.set(0, 0, 0);
    topLeg.rotation.x += 1.5708;
    topLeg.rotation.z += 1.5708;
    legGroup.add(topLeg);

    var legSquare = new THREE.BoxGeometry(0.7, 3, 1.2);
    var leg = new THREE.Mesh(legSquare, legMaterial);
    leg.castShadow = true;

    leg.position.set(0, -1.25, 0);
    legGroup.add(leg);

    var kneeCylinder = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 20);
    var kneeAnkleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xA18B73,
        metalness: 0.1,
        opacity: 1,
        map: getTexture(textures[4])
    });
    var knee = new THREE.Mesh(kneeCylinder, kneeAnkleMaterial);
    knee.castShadow = true;

    knee.position.set(0.3, 0, 0);
    knee.rotation.x += 1.5708;
    knee.rotation.z += 1.5708;
    legGroup.add(knee);

    return legGroup;

}

/**
 * Funcion para crear la agrupacion de un pie, uso la misma funcion
 * para ambos pies cambiando el nombre que se le asigna
 **/
function createFoot(name){
    var footGroup = new THREE.Object3D();
    footGroup.name = name;

    var ankleCylinder = new THREE.CylinderGeometry(0.75, 0.75, 0.8, 20);
    var kneeAnkleMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xA18B73,
        metalness: 0.1,
        opacity: 1,
        map: getTexture(textures[4])
    });
    var ankle = new THREE.Mesh(ankleCylinder, kneeAnkleMaterial);
    ankle.castShadow = true;

    ankle.position.set(0, 0, 0); 
    ankle.rotation.x += 1.5708;
    ankle.rotation.z += 1.5708;
    footGroup.add(ankle);

    var externFootSquare = new THREE.BoxGeometry(2, 0.5, 5.2);
    var feetMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x877057,
        metalness: 0.6,
        roughness: 0.9,
        map: getTexture(textures[2])
    });
    var externFoot = new THREE.Mesh(externFootSquare, feetMaterial);
    externFoot.castShadow = true;

    externFoot.position.set(-0.5, -0.7, 0);
    footGroup.add(externFoot);

    var interiorFootSquare = new THREE.BoxGeometry(1, 0.5, 1.65);
    var interiorFoot1 = new THREE.Mesh(interiorFootSquare, feetMaterial);
    interiorFoot1.castShadow = true;

    interiorFoot1.position.set(1, -0.7, -1.77);
    footGroup.add(interiorFoot1);

    var interiorFoot2 = new THREE.Mesh(interiorFootSquare, feetMaterial);
    interiorFoot2.castShadow = true;

    interiorFoot2.position.set(1, -0.7, 1.78);
    footGroup.add(interiorFoot2);

    return footGroup;
    
}

/**
 * Funcion para crear la agrupacion de un brazo, uso la misma funcion
 * para ambos brazos cambiando el nombre que se le asigna
 **/
function createArm(name){
    var armGroup = new THREE.Object3D();
    armGroup.name = name;
    model.add(armGroup);

    var forearmSquare = new THREE.BoxGeometry(0.7, 3.65, 1.2);
    var armMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x84786A,
        metalness: 0.4,
        roughness: 0.7,
        map: getTexture(textures[1])
    });
    var forearm = new THREE.Mesh(forearmSquare, armMaterial);
    forearm.castShadow = true;

    forearm.position.set(0, 0, 0); 
    armGroup.add(forearm);

    return armGroup;
}

/**
 * Funcion para crear la agrupacion de un postBrazo (parte posterior al codo),
 * uso la misma funcion para ambos cambiando el nombre que se le asigna
 **/
function createPostArm(name){
    var postArmGroup = new THREE.Object3D();
    postArmGroup.name = name;

    var elbowCylinder = new THREE.CylinderGeometry(0.8, 0.8, 1.15, 20);
    var elbowMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xA18B73,
        metalness: 0.1,
        opacity: 1,
        map: getTexture(textures[4])
    });
    var elbow = new THREE.Mesh(elbowCylinder, elbowMaterial);
    elbow.castShadow = true;

    elbow.position.set(0, 0, 0);
    elbow.rotation.z += 1.5708;
    postArmGroup.add(elbow);

    var supArmSquare = new THREE.BoxGeometry(0.9, 1.2, 1.3);
    var armMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x84786A,
        metalness: 0.4,
        roughness: 0.7,
        map: getTexture(textures[1])
    });
    var supArm = new THREE.Mesh(supArmSquare, armMaterial);
    supArm.castShadow = true;

    supArm.position.set(0, 0, 0.5);
    postArmGroup.add(supArm);

    var infArmCylinder = new THREE.CylinderGeometry(0.35, 0.35, 3, 20);
    var infArmMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x84786A,
        metalness: 0.7,
        roughness: 0.9,
        map: getTexture(textures[2])
    });
    var infArm = new THREE.Mesh(infArmCylinder, infArmMaterial);
    infArm.castShadow = true;

    infArm.position.set(0, 0, 2.2);
    infArm.rotation.x += 1.5708;
    postArmGroup.add(infArm);

    return postArmGroup
}

/**
 * Funcion para crear la mano derecha
 **/
function createRightHand(){
    var handGroup = new THREE.Object3D();
    handGroup.name = "rightHand";

    var handSquare = new THREE.BoxGeometry(1.2, 0.7, 1.5);
    var handMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x877057,
        metalness: 0.4,
        roughness: 0.9,
        map: getTexture(textures[0])
    });
    var hand = new THREE.Mesh(handSquare, handMaterial);
    hand.castShadow = true;

    hand.position.set(0, 0, 0); 
    hand.rotation.z += 1.5708;
    handGroup.add(hand);

    var fingerSquare = new THREE.BoxGeometry(0.2, 0.2, 1);
    var fingerMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x877057,
        metalness: 0.6,
        roughness: 0.9,
        map: getTexture(textures[2])
    });
    var thumb = new THREE.Mesh(fingerSquare, fingerMaterial);
    thumb.castShadow = true;

    thumb.position.set(0.65, 0.4, 0.25);
    thumb.rotation.y += 0.989931;
    handGroup.add(thumb);

    var finger1 = new THREE.Mesh(fingerSquare, fingerMaterial);
    finger1.castShadow = true;

    finger1.position.set(0.45, 0.2, 1);
    finger1.rotation.y += 0.698132;
    handGroup.add(finger1);

    var finger2 = new THREE.Mesh(fingerSquare, fingerMaterial);
    finger2.castShadow = true;

    finger2.position.set(0.35, -0.4, 1);
    finger2.rotation.y += 0.698132;
    handGroup.add(finger2);

    return handGroup;
}

/**
 * Funcion para crear la mano izquierda
 **/
function createLeftHand(){
    var handGroup = new THREE.Object3D();
    handGroup.name = "leftHand";

    var handSquare = new THREE.BoxGeometry(1.2, 0.7, 1.5);
    var handMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x877057,
        metalness: 0.4,
        roughness: 0.9,
        map: getTexture(textures[0])
    });
    var hand = new THREE.Mesh(handSquare, handMaterial);
    hand.castShadow = true;

    hand.position.set(0, 0, 0); 
    hand.rotation.z += 1.5708;
    handGroup.add(hand);

    var fingerSquare = new THREE.BoxGeometry(0.2, 0.2, 1);
    var fingerMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x877057,
        metalness: 0.6,
        roughness: 0.9,
        map: getTexture(textures[2])
    });
    var thumb = new THREE.Mesh(fingerSquare, fingerMaterial);
    thumb.castShadow = true;

    thumb.position.set(-0.65, 0.4, 0.25);
    thumb.rotation.y -= 0.989931;
    handGroup.add(thumb);

    var finger1 = new THREE.Mesh(fingerSquare, fingerMaterial);
    finger1.castShadow = true;

    finger1.position.set(-0.45, 0.2, 1);
    finger1.rotation.y -= 0.698132;
    handGroup.add(finger1);

    var finger2 = new THREE.Mesh(fingerSquare, fingerMaterial);
    finger2.castShadow = true;

    finger2.position.set(-0.35, -0.4, 1);
    finger2.rotation.y -= 0.698132;
    handGroup.add(finger2);

    return handGroup;
}

/**
 * Funcion que transforma una imagen alojada en mi pagina de github en formato base64
 * a un png para ser usada como textura. Recibe una de las urls guardadas en el array
 * de textures
 **/
function getTexture(url){
    var image = new Image();
    fetch(url).then(function(response) {
        return response.text().then(function(text){
            image.src = 'data:image/png;base64,'+text;
        })
    });
    var texture = new THREE.Texture();
    texture.image = image;
    image.onload = function() {
        texture.needsUpdate = true;
    };

    return texture;
}

/**
 * Funcion para crear los controles de movimiento de la camara con el raton
 **/
function createControls() {

    controls = new OrbitControls( camera, renderer.domElement );

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.5;

    controls.keys = [ 65, 83, 68 ];

}

/**
 * Funcion para pasar de grado a radianes
 **/
function degToRad(degrees) {
        return degrees * Math.PI / 180;
}

/**
 * Funcion de animacion que se ejecuta constantemente
 **/
function animate() {

    requestAnimationFrame( animate );
    controls.update();
    movementHandler();
    render();
}

/**
 * Controlador del movimiento del robot segun las teclas pulsadas
 **/
function movementHandler(){
    var head = scene.getObjectByName("head");
    var rightLeg = scene.getObjectByName("rightLeg");
    var leftLeg = scene.getObjectByName("leftLeg");
    step += 7;
    if(key_left){
        model.rotation.y += 0.04
    }
    if(key_right){
        model.rotation.y -= 0.04
    }
    if(key_up){
        var direction = new THREE.Vector3();
        model.getWorldDirection(direction);
        model.position.add(direction.multiplyScalar(1.0));
        //Hago animación de las piernas
        rightLeg.rotation.x = -Math.sin(degToRad(step));
        leftLeg.rotation.x = Math.sin(degToRad(step));
    }
    if(key_down){
        var direction = new THREE.Vector3();
        model.getWorldDirection(direction);
        model.position.add(direction.multiplyScalar(-1.0));
        //Hago animación de las piernas
        rightLeg.rotation.x = Math.sin(degToRad(step));
        leftLeg.rotation.x = -Math.sin(degToRad(step));
    }
    if(key_camera_left){
        if(head.rotation.y < 0.96)
            head.rotation.y += 0.04
    }
    if(key_camera_right){
        if(head.rotation.y > -0.96)
            head.rotation.y -=0.04
    }
}

/**
 * Controlador que guarda la tecla que esta siendo pulsada
 **/
function handleKeyDown(event)
    {
        if (event.keyCode == 65) 
            key_left = true;
        else if (event.keyCode == 87)
            key_up = true;
        else if (event.keyCode == 83)
            key_down = true;
        else if (event.keyCode == 68)
            key_right = true;
        else if (event.keyCode == 81)
            key_camera_left = true;
        else if (event.keyCode == 69)
            key_camera_right = true;
    }
/**
 * Controlador que registra si la tecla ya no esta siendo pulsada
 **/
function handleKeyUp(event)
    {
        if (event.keyCode == 65) 
            key_left = false;
        else if (event.keyCode == 87)
            key_up = false;
        else if (event.keyCode == 83)
            key_down = false;
        else if (event.keyCode == 68)
            key_right = false;
        else if (event.keyCode == 81)
            key_camera_left = false;
        else if (event.keyCode == 69)
            key_camera_right = false;
    }

/**
 * Render de la escena
 **/
function render() {
    renderer.render( scene, camera );
}


