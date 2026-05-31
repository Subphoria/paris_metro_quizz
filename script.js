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

let allTerminus = [];
let allMetroLines = ["1", "2", "3", "3bis", "4", "5", "6", "7", "7bis", "8", "9", "10", "11", "12", "13", "14"];
let allRerTram = [];
let allArrondissements = [];
for (let i = 1; i <= 20; i++) { allArrondissements.push(`Paris ${i}${i===1?'er':'e'}`); }
allArrondissements.push("Hors Intramuros");

function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if(lines.length === 0) return [];
    const headers = lines[0].split(';').map(h => h.trim().replace(/^"|"$/g, ''));
    const results = [];
    for (let i = 1; i < lines.length; i++) {
        let rowStr = lines[i].trim();
        if (!rowStr) continue;
        const row = rowStr.split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
        let obj = {};
        headers.forEach((header, index) => { obj[header] = row[index] || ""; });
        results.push(obj);
    }
    return results;
}

function normalizeTerminusList(termStr) {
    if (!termStr) return [];
    return termStr.split(',').map(t => t.trim()).filter(t => t);
}

function normalizeArrondissements(arrStr) {
    if (!arrStr) return ["Hors Intramuros"];
    const lower = arrStr.toLowerCase();
    if (lower.includes("hors intra-muros") || lower.includes("hors intramuros")) {
        let parts = arrStr.split(',');
        let result = [];
        parts.forEach(p => {
            if (p.toLowerCase().includes("hors") && p.toLowerCase().includes("muros")) { result.push("Hors Intramuros"); } 
            else { result.push(p.trim()); }
        });
        return [...new Set(result)].filter(a => a);
    }
    return arrStr.split(',').map(a => a.trim()).filter(a => a);
}

function buildGlobalLists() {
    let terminusSet = new Set();
    lignesData.forEach(l => { normalizeTerminusList(l.terminus).forEach(t => terminusSet.add(t)); });
    allTerminus = Array.from(terminusSet).sort();

    let rerTramSet = new Set();
    stationsData.forEach(s => {
        let items = (s['RER / Tram'] || "").split(',').map(i => i.trim()).filter(i => i);
        items.forEach(i => rerTramSet.add(i));
    });
    allRerTram = Array.from(rerTramSet).sort();
    allRerTram.push("aucunes");
}

async function loadData() {
    try {
        const resLignes = await fetch('lignes_metro_paris.csv');
        const textLignes = await resLignes.text();
        lignesData = parseCSV(textLignes);
        
        const resStations = await fetch('stations_metro_paris.csv');
        const textStations = await resStations.text();
        stationsData = parseCSV(textStations);
        
        buildGlobalLists();
    } catch (error) {
        alert("Attention : Impossible de lire les CSV. Assure-toi de bien utiliser Live Server dans ton éditeur !");
    }
}

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

function parseRerTramLogo(val) {
    if(val.toLowerCase() === 'aucunes') return "Aucunes";
    let v = val.trim();
    if (v.toUpperCase().startsWith('RER ')) return getLogoHTML(v.substring(4).trim(), 'RER');
    if (v.toUpperCase().startsWith('TRAM T')) return getLogoHTML(v.substring(6).trim(), 'T');
    if (/^[A-E]$/i.test(v)) return getLogoHTML(v.toUpperCase(), 'RER');
    if (/^T/i.test(v)) return getLogoHTML(v.substring(1), 'T');
    return val;
}

function generateLignesQuestions(num = 5) {
    const qs = [];
    const availableLignes = [...lignesData];
    for(let i=0; i<num; i++) {
        if(availableLignes.length === 0) break;
        const randIndex = Math.floor(Math.random() * availableLignes.length);
        const ligne = availableLignes.splice(randIndex, 1)[0];
        
        const entityHTML = getLogoHTML(ligne.Ligne, 'M', true);
        const qType = Math.floor(Math.random() * 5);
        let questionText, correctAnswers, options, isMultiple = false, optType = 'text';
        
        if (qType === 0) {
            questionText = `Quelle est la couleur de cette ligne ?`;
            let c = (ligne.Couleur || "").toLowerCase().trim();
            correctAnswers = [c === "" ? "non définie" : c];
            options = ["jaune", "bleue", "violette", "verte", "non définie"];
        } else if (qType === 1) { 
            questionText = `Cochez les terminus de cette ligne :`;
            correctAnswers = normalizeTerminusList(ligne.terminus);
            options = [...allTerminus]; isMultiple = true;
        } else if (qType === 2) { 
            questionText = `Cette ligne possède-t-elle des embranchements ?`;
            let val = (ligne.embranchements || "non").toLowerCase();
            correctAnswers = [val === "oui" ? "oui" : "non"]; options = ["oui", "non"];
        } else if (qType === 3) { 
            questionText = `Quel est le type de rames pour cette ligne ?`;
            let val = (ligne['type de rames'] || "").toLowerCase();
            correctAnswers = [val === "pneu" ? "MP (Roulement sur pneu)" : "MF (Roulements sur rail en fer)"];
            options = ["MP (Roulement sur pneu)", "MF (Roulements sur rail en fer)"];
        } else { 
            questionText = `Cette ligne est-elle automatique ?`;
            let val = (ligne.automatique || "non").toLowerCase();
            correctAnswers = [val === "oui" ? "oui" : "non"]; options = ["oui", "non"];
        }
        qs.push({ entityHTML, questionText, options, correctAnswers, isMultiple, optType });
    }
    return qs;
}

function generateStationsQuestions(num = 5) {
    const qs = [];
    const availableStations = [...stationsData];
    for(let i=0; i<num; i++) {
        if(availableStations.length === 0) break;
        const randIndex = Math.floor(Math.random() * availableStations.length);
        const station = availableStations.splice(randIndex, 1)[0];
        
        const entityHTML = `<h1 class="station-title">${station.Station}</h1>`;
        const qType = Math.floor(Math.random() * 5);
        let questionText, correctAnswers, options, isMultiple = false, optType = 'text';
        
        if (qType === 0) {
            questionText = `Quelles lignes de métro passent par cette station ?`;
            correctAnswers = (station['Lignes de métro']||"").split(',').map(l=>l.trim()).filter(l=>l);
            options = [...allMetroLines]; isMultiple = true; optType = 'metro';
        } else if (qType === 1) {
            questionText = `Quelles lignes de RER/Tram passent par cette station ?`;
            let rawLines = (station['RER / Tram']||"").split(',').map(l=>l.trim()).filter(l=>l);
            correctAnswers = rawLines.length > 0 ? rawLines : ["aucunes"];
            options = [...allRerTram]; isMultiple = true; optType = 'rer_tram';
        } else if (qType === 2) { 
            questionText = `Quelle est la situation de cette station ?`;
            let sitStr = (station['Situation'] || "").toLowerCase();
            correctAnswers = [];
            if(sitStr.includes("souterraine")) correctAnswers.push("Souterraine");
            if(sitStr.includes("aérienne") || sitStr.includes("aerienne")) correctAnswers.push("Aérienne");
            if(sitStr.includes("fleur de sol")) correctAnswers.push("Fleur de sol");
            if(correctAnswers.length === 0 && sitStr) correctAnswers.push(sitStr);
            options = ["Souterraine", "Aérienne", "Fleur de sol"]; isMultiple = true;
        } else if (qType === 3) {
            questionText = `Dans quel(s) arrondissement(s) ou zone se situe cette station ?`;
            correctAnswers = normalizeArrondissements(station['Arrondissement / Localisation']);
            options = [...allArrondissements]; isMultiple = true;
        } else {
            questionText = `Cette station est-elle dans le top 20 des plus fréquentées ?`;
            let val = (station['Dans le top 20 fréquenté'] || "non").toLowerCase();
            correctAnswers = [val === "oui" ? "oui" : "non"]; options = ["oui", "non"];
        }
        qs.push({ entityHTML, questionText, options, correctAnswers, isMultiple, optType });
    }
    return qs;
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    const setupContainer = document.getElementById('setup-container');
    const quizContainer = document.getElementById('quiz-container');
    const scoreContainer = document.getElementById('score-container');
    const optionsContainer = document.getElementById('options-container');
    const btnValidate = document.getElementById('btn-validate');
    const btnNext = document.getElementById('btn-next');
    
    document.getElementById('btn-start').addEventListener('click', () => {
        if(lignesData.length === 0 || stationsData.length === 0) {
            alert("Erreur critique : les CSV ne sont pas encore chargés.");
            return;
        }
        currentMode = document.getElementById('lignes_ou_stations').value;
        questions = currentMode === 'lignes' ? generateLignesQuestions(10) : generateStationsQuestions(10);
        currentQuestionIndex = 0; score = 0; gameHistory = [];
        
        setupContainer.classList.add('hidden');
        scoreContainer.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        showQuestion();
    });
    
    function showQuestion() {
        btnNext.classList.add('hidden');
        btnValidate.classList.add('hidden');
        document.getElementById('feedback').textContent = '';
        
        const q = questions[currentQuestionIndex];
        document.getElementById('entity-header').innerHTML = q.entityHTML;
        document.getElementById('question-text').textContent = `Question ${currentQuestionIndex + 1}/10 : ${q.questionText}`;
        optionsContainer.innerHTML = '';
        
        if (q.isMultiple) {
            optionsContainer.className = 'grid';
            q.options.forEach(opt => {
                const label = document.createElement('label'); label.className = 'checkbox-label';
                const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.value = opt;
                label.appendChild(checkbox);
                
                const span = document.createElement('span');
                if (q.optType === 'metro') {
                    span.innerHTML = `<div class="logo-container">${getLogoHTML(opt, 'M')} <span style="margin-left:8px;">Ligne ${opt}</span></div>`;
                } else if (q.optType === 'rer_tram') {
                    let logo = parseRerTramLogo(opt);
                    span.innerHTML = `<div class="logo-container">${logo !== "Aucunes" ? logo : ''} <span style="margin-left:8px;">${opt}</span></div>`;
                } else {
                    span.textContent = opt;
                }
                label.appendChild(span);
                optionsContainer.appendChild(label);
            });
            btnValidate.classList.remove('hidden');
            btnValidate.onclick = () => { btnValidate.classList.add('hidden'); handleMultipleChoice(q); };
        } else {
            optionsContainer.className = '';
            q.options.forEach(opt => {
                const btn = document.createElement('button'); btn.className = 'option-btn'; btn.textContent = opt; 
                btn.onclick = () => handleSingleChoice(opt, q, btn); optionsContainer.appendChild(btn);
            });
        }
    }
    
    function logHistory(q, userArr, isPerfect) {
        gameHistory.push({ entity: q.entityHTML, question: q.questionText, user: userArr.length ? userArr : ["Aucune réponse"], correct: q.correctAnswers, isPerfect: isPerfect });
    }
    
    function handleSingleChoice(selected, q, btnNode) {
        const correct = q.correctAnswers[0];
        const buttons = document.querySelectorAll('.option-btn'); buttons.forEach(b => b.disabled = true);
        const isPerfect = selected.toLowerCase() === correct.toLowerCase();
        logHistory(q, [selected], isPerfect);
        
        const feedback = document.getElementById('feedback');
        if (isPerfect) {
            btnNode.classList.add('correct'); feedback.textContent = "✅ Excellente réponse !"; feedback.style.color = "var(--success)"; score++;
        } else {
            btnNode.classList.add('wrong');
            buttons.forEach(b => { if(b.textContent.toLowerCase() === correct.toLowerCase()) b.classList.add('correct'); });
            feedback.textContent = `❌ Dommage. La réponse était : ${correct}`; feedback.style.color = "var(--danger)";
        }
        btnNext.classList.remove('hidden');
    }
    
    function handleMultipleChoice(q) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        let selectedAnswers = []; let isPerfect = true;
        
        checkboxes.forEach(cb => {
            cb.disabled = true;
            if (cb.checked) selectedAnswers.push(cb.value);
            let isCorrectOption = q.correctAnswers.some(ca => ca.toLowerCase() === cb.value.toLowerCase());
            
            if (cb.checked && isCorrectOption) cb.parentElement.classList.add('correct');
            else if (cb.checked && !isCorrectOption) { cb.parentElement.classList.add('wrong'); isPerfect = false; }
            else if (!cb.checked && isCorrectOption) { cb.parentElement.classList.add('missed'); isPerfect = false; }
        });
        
        if (selectedAnswers.length !== q.correctAnswers.length) isPerfect = false;
        logHistory(q, selectedAnswers, isPerfect);
        
        const feedback = document.getElementById('feedback');
        if (isPerfect) { feedback.textContent = "✅ Parfait !"; feedback.style.color = "var(--success)"; score++; } 
        else { feedback.textContent = `❌ Il y a des erreurs. Solution : ${q.correctAnswers.join(', ')}`; feedback.style.color = "var(--danger)"; }
        btnNext.classList.remove('hidden');
    }
    
    btnNext.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) showQuestion(); else endGame();
    });
    
    function endGame() {
        quizContainer.classList.add('hidden'); scoreContainer.classList.remove('hidden');
        document.getElementById('final-score').textContent = `${score} / ${questions.length}`;
        const recapContainer = document.getElementById('recap-container'); recapContainer.innerHTML = '';
        gameHistory.forEach((item, index) => {
            const div = document.createElement('div'); div.className = `recap-item ${item.isPerfect ? 'good' : 'bad'}`;
            div.innerHTML = `
                <div class="recap-q">${index + 1}. ${item.entity} <br> ${item.question}</div>
                <div class="recap-a">
                    <strong>Votre choix :</strong> <span style="color:${item.isPerfect ? 'var(--success)' : 'var(--danger)'}">${item.user.join(', ')}</span> <br>
                    <strong>Bonne réponse :</strong> ${item.correct.join(', ')}
                </div>`;
            recapContainer.appendChild(div);
        });
    }
    
    document.getElementById('btn-restart').addEventListener('click', () => {
        scoreContainer.classList.add('hidden'); setupContainer.classList.remove('hidden');
    });
});
