// priority: 10

const FACTION_MAP = {
    "stargazers": [
        // AE2 & Addons
        "ae2", "enderdrives", "rep_ae2", "extendedae", "ae2ct", 
        "ae2networkanalyzer", "ae2importexportcard", "appmek",
        // Mekanism & Addons
        "mekanism", "mekanismgenerators", "mekanismadditions", "mekanismtools",
        "more_mekanism_processing", "mekanism_unleashed", "mekanism_weapons", 
        "mekanism_curios", "jem", "mekanismextras",
        // Tech Extras
        "powah", "justdirethings", "mffs"
    ],
    "mechanists": [
        // Create & Addons
        "create", "create_stock_bridge", "create_enchantment_industry", 
        "create_dragons_plus", "create_pattern_schematics",
        // Industrialization & Misc
        "modern_industrialization", "industrialization_overdrive", "mi_sound_addon",
        "pneumaticcraft", "replication", "reliquary"
    ],
    "science_shared": [
        "rftoolsbase", "rftoolscontrol", "rftoolsstorage", "rftoolsutility", 
        "rftoolsbuilder", "tempad"
    ],
    "spellcasters": [
        // Ars Nouveau & Addons
        "ars_nouveau", "ars_elemental", "ars_controle", "notenoughglyphs", 
        "ars_energistique", "ars_ocultas", "ars_creo", "reliquified_ars", 
        "ars_additions", "arsdelight", "ars_elemancy", "ars_unification", 
        "hazen_n_stuff",
        // Iron's Spells & Addons
        "irons_spellbooks", "gtbcs_spell_lib", "aces_spell_utils"
    ],
    "ritualists": [
        // Apotheosis & Apothic Mods
        "apotheosis", "apothic_enchanting", "attributeslib", "apothic_spawners", 
        "extra_apoth_compat", "irons_apothic", "irons_apothic_invaders",
        // Magic & Dimensions
        "occultism", "twilightforest", "eternal_starlight", "gateways",
        // Cataclysm & Addons
        "lendercataclysm", "cataclysm_spellbooks", "reliquified_cataclysm", 
        "lootintegrations_cataclysm",
        // Dimension Addons
        "reliquified_twilight", "twilightdelight", "twilight_treehouses"
    ],
    "magic_shared": [
        "waystones", "relics", "artifacts", "irons_gems_n_jewelry"
    ]
}

Object.keys(FACTION_MAP).forEach(stageName => {
    let modIdList = FACTION_MAP[stageName]
    
    modIdList.forEach(modId => {
        // Parameters: (Unique ID, Stage Name, Mod ID)
        AStages.addRestrictionForModRecipe(`recipe_gate/${modId}`, stageName, modId)
    })
})