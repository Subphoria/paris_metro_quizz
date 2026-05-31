let lignesData = [];
let stationsData = [];
let currentMode = 'lignes';
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let gameHistory = [];

const rawLignesCSV = `Ligne;Couleur;terminus;embranchements;type de rames;automatique
1;jaune;La Défense (Grande Arche), Château de Vincennes;non;pneu;oui
2;bleue;Porte Dauphine, Nation;non;fer;non
3;verte;Pont de Levallois - Bécon, Gallieni;non;fer;non
3bis;bleue;Gambetta, Porte des Lilas;non;fer;non
4;violette;Bagneux - Lucie Aubrac, Porte de Clignancourt;non;pneu;oui
5;;Place d'Italie, Bobigny - Pablo Picasso;non;fer;non
6;verte;Charle de Gaulle - Étoile, Nation;non;pneu;non
7;;Mairie d'Ivry, Villejuif - Louis Aragon, La Courneuve - 8 Mai 1945;oui;fer;non
7bis;verte;Louis Blanc, Pré-Saint-Gervais;non;fer;non
8;violette;Pointe du Lac, Balard;non;fer;non
9;;Maire de Montreui, Pont de Sèvre;non;fer;non
10;jaune;Gare d'Austerlitz, Boulogne Pont de Saint-Cloud;non;fer;non
11;;Châtelet, Rosny-sous-Bois;non;pneu;non
12;verte;Mairie d'Aubervilliers, Mairie d'Issy;non;fer;non
13;bleue;Aisnières - Gennevilliers - Les Courtilles, Saint-Denis - Université, Chatillon - Montrouge;oui;fer;non
14;violette;Aéroport d'Orly, Saint-Denis - Pleyel;non;pneu;oui
`;
const rawStationsCSV = `Station;Lignes de métro;RER / Tram;Situation;Arrondissement / Localisation;Dans le top 20 fréquenté
Abbesses;12;;Souterraine;Paris 18e;Non
Aéroport d'Orly;14;Tram T7;Souterraine;Hors intra-muros (Paray-Vieille-Poste);Non
Aimé Césaire;12;;Souterraine;Hors intra-muros (Aubervilliers);Non
Alésia;4;;Souterraine;Paris 14e;Non
Alexandre Dumas;2;;Souterraine;Paris 11e, Paris 20e;Non
Alma - Marceau;9;;Souterraine;Paris 8e, Paris 16e;Non
Anatole France;3;;Souterraine;Hors intra-muros (Levallois-Perret);Non
Anvers;2;;Souterraine;Paris 9e, Paris 18e;Non
Argentine;1;;Souterraine;Paris 16e, Paris 17e;Non
Arts et Métiers;3, 11;;Souterraine;Paris 3e;Non
Assemblée nationale;12;;Souterraine;Paris 7e;Non
Aubervilliers - Pantin - Quatre Chemins;7;;Souterraine;Hors intra-muros (Aubervilliers, Pantin);Non
Avenue Émile-Zola;10;;Souterraine;Paris 15e;Non
Avron;2;;Souterraine;Paris 11e, Paris 20e;Non
Bagneux - Lucie Aubrac;4;;Souterraine;Hors intra-muros (Bagneux);Non
Balard;8;Tram T2, Tram T3a;Souterraine;Paris 15e;Non
Barbara;4;;Souterraine;Hors intra-muros (Montrouge, Bagneux);Non
Barbès - Rochechouart;2, 4;;2 : Aérienne, 4 : Souterraine;Paris 9e, Paris 10e, Paris 18e;Non
Basilique de Saint-Denis;13;Tram T1, Tram T5;Souterraine;Hors intra-muros (Saint-Denis);Non
Bastille;1, 5, 8;;1 : Fleur de sol, 5 8 : Souterraine;Paris 4e, Paris 11e, Paris 12e;Oui
Bel-Air;6;;Fleur de sol;Paris 12e;Non
Belleville;2, 11;;Souterraine;Paris 10e, Paris 11e, Paris 19e, Paris 20e;Oui
Bérault;1;;Souterraine;Hors intra-muros (Saint-Mandé, Vincennes);Non
Bercy;6, 14;;Souterraine;Paris 12e;Non
Bibliothèque François-Mitterrand;14;RER C, Tram T3a;Souterraine;Paris 13e;Oui
Billancourt;9;;Souterraine;Hors intra-muros (Boulogne-Billancourt);Non
Bir-Hakeim;6;RER C;Aérienne;Paris 15e;Non
Blanche;2;;Souterraine;Paris 9e, Paris 18e;Non
Bobigny - Pablo Picasso;5;Tram T1;Souterraine;Hors intra-muros (Bobigny);Oui
Bobigny - Pantin - Raymond Queneau;5;;Souterraine;Hors intra-muros (Bobigny, Pantin);Non
Boissière;6;;Souterraine;Paris 16e;Non
Bolivar;7bis;;Souterraine;Paris 19e;Non
Bonne-Nouvelle;8, 9;;Souterraine;Paris 2e, Paris 9e, Paris 10e;Non
Botzaris;7bis;;Souterraine;Paris 19e;Non
Boucicaut;8;;Souterraine;Paris 15e;Non
Boulogne - Jean Jaurès;10;;Souterraine;Hors intra-muros (Boulogne-Billancourt);Non
Boulogne - Pont de Saint-Cloud;10;;Souterraine;Hors intra-muros (Boulogne-Billancourt);Non
Bourse;3;;Souterraine;Paris 2e;Non
Bréguet - Sabin;5;;Souterraine;Paris 11e;Non
Brochant;13;;Souterraine;Paris 17e;Non
Buttes Chaumont;7bis;;Souterraine;Paris 19e;Non
Buzenval;9;;Souterraine;Paris 20e;Non
Cadet;7;;Souterraine;Paris 9e;Non
Cambronne;6;;Aérienne;Paris 15e;Non
Campo-Formio;5;;Souterraine;Paris 13e;Non
Cardinal Lemoine;10;;Souterraine;Paris 5e;Non
Carrefour Pleyel;13;;Souterraine;Hors intra-muros (Saint-Denis);Non
Censier - Daubenton;7;;Souterraine;Paris 5e;Non
Champs-Élysées - Clemenceau;1, 13;;Souterraine;Paris 8e;Non
Chardon-Lagache;10;;Souterraine;Paris 16e;Non
Charenton - Écoles;8;;Souterraine;Hors intra-muros (Charenton-le-Pont);Non
Charles de Gaulle - Étoile;1, 2, 6;RER A;Souterraine;Paris 8e, Paris 16e, Paris 17e;Non
Charles Michels;10;;Souterraine;Paris 15e;Non
Charonne;9;;Souterraine;Paris 11e;Non
Château d'Eau;4;;Souterraine;Paris 10e;Non
Château de Vincennes;1;;Souterraine;Paris 12e, Vincennes;Non
Château-Landon;7;;Souterraine;Paris 10e;Non
Château Rouge;4;;Souterraine;Paris 18e;Non
Châtelet;1, 4, 7, 11, 14;RER A, RER B, RER D;Souterraine;Paris 1er, Paris 4e;Oui
Châtillon - Montrouge;13;Tram T6;Aérienne;Hors intra-muros (Bagneux,Châtillon,Montrouge);Non
Chaussée d'Antin - La Fayette;7, 9;;Souterraine;Paris 9e;Non
Chemin Vert;8;;Souterraine;Paris 3e, Paris 11e;Non
Chevaleret;6;;Aérienne;Paris 13e;Non
Chevilly-Larue;14;Tram T7;Souterraine;Hors intra-muros (Chevilly-Larue);Non
Cité;4;;Souterraine;Paris 4e;Non
Cluny - La Sorbonne;10;RER B, RER C;Souterraine;Paris 5e;Non
Colonel Fabien;2;;Souterraine;Paris 10e, Paris 19e;Non
Commerce;8;;Souterraine;Paris 15e;Non
Concorde;1, 8, 12;;Souterraine;Paris 1er, Paris 8e;Non
Convention;12;;Souterraine;Paris 15e;Non
Corentin Cariou;7;;Souterraine;Paris 19e;Non
Corentin Celton;12;;Souterraine;Hors intra-muros (Issy-les-Moulineaux);Non
Corvisart;6;;Aérienne;Paris 13e;Non
Coteaux Beauclair;11;;Aérienne;Hors intra-muros (Rosny-sous-Bois, Noisy-le-Sec);Non
Cour Saint-Émilion;14;;Souterraine;Paris 12e;Non
Courcelles;2;;Souterraine;Paris 8e, Paris 17e;Non
Couronnes;2;;Souterraine;Paris 11e, Paris 20e;Non
Créteil - L'Échat;8;;Fleur de sol;Hors intra-muros (Créteil);Non
Créteil - Préfecture;8;;Fleur de sol;Hors intra-muros (Créteil);Non
Créteil - Université;8;;Fleur de sol;Hors intra-muros (Créteil);Non
Crimée;7;;Souterraine;Paris 19e;Non
Croix de Chavaux;9;;Souterraine;Hors intra-muros (Montreuil);Non
Danube;7bis;;Souterraine;Paris 19e;Non
Daumesnil;6, 8;;Souterraine;Paris 12e;Non
Denfert-Rochereau;4, 6;RER B;Souterraine;Paris 14e;Non
Dugommier;6;;Souterraine;Paris 12e;Non
Dupleix;6;;Aérienne;Paris 15e;Non
Duroc;10, 13;;Souterraine;Paris 6e, Paris 7e, Paris 15e;Non
École Militaire;8;;Souterraine;Paris 7e;Non
École vétérinaire de Maisons-Alfort;8;;Souterraine;Hors intra-muros (Maisons-Alfort);Non
Edgar Quinet;6;;Souterraine;Paris 14e;Non
Église d'Auteuil;10;;Souterraine;Paris 16e;Non
Église de Pantin;5;;Souterraine;Hors intra-muros (Pantin);Non
Esplanade de la Défense;1;;Souterraine;Hors intra-muros (Courbevoie,Puteaux);Non
Étienne Marcel;4;;Souterraine;Paris 1er, Paris 2e;Non
Europe;3;;Souterraine;Paris 8e;Non
Exelmans;9;;Souterraine;Paris 16e;Non
Faidherbe - Chaligny;8;;Souterraine;Paris 11e, Paris 12e;Non
Falguière;12;;Souterraine;Paris 15e;Non
Félix Faure;8;;Souterraine;Paris 15e;Non
Filles du Calvaire;8;;Souterraine;Paris 3e, Paris 11e;Non
Fort d'Aubervilliers;7;;Souterraine;Hors intra-muros (Aubervilliers);Non
Franklin D. Roosevelt;1, 9;;Souterraine;Paris 8e;Oui
Front populaire;12;;Souterraine;Hors intra-muros (Aubervilliers, Saint-Denis);Non
Gabriel Péri;13;;Souterraine;Hors intra-muros (Asnières-sur-Seine,Gennevilliers);Non
Gaîté;13;;Souterraine;Paris 14e;Non
Gallieni;3;;Souterraine;Hors intra-muros (Bagnolet);Non
Gambetta;3, 3bis;;Souterraine;Paris 20e;Non
Gare d'Austerlitz;5, 10;RER C;5 : Aérienne, 10 : Souterraine;Paris 5e, Paris 13e;Oui
Gare de l'Est;4, 5, 7;;Souterraine;Paris 10e;Oui
Gare de Lyon;1, 14;RER A, RER D;Souterraine;Paris 12e;Oui
Gare du Nord;4, 5;RER B, RER D, RER E;Souterraine;Paris 10e;Oui
Garibaldi;13;;Souterraine;Hors intra-muros (Saint-Ouen-sur-Seine);Non
George V;1;;Souterraine;Paris 8e;Non
Glacière;6;;Aérienne;Paris 13e;Non
Goncourt;11;;Souterraine;Paris 10e, Paris 11e;Non
Grands Boulevards;8, 9;;Souterraine;Paris 2e, Paris 9e;Non
Guy Môquet;13;;Souterraine;Paris 17e, Paris 18e;Non
Havre - Caumartin;3, 9;RER A, RER E;Souterraine;Paris 9e;Non
Hoche;5;;Souterraine;Hors intra-muros (Pantin);Non
Hôpital Bicêtre;14;;Souterraine;Hors intra-muros (Le Kremlin-Bicêtre, Gentilly);Non
Hôtel de Ville;1, 11;;Souterraine;Paris 4e;Oui
Iéna;9;;Souterraine;Paris 16e;Non
Invalides;8, 13;RER C;Souterraine;Paris 7e;Non
Jacques Bonsergent;5;;Souterraine;Paris 10e;Non
Jasmin;9;;Souterraine;Paris 16e;Non
Jaurès;2, 5, 7bis;;2 : Aérienne, 5 7bis : Souterraine;Paris 10e, Paris 19e;Non
Javel - André Citroën;10;RER C;Souterraine;Paris 15e;Non
Jourdain;11;;Souterraine;Paris 19e, Paris 20e;Non
Jules Joffrin;12;;Souterraine;Paris 18e;Non
Jussieu;7, 10;;Souterraine;Paris 5e;Non
Kléber;6;;Souterraine;Paris 16e;Non
La Chapelle;2;RER B, RER D, RER E;Aérienne;Paris 10e, Paris 18e;Non
La Courneuve - 8 Mai 1945;7;Tram T1;Souterraine;Hors intra-muros (La Courneuve);Non
La Défense;1;RER A, RER E, Tram T2;Souterraine;Hors intra-muros (Puteaux);Oui
La Dhuys;11;;Souterraine;Hors intra-muros (Montreuil, Rosny-sous-Bois);Non
La Fourche;13;;Souterraine;Paris 17e, Paris 18e;Non
La Motte-Picquet - Grenelle;6, 8, 10;;6 : Aérienne, 8 10 : Souterraine;Paris 15e;Non
La Muette;9;RER C;Souterraine;Paris 16e;Non
La Tour-Maubourg;8;;Souterraine;Paris 7e;Non
Lamarck - Caulaincourt;12;;Souterraine;Paris 18e;Non
Laumière;5;;Souterraine;Paris 19e;Non
Le Kremlin-Bicêtre;7;;Souterraine;Hors intra-muros (Le Kremlin-Bicêtre);Non
Le Peletier;7;;Souterraine;Paris 9e;Non
Ledru-Rollin;8;;Souterraine;Paris 11e, Paris 12e;Non
Les Agnettes;13;;Souterraine;Hors intra-muros (Asnières-sur-Seine,Gennevilliers);Non
Les Courtilles;13;Tram T1;Souterraine;Hors intra-muros (Asnières-sur-Seine,Gennevilliers);Non
Les Gobelins;7;;Souterraine;Paris 13e;Non
Les Halles;4;RER A, RER B, RER D;Souterraine;Paris 1er;Oui
Les Sablons;1;;Souterraine;Hors intra-muros (Neuilly-sur-Seine);Non
L'Haÿ-les-Roses;14;;Souterraine;Hors intra-muros (L'Haÿ-les-Roses, Chevilly-Larue);Non
Liberté;8;;Souterraine;Hors intra-muros (Charenton-le-Pont);Non
Liège;13;;Souterraine;Paris 8e, Paris 9e;Non
Louis Blanc;7, 7bis;;Souterraine;Paris 10e;Non
Louise Michel;3;;Souterraine;Hors intra-muros (Levallois-Perret);Non
Lourmel;8;;Souterraine;Paris 15e;Non
Louvre - Rivoli;1;;Souterraine;Paris 1er;Non
Mabillon;10;;Souterraine;Paris 6e;Non
Madeleine;8, 12, 14;;Souterraine;Paris 1er, Paris 8e;Non
Mairie d'Aubervilliers;12;;Souterraine;Hors intra-muros (Aubervilliers);Non
Mairie d'Issy;12;;Souterraine;Hors intra-muros (Issy-les-Moulineaux);Non
Mairie d'Ivry;7;;Souterraine;Hors intra-muros (Ivry-sur-Seine);Non
Mairie de Clichy;13;;Souterraine;Hors intra-muros (Clichy);Non
Mairie de Montreuil;9;;Souterraine;Hors intra-muros (Montreuil);Oui
Mairie de Montrouge;4;;Souterraine;Hors intra-muros (Montrouge);Non
Mairie de Saint-Ouen;13, 14;;Souterraine;Hors intra-muros (Saint-Ouen-sur-Seine);Non
Mairie des Lilas;11;;Souterraine;Hors intra-muros (Les Lilas);Non
Maison Blanche;7, 14;;Souterraine;Paris 13e;Non
Maisons-Alfort - Les Juilliottes;8;;Souterraine;Hors intra-muros (Maisons-Alfort);Non
Maisons-Alfort - Stade;8;;Souterraine;Hors intra-muros (Maisons-Alfort);Non
Malakoff - Plateau de Vanves;13;;Souterraine;Hors intra-muros (Malakoff, Vanves);Non
Malakoff - Rue Étienne-Dolet;13;;Aérienne;Hors intra-muros (Malakoff);Non
Malesherbes;3;;Souterraine;Paris 17e;Non
Maraîchers;9;;Souterraine;Paris 20e;Non
Marcadet - Poissonniers;4, 12;;Souterraine;Paris 18e;Non
Marcel Sembat;9;;Souterraine;Hors intra-muros (Boulogne-Billancourt);Non
Marx Dormoy;12;;Souterraine;Paris 18e;Non
Maubert - Mutualité;10;;Souterraine;Paris 5e;Non
Ménilmontant;2;;Souterraine;Paris 11e, Paris 20e;Non
Michel Bizot;8;;Souterraine;Paris 12e;Non
Michel-Ange - Auteuil;9, 10;;Souterraine;Paris 16e;Non
Michel-Ange - Molitor;9, 10;;Souterraine;Paris 16e;Non
Mirabeau;10;;Souterraine;Paris 16e;Non
Miromesnil;9, 13;;Souterraine;Paris 8e;Non
Monceau;2;;Souterraine;Paris 8e;Non
Montgallet;8;;Souterraine;Paris 12e;Non
Montparnasse - Bienvenüe;4, 6, 12, 13;;Souterraine;Paris 6e, Paris 14e, Paris 15e;Oui
Montreuil - Hôpital;11;;Souterraine;Hors intra-muros (Montreuil, Noisy-le-Sec);Non
Mouton-Duvernet;4;;Souterraine;Paris 14e;Non
Nation;1, 2, 6, 9;RER A;Souterraine;Paris 11e, Paris 12e;Oui
Nationale;6;;Aérienne;Paris 13e;Non
Notre-Dame-de-Lorette;12;;Souterraine;Paris 9e;Non
Notre-Dame-des-Champs;12;;Souterraine;Paris 6e;Non
Oberkampf;5, 9;;Souterraine;Paris 11e;Non
Odéon;4, 10;;Souterraine;Paris 6e;Non
Olympiades;14;;Souterraine;Paris 13e;Non
Opéra;3, 7, 8;RER A;Souterraine;Paris 2e, Paris 9e;Non
Ourcq;5;;Souterraine;Paris 19e;Non
Palais-Royal - Musée du Louvre;1, 7;;Souterraine;Paris 1er;Non
Parmentier;3;;Souterraine;Paris 11e;Non
Passy;6;;Fleur de sol;Paris 16e;Non
Pasteur;6, 12;;Souterraine;Paris 15e;Non
Pelleport;3bis;;Souterraine;Paris 20e;Non
Père Lachaise;2, 3;;Souterraine;Paris 11e, Paris 20e;Non
Pereire;3;RER C;Souterraine;Paris 17e;Non
Pernety;13;;Souterraine;Paris 14e;Non
Philippe Auguste;2;;Souterraine;Paris 11e, Paris 20e;Non
Picpus;6;;Souterraine;Paris 12e;Non
Pierre et Marie Curie;7;;Souterraine;Hors intra-muros (Ivry-sur-Seine);Non
Pigalle;2, 12;;Souterraine;Paris 9e, Paris 18e;Non
Place d'Italie;5, 6, 7;;Souterraine;Paris 13e;Oui
Place de Clichy;2, 13;;Souterraine;Paris 9e, Paris 17e, Paris 18e;Non
Place des Fêtes;7bis, 11;;Souterraine;Paris 19e;Non
Place Monge;7;;Souterraine;Paris 5e;Non
Plaisance;13;;Souterraine;Paris 14e;Non
Pointe du Lac;8;;Fleur de sol;Hors intra-muros (Créteil);Non
Poissonnière;7;;Souterraine;Paris 9e, Paris 10e;Non
Pont de Levallois - Bécon;3;;Souterraine;Hors intra-muros (Levallois-Perret);Non
Pont de Neuilly;1;;Souterraine;Hors intra-muros (Neuilly-sur-Seine);Non
Pont de Sèvres;9;;Souterraine;Hors intra-muros (Boulogne-Billancourt);Non
Pont Cardinet;14;;Souterraine;Paris 17e;Non
Pont Marie;7;;Souterraine;Paris 4e;Non
Pont-Neuf;7;;Souterraine;Paris 1er;Non
Porte Dauphine;2;RER C, Tram T3b;Souterraine;Paris 16e;Non
Porte d'Auteuil;10;;Souterraine;Paris 16e;Non
Porte de Bagnolet;3;Tram T3b;Souterraine;Paris 20e;Non
Porte de Champerret;3;Tram T3b;Souterraine;Paris 17e;Non
Porte de Charenton;8;Tram T3a;Souterraine;Paris 12e;Non
Porte de Choisy;7;Tram T3a, Tram T9;Souterraine;Paris 13e;Non
Porte de Clichy;13, 14;RER C, Tram T3b;Souterraine;Paris 17e;Non
Porte de Clignancourt;4;Tram T3b;Souterraine;Paris 18e;Non
Porte de la Chapelle;12;Tram T3b;Souterraine;Paris 18e;Non
Porte de la Villette;7;Tram T3b;Souterraine;Paris 19e;Non
Porte de Montreuil;9;Tram T3b;Souterraine;Paris 20e;Non
Porte de Pantin;5;Tram T3b;Souterraine;Paris 19e;Non
Porte de Saint-Cloud;9;;Souterraine;Paris 16e;Non
Porte de Saint-Ouen;13;Tram T3b;Souterraine;Paris 17e, Paris 18e;Non
Porte de Vanves;13;Tram T3a;Souterraine;Paris 14e;Non
Porte de Versailles;12;Tram T2, Tram T3a;Souterraine;Paris 15e;Non
Porte de Vincennes;1;Tram T3a, Tram T3b;Souterraine;Paris 12e, Paris 20e;Non
Porte des Lilas;3bis, 11;Tram T3b;Souterraine;Paris 19e, Paris 20e;Non
Porte d'Italie;7;Tram T3a;Souterraine;Paris 13e;Non
Porte d'Ivry;7;Tram T3a;Souterraine;Paris 13e;Non
Porte Dorée;8;Tram T3a;Souterraine;Paris 12e;Non
Porte d'Orléans;4;Tram T3a;Souterraine;Paris 14e;Non
Porte Maillot;1;RER C, RER E, Tram T3b;Souterraine;Paris 16e, Paris 17e;Non
Pré-Saint-Gervais;7bis;Tram T3b;Souterraine;Paris 19e;Non
Pyramides;7, 14;;Souterraine;Paris 1er;Non
Pyrénées;11;;Souterraine;Paris 19e, Paris 20e;Non
Quai de la Gare;6;;Aérienne;Paris 13e;Non
Quai de la Rapée;5;;Fleur de sol;Paris 12e;Non
Quatre-Septembre;3;;Souterraine;Paris 2e;Non
Rambuteau;11;;Souterraine;Paris 3e, Paris 4e;Non
Ranelagh;9;;Souterraine;Paris 16e;Non
Raspail;4, 6;;Souterraine;Paris 14e;Non
Réaumur - Sébastopol;3, 4;;Souterraine;Paris 2e, Paris 3e;Non
Rennes;12;;Souterraine;Paris 6e;Non
République;3, 5, 8, 9, 11;;Souterraine;Paris 3e, Paris 10e, Paris 11e;Oui
Reuilly - Diderot;1, 8;;Souterraine;Paris 12e;Non
Richard-Lenoir;5;;Souterraine;Paris 11e;Non
Richelieu - Drouot;8, 9;;Souterraine;Paris 2e, Paris 9e;Non
Riquet;7;;Souterraine;Paris 19e;Non
Robespierre;9;;Souterraine;Hors intra-muros (Montreuil);Non
Romainville - Carnot;11;;Souterraine;Hors intra-muros (Romainville, Noisy-le-Sec);Non
Rome;2;;Souterraine;Paris 8e, Paris 17e;Non
Rosny-Bois-Perrier;11;RER E;Souterraine;Hors intra-muros (Rosny-sous-Bois);Non
Rue de la Pompe;9;;Souterraine;Paris 16e;Non
Rue des Boulets;9;;Souterraine;Paris 11e;Non
Rue du Bac;12;;Souterraine;Paris 7e;Non
Rue Saint-Maur;3;;Souterraine;Paris 11e;Non
Saint-Ambroise;9;;Souterraine;Paris 11e;Non
Saint-Augustin;9;;Souterraine;Paris 8e;Non
Saint-Denis Pleyel;14;;Souterraine;Hors intra-muros (Saint-Denis);Non
Saint-Denis - Porte de Paris;13;Tram T8;Souterraine;Hors intra-muros (Saint-Denis);Non
Saint-Denis - Université;13;Tram T5;Souterraine;Hors intra-muros (Saint-Denis);Non
Saint-Fargeau;3bis;;Souterraine;Paris 20e;Non
Saint-François-Xavier;13;;Souterraine;Paris 7e;Non
Saint-Georges;12;;Souterraine;Paris 9e;Non
Saint-Germain-des-Prés;4;;Souterraine;Paris 6e;Non
Saint-Jacques;6;;Fleur de sol;Paris 14e;Non
Saint-Lazare;3, 12, 13, 14;RER E;Souterraine;Paris 8e, Paris 9e;Oui
Saint-Mandé;1;;Souterraine;Hors intra-muros (Saint-Mandé);Non
Saint-Marcel;5;;Souterraine;Paris 13e;Non
Saint-Michel;4;RER C;Souterraine;Paris 5e, Paris 6e;Non
Saint-Ouen;14;RER C;Souterraine;Hors intra-muros (Clichy, Saint-Ouen-sur-Seine);Non
Saint-Paul;1;;Souterraine;Paris 4e;Non
Saint-Philippe du Roule;9;;Souterraine;Paris 8e;Non
Saint-Placide;4;;Souterraine;Paris 6e;Non
Saint-Sébastien - Froissart;8;;Souterraine;Paris 3e, Paris 11e;Non
Saint-Sulpice;4;;Souterraine;Paris 6e;Non
Ségur;10;;Souterraine;Paris 7e, Paris 15e;Non
Sentier;3;;Souterraine;Paris 2e;Non
Serge Gainsbourg;11;;Souterraine;Hors intra-muros (Les Lilas);Non
Sèvres - Babylone;10, 12;;Souterraine;Paris 6e, Paris 7e;Non
Sèvres - Lecourbe;6;;Aérienne;Paris 15e;Non
Simplon;4;;Souterraine;Paris 18e;Non
Solférino;12;;Souterraine;Paris 7e;Non
Stalingrad;2, 5, 7;;2 : Aérienne, 5 7 : Souterraine;Paris 10e, Paris 19e;Non
Strasbourg - Saint-Denis;4, 8, 9;;Souterraine;Paris 2e, Paris 3e, Paris 10e;Oui
Sully - Morland;7;;Souterraine;Paris 4e;Non
Télégraphe;11;;Souterraine;Paris 19e, Paris 20e;Non
Temple;3;;Souterraine;Paris 3e;Non
Ternes;2;;Souterraine;Paris 8e, Paris 17e;Non
Thiais - Orly;14;RER C;Souterraine;Hors intra-muros (Thiais);Non
Tolbiac;7;;Souterraine;Paris 13e;Non
Trinité - d'Estienne d'Orves;12;;Souterraine;Paris 9e;Non
Trocadéro;6, 9;;Souterraine;Paris 16e;Non
Tuileries;1;;Souterraine;Paris 1er;Non
Vaneau;10;;Souterraine;Paris 7e;Non
Varenne;13;;Souterraine;Paris 7e;Non
Vaugirard;12;;Souterraine;Paris 15e;Non
Vavin;4;;Souterraine;Paris 6e, Paris 14e;Non
Victor Hugo;2;;Souterraine;Paris 16e;Non
Villejuif - Gustave Roussy;14;;Souterraine;Hors intra-muros (Villejuif);Non
Villejuif - Léo Lagrange;7;;Souterraine;Hors intra-muros (Villejuif);Non
Villejuif - Louis Aragon;7;Tram T7;Souterraine;Hors intra-muros (Villejuif);Non
Villejuif - Paul Vaillant-Couturier;7;;Souterraine;Hors intra-muros (Villejuif);Non
Villiers;2, 3;;Souterraine;Paris 8e, Paris 17e;Non
Volontaires;12;;Souterraine;Paris 15e;Non
Voltaire;9;;Souterraine;Paris 11e;Non
Wagram;3;;Souterraine;Paris 17e;Non
`;

// Liens directs vers les SVG de Wikimedia
const svgLogos = {
  "M_1": "https://upload.wikimedia.org/wikipedia/commons/1/12/Paris_transit_icons_-M%C3%A9tro_1.svg",
  "M_2": "https://upload.wikimedia.org/wikipedia/commons/1/15/Paris_transit_icons-M%C3%A9tro_2.svg",
  "M_3": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Paris_transit_icons-M%C3%A9tro_3.svg",
  "M_3bis": "https://upload.wikimedia.org/wikipedia/commons/0/0c/Paris_transit_icons-M%C3%A9tro_3bis.svg",
  "M_4": "https://upload.wikimedia.org/wikipedia/commons/4/43/Paris_transit_icons-M%C3%A9tro_4.svg",
  "M_5": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Paris_transit_icons-M%C3%A9tro_5.svg",
  "M_6": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Paris_transit_icons-M%C3%A9tro_6.svg",
  "M_7": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Paris_transit_icons-M%C3%A9tro_7.svg",
  "M_7bis": "https://upload.wikimedia.org/wikipedia/commons/b/bb/Paris_transit_icons-M%C3%A9tro_7bis.svg",
  "M_8": "https://upload.wikimedia.org/wikipedia/commons/7/75/Paris_transit_icons-M%C3%A9tro_8.svg",
  "M_9": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Paris_transit_icons-M%C3%A9tro_9.svg",
  "M_10": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Paris_transit_icons-M%C3%A9tro_10.svg",
  "M_11": "https://upload.wikimedia.org/wikipedia/commons/8/8d/Paris_transit_icons-M%C3%A9tro_11.svg",
  "M_12": "https://upload.wikimedia.org/wikipedia/commons/6/65/Paris_transit_icons-M%C3%A9tro_12.svg",
  "M_13": "https://upload.wikimedia.org/wikipedia/commons/c/ce/Paris_transit_icons-M%C3%A9tro_13.svg",
  "M_14": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Paris_transit_icons-M%C3%A9tro_14.svg",
  "RER_A": "https://upload.wikimedia.org/wikipedia/commons/f/f5/Paris_transit_icons-RER_A.svg",
  "RER_B": "https://upload.wikimedia.org/wikipedia/commons/0/01/Paris_transit_icons-RER_B.svg",
  "RER_C": "https://upload.wikimedia.org/wikipedia/commons/0/03/Paris_transit_icons-RER_C.svg",
  "RER_D": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Paris_transit_icons-RER_D.svg",
  "RER_E": "https://upload.wikimedia.org/wikipedia/commons/5/58/Paris_transit_icons-RER_E.svg",
  "T_1": "https://upload.wikimedia.org/wikipedia/commons/f/f4/Paris_transit_icons-Tram_1.svg",
  "T_2": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Paris_transit_icons-Tram_2.svg",
  "T_3a": "https://upload.wikimedia.org/wikipedia/commons/f/fc/Paris_transit_icons-Tram_3a.svg",
  "T_3b": "https://upload.wikimedia.org/wikipedia/commons/5/57/Paris_transit_icons-Tram_3b.svg",
  "T_4": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Paris_transit_icons-Tram_4.svg",
  "T_5": "https://upload.wikimedia.org/wikipedia/commons/5/59/Paris_transit_icons-Tram_5.svg",
  "T_6": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Paris_transit_icons-Tram_6.svg",
  "T_7": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Paris_transit_icons-Tram_7.svg",
  "T_8": "https://upload.wikimedia.org/wikipedia/commons/4/45/Paris_transit_icons-Tram_8.svg",
  "T_9": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Paris_transit_icons-Tram_9.svg",
  "T_10": "https://upload.wikimedia.org/wikipedia/commons/8/86/Paris_transit_icons-Tram_10.svg",
  "T_11": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Paris_transit_icons-Tram_11.svg",
  "T_12": "https://upload.wikimedia.org/wikipedia/commons/6/62/Paris_transit_icons-Tram_12.svg",
  "T_13": "https://upload.wikimedia.org/wikipedia/commons/5/52/Paris_transit_icons-Tram_13.svg",
  "T_14": "https://upload.wikimedia.org/wikipedia/commons/1/19/Paris_transit_icons-_Tram_14.svg"
};

let allTerminus = [];
let allMetroLines = ["1", "2", "3", "3bis", "4", "5", "6", "7", "7bis", "8", "9", "10", "11", "12", "13", "14"];
let allRerTram = [];
let allArrondissements = [];
for (let i = 1; i <= 20; i++) {
    allArrondissements.push(`Paris ${i}${i===1?'er':'e'}`);
}
allArrondissements.push("Hors Intramuros");

function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    if(lines.length === 0) return [];
    const headers = lines[0].split(';').map(h => h.trim().replace(/^"|"$/g, ''));
    const results = [];
    
    for (let i = 1; i < lines.length; i++) {
        let rowStr = lines[i].trim();
        if (!rowStr) continue;
        const row = rowStr.split(/;(?=(?:(?:[^"]*")2)*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
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
    const lower = arrStr.toLowerCase();
    if (lower.includes("hors intra-muros") || lower.includes("hors intramuros")) {
        let parts = arrStr.split(',');
        let result = [];
        parts.forEach(p => {
            if (p.toLowerCase().includes("hors") && p.toLowerCase().includes("muros")) {
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

function loadData() {
    lignesData = parseCSV(rawLignesCSV);
    stationsData = parseCSV(rawStationsCSV);
    buildGlobalLists();
}

function getLogoHTML(val, type, isLarge = false) {
    val = val.toString().trim();
    let key = `${type}_${val}`;
    
    let url = svgLogos[key];
    let sizeClass = isLarge ? 'logo-large' : 'logo-small';
    
    if (url) {
        return `<img src="${url}" class="transit-logo ${sizeClass}" alt="Ligne ${val}" />`;
    } else {
        return `<span class="transit-logo-fallback ${sizeClass}">${val}</span>`;
    }
}

function parseRerTramLogo(val) {
    if(val.toLowerCase() === 'aucunes') return "Aucunes";
    let v = val.trim();
    
    if (v.toUpperCase().startsWith('RER ')) {
        return getLogoHTML(v.substring(4).trim(), 'RER');
    }
    if (v.toUpperCase().startsWith('TRAM T')) {
        return getLogoHTML(v.substring(6).trim(), 'T');
    }
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
        } 
        else if (qType === 1) { 
            questionText = `Cochez les terminus de cette ligne :`;
            correctAnswers = normalizeTerminusList(ligne.terminus);
            options = [...allTerminus];
            isMultiple = true;
        } 
        else if (qType === 2) { 
            questionText = `Cette ligne possède-t-elle des embranchements ?`;
            let val = (ligne.embranchements || "non").toLowerCase();
            correctAnswers = [val === "oui" ? "oui" : "non"];
            options = ["oui", "non"];
        } 
        else if (qType === 3) { 
            questionText = `Quel est le type de rames pour cette ligne ?`;
            let val = (ligne['type de rames'] || "").toLowerCase();
            correctAnswers = [val === "pneu" ? "MP (Roulement sur pneu)" : "MF (Roulements sur rail en fer)"];
            options = ["MP (Roulement sur pneu)", "MF (Roulements sur rail en fer)"];
        } 
        else { 
            questionText = `Cette ligne est-elle automatique ?`;
            let val = (ligne.automatique || "non").toLowerCase();
            correctAnswers = [val === "oui" ? "oui" : "non"];
            options = ["oui", "non"];
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
            options = [...allMetroLines];
            isMultiple = true;
            optType = 'metro';
        } 
        else if (qType === 1) {
            questionText = `Quelles lignes de RER/Tram passent par cette station ?`;
            let rawLines = (station['RER / Tram']||"").split(',').map(l=>l.trim()).filter(l=>l);
            correctAnswers = rawLines.length > 0 ? rawLines : ["aucunes"];
            options = [...allRerTram];
            isMultiple = true;
            optType = 'rer_tram';
        } 
        else if (qType === 2) { 
            questionText = `Quelle est la situation de cette station ?`;
            let sitStr = (station['Situation'] || "").toLowerCase();
            correctAnswers = [];
            if(sitStr.includes("souterraine")) correctAnswers.push("Souterraine");
            if(sitStr.includes("aérienne") || sitStr.includes("aerienne")) correctAnswers.push("Aérienne");
            if(sitStr.includes("fleur de sol")) correctAnswers.push("Fleur de sol");
            if(correctAnswers.length === 0 && sitStr) correctAnswers.push(sitStr);
            options = ["Souterraine", "Aérienne", "Fleur de sol"];
            isMultiple = true;
        } 
        else if (qType === 3) {
            questionText = `Dans quel(s) arrondissement(s) ou zone se situe cette station ?`;
            correctAnswers = normalizeArrondissements(station['Arrondissement / Localisation']);
            options = [...allArrondissements];
            isMultiple = true;
        } 
        else {
            questionText = `Cette station est-elle dans le top 20 des plus fréquentées ?`;
            let val = (station['Dans le top 20 fréquenté'] || "non").toLowerCase();
            correctAnswers = [val === "oui" ? "oui" : "non"];
            options = ["oui", "non"];
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
            alert("Erreur critique : les données n'ont pas pu être lues.");
            return;
        }
        
        currentMode = document.getElementById('lignes_ou_stations').value;
        questions = currentMode === 'lignes' ? generateLignesQuestions(10) : generateStationsQuestions(10);
        currentQuestionIndex = 0;
        score = 0;
        gameHistory = [];
        
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
                const label = document.createElement('label');
                label.className = 'checkbox-label';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = opt;
                
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
                btn.onclick = () => handleSingleChoice(opt, q, btn);
                optionsContainer.appendChild(btn);
            });
        }
    }
    
    function logHistory(q, userArr, isPerfect) {
        gameHistory.push({
            entity: q.entityHTML,
            question: q.questionText,
            user: userArr.length ? userArr : ["Aucune réponse"],
            correct: q.correctAnswers,
            isPerfect: isPerfect
        });
    }
    
    function handleSingleChoice(selected, q, btnNode) {
        const correct = q.correctAnswers[0];
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(b => b.disabled = true);
        
        const isPerfect = selected.toLowerCase() === correct.toLowerCase();
        logHistory(q, [selected], isPerfect);
        
        const feedback = document.getElementById('feedback');
        if (isPerfect) {
            btnNode.classList.add('correct');
            feedback.textContent = "✅ Excellente réponse !";
            feedback.style.color = "var(--success)";
            score++;
        } else {
            btnNode.classList.add('wrong');
            buttons.forEach(b => {
                if(b.textContent.toLowerCase() === correct.toLowerCase()) {
                    b.classList.add('correct');
                }
            });
            feedback.textContent = `❌ Dommage. La réponse était : ${correct}`;
            feedback.style.color = "var(--danger)";
        }
        btnNext.classList.remove('hidden');
    }
    
    function handleMultipleChoice(q) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        let selectedAnswers = [];
        let isPerfect = true;
        
        checkboxes.forEach(cb => {
            cb.disabled = true;
            if (cb.checked) selectedAnswers.push(cb.value);
            
            let isCorrectOption = q.correctAnswers.some(ca => ca.toLowerCase() === cb.value.toLowerCase());
            
            if (cb.checked && isCorrectOption) {
                cb.parentElement.classList.add('correct');
            } else if (cb.checked && !isCorrectOption) {
                cb.parentElement.classList.add('wrong');
                isPerfect = false;
            } else if (!cb.checked && isCorrectOption) {
                cb.parentElement.classList.add('missed');
                isPerfect = false;
            }
        });
        
        if (selectedAnswers.length !== q.correctAnswers.length) {
            isPerfect = false;
        }
        
        logHistory(q, selectedAnswers, isPerfect);
        
        const feedback = document.getElementById('feedback');
        if (isPerfect) {
            feedback.textContent = "✅ Parfait !";
            feedback.style.color = "var(--success)";
            score++;
        } else {
            feedback.textContent = `❌ Il y a des erreurs. Solution : ${q.correctAnswers.join(', ')}`;
            feedback.style.color = "var(--danger)";
        }
        
        btnNext.classList.remove('hidden');
    }
    
    btnNext.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            endGame();
        }
    });
    
    function endGame() {
        quizContainer.classList.add('hidden');
        scoreContainer.classList.remove('hidden');
        document.getElementById('final-score').textContent = `${score} / ${questions.length}`;
        
        const recapContainer = document.getElementById('recap-container');
        recapContainer.innerHTML = '';
        
        gameHistory.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = `recap-item ${item.isPerfect ? 'good' : 'bad'}`;
            
            let userStr = item.user.join(', ');
            let corrStr = item.correct.join(', ');
            
            div.innerHTML = `
                <div class="recap-q">${index + 1}. ${item.entity} <br> ${item.question}</div>
                <div class="recap-a">
                    <strong>Votre choix :</strong> <span style="color:${item.isPerfect ? 'var(--success)' : 'var(--danger)'}">${userStr}</span> <br>
                    <strong>Bonne réponse :</strong> ${corrStr}
                </div>
            `;
            recapContainer.appendChild(div);
        });
    }
    
    document.getElementById('btn-restart').addEventListener('click', () => {
        scoreContainer.classList.add('hidden');
        setupContainer.classList.remove('hidden');
    });
});
