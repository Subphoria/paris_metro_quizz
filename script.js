let lignesData = [];
let stationsData = [];
let currentMode = 'lignes';
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// Fonction pour parser les CSV (gère les guillemets)
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(';').map(h => h.trim().replace(/^"|"$/g, ''));
    const results = [];
    
    for (let i = 1; i < lines.length; i++) {
        let rowStr = lines[i].trim();
        if (!rowStr) continue;
        
        // Regex pour séparer par ';' sans casser ce qui est entre guillemets
        const row = rowStr.split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
        
        let obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index] || "";
        });
        results.push(obj);
    }
    return results;
}

// Chargement des données CSV
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
        
        console.log(`Données chargées : ${lignesData.length} lignes, ${stationsData.length} stations.`);
    } catch (error) {
        console.error("Erreur Fetch:", error);
        alert("Erreur de chargement. Si vous ouvrez le fichier directement (file://), les navigateurs bloquent la lecture des CSV par sécurité. Utilisez l'extension 'Live Server' sur Visual Studio Code.");
    }
}

// Génération aléatoire des questions LIGNES
function generateLignesQuestions(num = 5) {
    const qs = [];
    const availableLignes = [...lignesData];
    
    for(let i=0; i<num; i++) {
        if(availableLignes.length === 0) break;
        const randIndex = Math.floor(Math.random() * availableLignes.length);
        const ligne = availableLignes.splice(randIndex, 1)[0];
        
        const qType = Math.floor(Math.random() * 3);
        let questionText, correctAnswer, wrongAnswers;
        
        if (qType === 0) {
            questionText = `Quelle est la couleur de la ligne ${ligne.Ligne} ?`;
            correctAnswer = ligne.Couleur;
            wrongAnswers = lignesData.filter(l => l.Couleur !== ligne.Couleur).map(l => l.Couleur);
        } else if (qType === 1) {
            questionText = `Quels sont les terminus de la ligne ${ligne.Ligne} ?`;
            correctAnswer = ligne.terminus;
            wrongAnswers = lignesData.filter(l => l.terminus !== ligne.terminus).map(l => l.terminus);
        } else {
            questionText = `La ligne ${ligne.Ligne} est-elle automatique ?`;
            correctAnswer = ligne.automatique;
            wrongAnswers = ligne.automatique.toLowerCase() === 'oui' ? ['non'] : ['oui'];
        }
        
        // Prendre des mauvaises réponses uniques
        wrongAnswers = [...new Set(wrongAnswers)].filter(a => a !== correctAnswer).sort(() => 0.5 - Math.random()).slice(0, 3);
        
        const options = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());
        qs.push({ questionText, options, correctAnswer });
    }
    return qs;
}

// Génération aléatoire des questions STATIONS
function generateStationsQuestions(num = 5) {
    const qs = [];
    const availableStations = [...stationsData];
    
    for(let i=0; i<num; i++) {
        if(availableStations.length === 0) break;
        const randIndex = Math.floor(Math.random() * availableStations.length);
        const station = availableStations.splice(randIndex, 1)[0];
        
        const qType = Math.floor(Math.random() * 4);
        let questionText, correctAnswer, wrongAnswers;
        
        if (qType === 0) {
            questionText = `Sur quelle(s) ligne(s) de métro se trouve la station ${station.Station} ?`;
            correctAnswer = station['Lignes de métro'];
            wrongAnswers = stationsData.filter(s => s['Lignes de métro'] !== station['Lignes de métro']).map(s => s['Lignes de métro']);
        } else if (qType === 1) {
            questionText = `Dans quel arrondissement ou ville se situe la station ${station.Station} ?`;
            correctAnswer = station['Arrondissement / Localisation'];
            wrongAnswers = stationsData.filter(s => s['Arrondissement / Localisation'] !== station['Arrondissement / Localisation']).map(s => s['Arrondissement / Localisation']);
        } else if (qType === 2) {
            questionText = `La station ${station.Station} est-elle dans le top 20 des plus fréquentées ?`;
            correctAnswer = station['Dans le top 20 fréquenté'];
            wrongAnswers = station['Dans le top 20 fréquenté'] === 'Oui' ? ['Non'] : ['Oui'];
        } else {
            questionText = `Quelle est la situation de la station ${station.Station} (souterraine, aérienne...) ?`;
            correctAnswer = station['Situation'];
            wrongAnswers = stationsData.filter(s => s['Situation'] !== station['Situation']).map(s => s['Situation']);
        }
        
        wrongAnswers = [...new Set(wrongAnswers)].filter(a => a !== correctAnswer).sort(() => 0.5 - Math.random()).slice(0, 3);
        const options = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());
        qs.push({ questionText, options, correctAnswer });
    }
    return qs;
}

// Événements UI
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    
    const setupContainer = document.getElementById('setup-container');
    const quizContainer = document.getElementById('quiz-container');
    const scoreContainer = document.getElementById('score-container');
    const btnStart = document.getElementById('btn-start');
    const btnNext = document.getElementById('btn-next');
    const btnRestart = document.getElementById('btn-restart');
    
    btnStart.addEventListener('click', () => {
        if (lignesData.length === 0 || stationsData.length === 0) {
            alert("Les données ne sont pas chargées. Veuillez lancer l'application via un serveur local (Live Server).");
            return;
        }
        
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
        document.getElementById('feedback').textContent = '';
        
        const q = questions[currentQuestionIndex];
        document.getElementById('question-title').textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`;
        document.getElementById('question-text').textContent = q.questionText;
        
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt || "Aucune"; 
            btn.addEventListener('click', () => handleAnswer(opt, q.correctAnswer, btn));
            optionsContainer.appendChild(btn);
        });
    }
    
    function handleAnswer(selected, correct, btnNode) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(b => b.disabled = true);
        
        const feedback = document.getElementById('feedback');
        if (selected === correct) {
            btnNode.classList.add('correct');
            feedback.textContent = "✅ Bonne réponse !";
            feedback.style.color = "#155724";
            score++;
        } else {
            btnNode.classList.add('wrong');
            buttons.forEach(b => {
                if(b.textContent === correct || (correct === "" && b.textContent === "Aucune")) {
                    b.classList.add('correct');
                }
            });
            feedback.textContent = `❌ Mauvaise réponse. La bonne réponse était : ${correct || "Aucune"}`;
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
    
    btnRestart.addEventListener('click', () => {
        scoreContainer.classList.add('hidden');
        setupContainer.classList.remove('hidden');
    });
});
