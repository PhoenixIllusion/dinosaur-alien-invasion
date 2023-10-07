import { BackSide, BoxGeometry, CubeTextureLoader, Mesh, MeshBasicMaterial } from "three";

const BASE = "/assets/textures/skybox/";


const loader = new CubeTextureLoader();
loader.setCrossOrigin('anonymous');

const KIND = "graycloud";

const paths = ["rt","lf","ft","bk","up","dn"].map(x => `${BASE}${KIND}_${x}.jpg`); 

const textureCube = loader.load(paths);
var material = new MeshBasicMaterial( {
  color: 0xffffff,
  envMap: textureCube,
  side: BackSide
} );
var geometry = new BoxGeometry( 1, 1, 1 );
var cube = new Mesh( geometry, material );
cube.scale.set(50,50,50);


export { cube as SkyBox }; 