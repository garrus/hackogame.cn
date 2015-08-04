(function(){
    var ID = {
        metalMine: 1,
        crystalMine: 2,
        deuteriumMine: 3,
        solarPlant: 4,
        nuclearPlant: 12,
        robot: 14,
        nano: 15,
        warfactory: 21,
        lab: 31,
        metalCap: 22,
        crystalCap: 23,
        deuteriumCap: 24,
        secretCap: 25,

        tech: {
            space: 106,
            computing: 108,
            weapon: 109,
            shield: 110,
            armor: 111,
            energy: 113,
            hyperSpace: 114,
            burningEngine: 115,
            impulseEngine: 117,
            hyperSpaceEngine: 118,
            laser: 120,
            neutron: 121,
            ion: 122,
            crossGalaxyResearch: 123,
            astrophysics: 124,
            gravity: 199
        }
    };
	
	console.log("Hack.js Loaded!");

    setInterval(loop, 3000);
	var i = 0;
    function loop(){
        upgradeBase();
		//upgradeTech();
		//updateMilitaryTech();
		i++;
		if (i%11 == 0) {
			if (i%2 == 1) {
				$("#overview").click();
			} else {
				$("#station").click();
			}
		}
    }

    function upgradeBase(){

        if (isBuilding()) {
            return false;
        }

        if (isEnergyNegative()) {
            //return build(ID.solarPlant) || build(ID.nuclearPlant)
        }

		if (build(ID.nano) || (levelOf(ID.robot) < 10 && build(ID.robot))) {
            return true;
        }
		
        var storageShortage = getStorageShortage();
        if (storageShortage) {
            return build(storageShortage) || build(ID.secretCap);
        }

        if (levelOf(ID.metalMine) - levelOf(ID.crystalMine) < 2) {
            return build(ID.metalMine);
        }

        if (levelOf(ID.crystalMine) - levelOf(ID.deuteriumMine) < 2) {
            return build(ID.crystalMine);
        }

        if (levelOf(ID.metalMine) - levelOf(ID.deuteriumMine) > 5) {
            return build(ID.deuteriumMine);
        }

        var r = Math.floor(Math.random() * 5);
        switch (r) {
            case 0:
                return build(ID.metalMine);
            case 1:
                return build(ID.crystalMine);
            case 2:
                return build(ID.deuteriumMine);
            case 3:
                return build(ID.lab);
            case 4:
                return build(ID.warfactory);
            default:
                return false;
        }

    }
	
	function updateMilitaryTech(){
		if (isResearching()) return false;
		var r = Math.random();
        return (r < 0.33333 && build(ID.tech.weapon))
			|| (r > 0.66666 && build(ID.tech.shield))
            || build(ID.tech.armor);
	}
	

    function upgradeTech(){
		
		//if (build(ID.tech.energy)) return true;

        if (isResearching()) return false;

        return Math.random() < 0.5
            && (build(ID.tech.gravity)
            || build(ID.tech.crossGalaxyResearch)
            || build(ID.tech.astrophysics)
            || build(ID.tech.hyperSpaceEngine)
            || build(ID.tech.impulseEngine)
            || build(ID.tech.burningEngine)
            || build(ID.tech.hyperSpace)
            || build(ID.tech.ion)
            || build(ID.tech.neutron)
            || build(ID.tech.laser)
            || build(ID.tech.space)
            || build(ID.tech.computing)
            || build(ID.tech.weapon)
            || build(ID.tech.shield)
            || build(ID.tech.armor)
            );
    }



    function levelOf(id){
        return parseInt($("#building-count-" + id).text());
    }

    function build(id){
        var $btn = $("#building-fast-" + id);
        if (!$btn.hasClass("hidden")) {
            $btn.trigger("click");
            console.debug((new Date()) + "> Attempted to build " + reverseLookup(id));
            return true;
        }
        return false;
    }

    function reverseLookup(id){
        var name;
        for (name in ID.tech) {
            if (ID.tech.hasOwnProperty(name)) {
                if (ID.tech[name] == id) {
                    return "tech#" + name;
                }
            }
        }
        for (name in ID) {
            if (ID.hasOwnProperty(name)) {
                if (ID[name] == id) {
                    return "building#" + name;
                }
            }
        }

        console.trace((new Date()) + "> unknown ID");
        return "Unknown#" + id;
    }

    function isEnergyNegative(){
        return parseInt($("#resource-energy-amount").text()) <= 0;
    }

    function getStorageShortage(){
        var metal = $("#resource-metal-amount");
        var crystal = $("#resource-crystal-amount");
        var deuterium = $("#resource-deuterium-amount");

        if (metal.attr("class") !== "") {
            return ID.metalCap;
        }
        if (crystal.attr("class") !== "") {
            return ID.crystalCap;
        }
        if (deuterium.attr("class") !== "") {
            return ID.deuteriumCap;
        }
    }

    function isBuilding(){
        return $("#station-div").find(".building-timer[status=1]").length != 0;
    }

    function isResearching(){
        return $("#research-div").find(".building-timer[status=1]").length != 0;
    }

})();