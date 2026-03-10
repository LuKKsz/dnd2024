console.log("DND2024 | Loading Global Mechanics");

Hooks.on("init", () => {
    // We defer the wrapper until 'ready' or just run it in 'init' if we are sure Actor is ready.
    // getRollData is safe to wrap in init if CONFIG.Actor.documentClass is set.

    // Safely get the class
    const ActorClass = CONFIG.Actor.documentClass;

    // Check if getRollData exists on the prototype
    if (!ActorClass.prototype.getRollData) {
        console.warn("DND2024 | getRollData not found on Actor class. Global mechanics disabled.");
        return;
    }

    const originalGetRollData = ActorClass.prototype.getRollData;

    ActorClass.prototype.getRollData = function (...args) {
        // Get the original roll data (which includes @details.level, @abilities, etc.)
        const data = originalGetRollData.apply(this, args);

        try {
            // Calculate our bonus
            // We can read directly from the 'data' returned, as it likely contains 'details' already
            // OR read from 'this.system'

            const system = this.system;
            // Check for valid system data
            if (!system || !system.details) return data;

            let levelValue = 0;
            if (this.type === "character") {
                levelValue = system.details.level || 0;
            } else if (this.type === "npc") {
                levelValue = system.details.cr || 0;
            }

            const halfBonus = Math.floor(levelValue / 2);
            const thirdBonus = Math.floor(levelValue / 3);
            const quarterBonus = Math.floor(levelValue / 4);
            const fifthBonus = Math.floor(levelValue / 5);
            const halfProf = Math.floor((system.attributes?.prof || 0) / 2);

            // Inject into the returned data object
            if (!data.scale) data.scale = {};
            data.scale.half = halfBonus;
            data.scale.third = thirdBonus;
            data.scale.quarter = quarterBonus;
            data.scale.fifth = fifthBonus;
            data.scale.halfProf = halfProf;

            // Should usually be available as @scale.half

        } catch (e) {
            console.error("DND2024 | Error in getRollData wrapper:", e);
        }

        return data;
    };
});
