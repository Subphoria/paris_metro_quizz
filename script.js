let lignesData = [];
let stationsData = [];
let currentMode = 'lignes';
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let gameHistory = [];

// Dictionnaire corrigé avec les noms exacts de tes fichiers locaux
const fileMap = {
    "M_1": "Paris_transit_icons_-_Métro_1.svg",
    "M_2": "Paris_transit_icons_-_Métro_2.svg",
    "M_3": "Paris_transit_icons_-_Métro_3.svg",
    "M_3bis": "Paris_transit_icons_-_Métro_3bis.svg",
    "M_4": "Paris_transit_icons_-_Métro_4.svg",
    "M_5": "Paris_transit_icons_-_Métro_5.svg",
    "M_6": "Paris_transit_icons_-_Métro_6.svg",
    "M_7": "Paris_transit_icons_-_Métro_7.svg",
    "M_7bis": "Paris_transit_icons_-_Métro_7bis.svg",
    "M_8": "Paris_transit_icons_-_Métro_8.svg",
    "M_9": "Paris_transit_icons_-_Métro_9.svg",
    "M_10": "Paris_transit_icons_-_Métro_10.svg",
    "M_11": "Paris_transit_icons_-_Métro_11.svg",
    "M_12": "Paris_transit_icons_-_Métro_12.svg",
    "M_13": "Paris_transit_icons_-_Métro_13.svg",
    "M_14": "Paris_transit_icons_-_Métro_14.svg",
    "RER_A": "Paris_transit_icons_-_RER_A.svg",
    "RER_B": "Paris_transit_icons_-_RER_B.svg",
    "RER_C": "Paris_transit_icons_-_RER_C.svg",
    "RER_D": "Paris_transit_icons_-_RER_D.svg",
    "RER_E": "Paris_transit_icons_-_RER_E.svg",
    "T_1": "Paris_transit_icons_-_Tram_1.svg",
    "T_2": "Paris_transit_icons_-_Tram_2.svg",
    "T_3a": "Paris_transit_icons_-_Tram_3a.svg",
    "T_3b": "Paris_transit_icons_-_Tram_3b.svg",
    "T_4": "Paris_transit_icons_-_Tram_4.svg",
    "T_5": "Paris_transit_icons_-_Tram_5.svg",
    "T_6": "Paris_transit_icons_-_Tram_6.svg",
    "T_7": "Paris_transit_icons_-_Tram_7.svg",
    "T_8": "Paris_transit_icons_-_Tram_8.svg",
    "T_9": "Paris_transit_icons_-_Tram_9.svg",
    "T_10": "Paris_transit_icons_-_Tram_10.svg",
    "T_11": "Paris_transit_icons_-_Tram_11.svg",
    "T_12": "Paris_transit_icons_-_Tram_12.svg",
    "T_13": "Paris_transit_icons_-_Tram_13.svg",
    "T_14": "Paris_transit_icons_-_Tram_14.svg"
};

// Fonction corrigée : le lien vers le fichier local doit utiliser le chemin exact
function getLogoHTML(val, type, isLarge = false) {
    val = val.toString().trim();
    let key = `${type}_${val}`;
    let sizeClass = isLarge ? 'logo-large' : 'logo-small';
    
    if (fileMap[key]) {
        // On ne change pas le nom de fichier ici pour être sûr qu'il corresponde au système de fichiers Windows/Mac
        let url = `liste_logos_lignes/${fileMap[key]}`;
        return `<img src="${url}" class="transit-logo ${sizeClass}" alt="Ligne ${val}" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';" /><span style="display:none; font-weight:bold;">${type} ${val}</span>`;
    } else {
        return `<span style="font-weight:bold;">${type} ${val}</span>`;
    }
}

// ... (le reste du code script.js reste identique à ma précédente réponse)
