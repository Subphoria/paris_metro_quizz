let lignesData = [];
let stationsData = [];
let currentMode = 'lignes';
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// Listes globales pour les choix
let allTerminus = [];
let allMetroLines = ["1", "2", "3", "3bis", "4", "5", "6", "7", "7bis", "8", "9", "10", "11", "12", "13", "14"];
let allRerTram = [];
let allArrondissements = [];
for (let i = 1; i <= 20; i++) {
    allArrondissements.push(`Paris ${i}${i===1?'er':'e'}`);
}
allArrondissements.push("Hors Intramuros");

// Fonction pour parser les CSV
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(';').map(h => h.trim().replace(/^"|"$/g, ''));
    const results = [];
    
    for (let i = 1; i < lines.length; i++) {
        let rowStr = lines[i].trim();
        if (!rowStr) continue;
        
        const row = rowStr.split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
        
        let obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index] || "";
        });
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
    if (arrStr.toLowerCase().includes("hors intra-muros") || arrStr.toLowerCase().includes("hors intramuros")) {
        let parts = arrStr.split(',');
        let result = [];
        parts.forEach(p => {
            if (p.toLowerCase().includes("hors intra-muros") || p.toLowerCase().includes("hors intramuros")) {
                result.push("Hors Intramuros");
            } else {
                result.push(p.trim());
            }
        });
        return [...new Set(result)].filter(a => a);
    }
    return arrStr.split(',').map(a => a.trim()).filter(a => a);
}

function buildGlobalLists() {
    let terminusSet = new Set();
    lignesData.forEach(l => {
        normalizeTerminusList(l.terminus).forEach(t => terminusSet.add(t));
    });
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
        if (!resLignes.ok) throw new Error("Fichier lignes introuvable");
        const textLignes = await resLignes.text();
        lignesData = parseCSV(textLignes);
        
        const resStations = await fetch('stations_metro_paris.csv');
        if (!resStations.ok) throw new Error("Fichier stations introuvable");
        const textStations = await resStations.text();
        stationsData = parseCSV(textStations);
        
        buildGlobalLists();
        console.log(`Données chargées : ${lignesData.length} lignes, ${stationsData.length} stations.`);
    } catch (error) {
        console.error("Erreur Fetch:", error);
        alert("Erreur de chargement. Lancez l'application via un serveur local (Live Server).");
    }
}

// ---- GENERATEURS DE QUESTIONS ----

function generateLignesQuestions(num = 5) {
    const qs = [];
    const availableLignes = [...lignesData];
    
    for(let i=0; i<num; i++) {
        if(availableLignes.length === 0) break;
        const randIndex = Math.floor(Math.random() * availableLignes.length);
        const ligne = availableLignes.splice(randIndex, 1)[0];
        
        const qType = Math.floor(Math.random() * 5); // 0 to 4
        let questionText, correctAnswers, options, isMultiple = false;
        
        if (qType === 0) { // Couleur
            questionText = `Quelle est la couleur de la ligne ${ligne.Ligne} ?`;
            let c = (ligne.Couleur || "").toLowerCase().trim();
            correctAnswers = [c === "" ? "non définie" : c];
            options = ["jaune", "bleue", "violette", "verte", "non définie"];
        } 
        else if (qType === 1) { // Terminus (Multiple)
            questionText = `Cochez le ou les terminus de la ligne ${ligne.Ligne} :`;
            correctAnswers = normalizeTerminusList(ligne.terminus);
            options = [...allTerminus];
            isMultiple = true;
        } 
        else if (qType === 2) { // Embranchement
            questionText = `La ligne ${ligne.Ligne} possède-t-elle des embranchements ?`;
            let val = (ligne.embranchements || "non").toLowerCase();
            correctAnswers = [val === "oui" ? "oui" : "non"];
            options = ["oui", "non"];
        } 
        else if (qType === 3) { // Type de rames
            questionText = `Quel est le type de rames pour la ligne ${ligne.Ligne} ?`;
            let val = (ligne['type de rames'] || "").toLowerCase();
            correctAnswers = [val === "pneu" ? "MP (Roulement sur pneu)" : "MF (Roulements sur rail en fer)"];
            options = ["MP (Roulement sur pneu)", "MF (Roulements sur rail en fer)"];
        } 
        else { // Automatique
            questionText = `La ligne ${ligne.Ligne} est-elle automatique ?`;
            let val = (ligne.automatique || "non").toLowerCase();
            correctAnswers = [val === "oui" ? "oui" : "non"];
            options = ["oui", "non"];
        }
        
        qs.push({ questionText, options, correctAnswers, isMultiple });
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
        
        const qType = Math.floor(Math.random() * 5); // 0 to 4
        let questionText, correctAnswers, options, isMultiple = false;
        
        if (qType === 0) { // Lignes de métro
            questionText = `Quelles lignes de métro passent par la station ${station.Station} ?`;
            correctAnswers = (station['Lignes de métro']||"").split(',').map(l=>l.trim()).filter(l=>l);
            options = [...allMetroLines];
            isMultiple = true;
        } 
        else if (qType === 1) { // RER / Tram
            questionText = `Quelles lignes de RER/Tram passent par la station ${station.Station} ?`;
            let rawLines = (station['RER / Tram']||"").split(',').map(l=>l.trim()).filter(l=>l);
            correctAnswers = rawLines.length > 0 ? rawLines : ["aucunes"];
            options = [...allRerTram];
            isMultiple = true;
        } 
        else if (qType === 2) { // Situation
            questionText = `Quelle est la situation de la station ${station.Station} ?`;
            // "2 : Aérienne, 5 7 : Souterraine" => contient aérienne et souterraine
            let sitStr = (station['Situation'] || "").toLowerCase();
            correctAnswers = [];
            if(sitStr.includes("souterraine")) correctAnswers.push("Souterraine");
            if(sitStr.includes("aérienne") || sitStr.includes("aerienne")) correctAnswers.push("Aérienne");
            if(sitStr.includes("fleur de sol")) correctAnswers.push("Fleur de sol");
            if(correctAnswers.length === 0 && sitStr) correctAnswers.push(sitStr); // Fallback
            options = ["Souterraine", "Aérienne", "Fleur de sol"];
            isMultiple = true;
        } 
        else if (qType === 3) { // Arrondissement
            questionText = `Dans quel(s) arrondissement(s) ou zone se situe la station ${station.Station} ?`;
            correctAnswers = normalizeArrondissements(station['Arrondissement / Localisation']);
            options = [...allArrondissements];
            isMultiple = true;
        } 
        else { // Top 20
            questionText = `La station ${station.Station} est-elle dans le top 20 des plus fréquentées ?`;
            let val = (station['Dans le top 20 fréquenté'] || "non").toLowerCase();
            correctAnswers = [val === "oui" ? "oui" : "non"];
            options = ["oui", "non"];
        }
        
        qs.push({ questionText, options, correctAnswers, isMultiple });
    }
    return qs;
}

// ---- GESTION INTERFACE ----

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    
    const setupContainer = document.getElementById('setup-container');
    const quizContainer = document.getElementById('quiz-container');
    const scoreContainer = document.getElementById('score-container');
    const optionsContainer = document.getElementById('options-container');
    const btnValidate = document.getElementById('btn-validate');
    const btnNext = document.getElementById('btn-next');
    
    document.getElementById('btn-start').addEventListener('click', () => {
        currentMode = document.getElementById('lignes_ou_stations').value;
        questions = currentMode === 'lignes' ? generateLignesQuestions(10) : generateStationsQuestions(10);
        currentQuestionIndex = 0;
        score = 0;
        
        setupContainer.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        showQuestion();
    });
    
    function showQuestion() {
        btnNext.classList.add('hidden');
        btnValidate.classList.add('hidden');
        document.getElementById('feedback').textContent = '';
        
        const q = questions[currentQuestionIndex];
        document.getElementById('question-title').textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`;
        document.getElementById('question-text').textContent = q.questionText;
        
        optionsContainer.innerHTML = '';
        
        if (q.isMultiple) {
            optionsContainer.className = 'grid'; // utiliser la grille
            q.options.forEach(opt => {
                const label = document.createElement('label');
                label.className = 'checkbox-label';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = opt;
                
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(opt));
                optionsContainer.appendChild(label);
            });
            btnValidate.classList.remove('hidden');
            
            // Un seul clic de validation pour le multichoix
            btnValidate.onclick = () => {
                btnValidate.classList.add('hidden');
                handleMultipleChoice(q);
            };
        } else {
            optionsContainer.className = '';
            q.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = opt; 
                btn.onclick = () => handleSingleChoice(opt, q.correctAnswers[0], btn);
                optionsContainer.appendChild(btn);
            });
        }
    }
    
    function handleSingleChoice(selected, correct, btnNode) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(b => b.disabled = true);
        
        const feedback = document.getElementById('feedback');
        if (selected.toLowerCase() === correct.toLowerCase()) {
            btnNode.classList.add('correct');
            feedback.textContent = "✅ Bonne réponse !";
            feedback.style.color = "#155724";
            score++;
        } else {
            btnNode.classList.add('wrong');
            buttons.forEach(b => {
                if(b.textContent.toLowerCase() === correct.toLowerCase()) {
                    b.classList.add('correct');
                }
            });
            feedback.textContent = `❌ Mauvaise réponse. La bonne réponse était : ${correct}`;
            feedback.style.color = "#721c24";
        }
        btnNext.classList.remove('hidden');
    }
    
    function handleMultipleChoice(q) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        let selectedAnswers = [];
        let isPerfect = true;
        
        checkboxes.forEach(cb => {
            cb.disabled = true; // bloquer la modif
            if (cb.checked) selectedAnswers.push(cb.value);
            
            let isCorrectOption = q.correctAnswers.some(ca => ca.toLowerCase() === cb.value.toLowerCase());
            
            if (cb.checked && isCorrectOption) {
                cb.parentElement.classList.add('correct');
            } else if (cb.checked && !isCorrectOption) {
                cb.parentElement.classList.add('wrong');
                isPerfect = false;
            } else if (!cb.checked && isCorrectOption) {
                cb.parentElement.classList.add('missed'); // Oublié
                isPerfect = false;
            }
        });
        
        // Si tableau vide mais réponse correcte = [], cas spécial mais n'arrive normalement pas ici.
        // On vérifie s'ils ont tous bien coché les bonnes réponses et aucune fausse.
        if (selectedAnswers.length !== q.correctAnswers.length) {
            isPerfect = false;
        }
        
        const feedback = document.getElementById('feedback');
        if (isPerfect) {
            feedback.textContent = "✅ Bonne réponse !";
            feedback.style.color = "#155724";
            score++;
        } else {
            feedback.textContent = `❌ Mauvaise ou incomplète. Les bonnes réponses étaient : ${q.correctAnswers.join(', ')}`;
            feedback.style.color = "#721c24";
        }
        
        btnNext.classList.remove('hidden');
    }
    
    btnNext.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            quizContainer.classList.add('hidden');
            scoreContainer.classList.remove('hidden');
            document.getElementById('final-score').textContent = `Votre score : ${score} / ${questions.length}`;
        }
    });
    
    document.getElementById('btn-restart').addEventListener('click', () => {
        scoreContainer.classList.add('hidden');
        setupContainer.classList.remove('hidden');
    });
});
