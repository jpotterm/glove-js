var obj_mtl_loader = {};

!function() {
    function load(objText, mtlText, baseUrl) {
        var mtlLoader = new THREE.MTLLoader(baseUrl);
        var objLoader = new THREE.OBJMTLLoader();

        var materials = mtlLoader.parse(mtlText);
        materials.preload();

        var object = objLoader.parse(objText);

        object.traverse(function(object) {
            if (object instanceof THREE.Mesh && object.material.name) {
                var material = materials.create(object.material.name);
                if (material) {
                    object.material = material;
                }
            }
        });

        return object;
    }

    function ImageLoader(finishedStream) {
        this.finishedStream = finishedStream;
    }

    ImageLoader.prototype.load = function(url, onLoad) {
        var self = this;
        var texture = new THREE.Texture();
        var loader = new THREE.ImageLoader();

        loader.load(url, function(image) {
            texture.image = THREE.MTLLoader.ensurePowerOfTwo_(image);
            texture.needsUpdate = true;

            if (onLoad) onLoad(texture);
            self.finishedStream.onNext(texture);
        });

        return texture;
    }


    obj_mtl_loader.load = load;
    obj_mtl_loader.ImageLoader = ImageLoader;
}();
