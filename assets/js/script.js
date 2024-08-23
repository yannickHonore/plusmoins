// On va chercher les boutons
let startButtons = document.querySelector("#startButtons").querySelectorAll("button");

// On ajoute les écouteurs au click pour démarer le jeu
startButtons.forEach(function(button){
  button.addEventListener("click", startGame);
});

// On défini la variable qui contiendra la partie de jeu
let game;

/**
 * Fonction permetant de lancer le jeu
 * @param {event} e Evenement
 */
function startGame(e){
  // On va chercher la valeur max
  let max = e.target.dataset.max;

  // On affiche la valeur max que l'on doit trouver
  document.querySelector("#max").innerText = max;

  // On défini la valeur max qui peut etre entré dans le formulaire
  document.querySelector("#value").setAttribute("max", max);

  // On crée un objet jeu
  game = new Game(max);

  // On lance le jeu
  game.startGame();
}

/**
 * Class objet du jeu
 */
class Game{
  // On défini les attribue privé
  #find = 0;
  #max = 0;
  #essai = 0;
  #isFinish = false;

  /**
   * Constructeur permetant de défini la valeur à trouver
   * @param {int} max Valeur maximum à trouver
   */
  constructor(max){
    let find = Math.round(Math.random() * max);
    this.#find = find;
    this.#max = max;
  }

  /**
   * Méthode qui gére le jeu
   */
  startGame(){
    // On affiche le formulaire
    let form = document.querySelector("#form");
    form.style.display = "block";

    // On vide le contenu du formulaire
    document.querySelector("#value").value = "";

    // Vide le contenue de la section indice et de la div proposition
    document.querySelector("#indice").innerText = "";
    document.querySelector("#proposition").innerHTML = "";

    // On affiche la section proposition
    let oldValue = document.querySelector("#oldValue");
    oldValue.setAttribute("style", "display : block;");

    // On cache les boutons de choix de niveau
    let startButtons = document.querySelector("#startButtons");
    startButtons.style.display = "none";

    // On gére le bouton abandonnée
    let cancelButton = document.querySelector("#cancel");
    cancelButton.addEventListener("click", (e) => {this.#endGame(); document.querySelector("#proposition").innerHTML = "";});

    // On gére le bouton vérifier
    let submitButton = document.querySelector("#submit");
    submitButton.addEventListener("click", (e) => {
      // On vérifie que la partie n'est pas terminé
      if(!this.#isFinish){
        // On vérifie la valeur
        this.#check(e);
      }
    });
  }

  /**
   * Permet de vérifier si la valeur est plus grande, plus petite ou égale à celle que l'on doit trouver
   * @param {event} e Evenement
   */
  #check(e){
    // On annule le rechargement de la page au click
    e.preventDefault();

    // On va chercher la valeur qui à été entré
    let value = document.querySelector("#value").value;

    // On vérifie que l'on n'a pas un champ vide
    if(value === ""){
      // On vide le contenu du formulaire
      document.querySelector("#value").value = "";
      this.#badTypeOfValue(this.#max);
      return;
    }

    // On transforme la string en integer
    value = parseInt(value, 10);

    // On vérifie que la valeur entré ce trouve dans l'interval donnée
    if(value > this.#max){
      this.#badValue(this.#max);
      return;
    }

    // On vérifie que la valeur entré est un nombre positif
    if(value < 0){
      this.#badValue(this.#max);
      return;
    }

    // On vérifie que l'on a que des chiffres qui sont entré
    if(/\D+/.test(value)){
      // On remet à 0 le contenu du formulaire
      document.querySelector("#value").value = "";

      this.#badTypeOfValue(this.#max);
      return;
    }

    // On incrémente l'essai
    this.#essai++;

    // On affiche les valeurs déjà proposé
    this.#addValue(value);

    // On test si la valeur est plus grande, plus petite ou égale à celle qui doit etre trouvé
    if(value > this.#find){
      this.#displayLess(value);
    }else if(value < this.#find){
      this.#displayMore(value);
    }else if(value == this.#find){
      this.#displayWin(value);
      this.#endGame();
    }
  }

  #badValue(max){
    // On va chercher la section indice
    let indice = document.querySelector("#indice");

    // On affiche le message
    indice.innerText = `La valeur à trouver doit être comprise entre 0 et ${max}`;
  }

  #badTypeOfValue(){
    // On va chercher la section indice
    let indice = document.querySelector("#indice");

    // On affiche le message
    indice.innerText = "La valeur à entrer ne doit pas être vide et doit être composé uniquement de chiffres";
  }

  #addValue(value){
    // On va chercher la section proposition
    let proposition = document.querySelector("#proposition");
    
    // On défini la hauteur max de la div proposition
    proposition.setAttribute("style", `max-height : ${window.innerHeight - proposition.offsetTop}px;`);

    // On crée une nouvelle balise <p>
    let p = document.createElement("p");

    // On ajoute le message
    p.innerText = `Essai ${this.#essai} : ${value}`;

    proposition.appendChild(p);
    
  }

  #displayMore(value){
    // On va chercher la section indice
    let indice = document.querySelector("#indice");

    // On affiche le message
    indice.innerText = `La valeur à trouver est plus grande que ${value}`;
  }

  #displayLess(value){
    // On va chercher la section indice
    let indice = document.querySelector("#indice");

    // On affiche le message
    indice.innerText = `La valeur à trouver est plus petite que ${value}`;
  }

  #displayWin(value){
    // On va chercher la section indice
    let indice = document.querySelector("#indice");

    // On affiche le message
    indice.innerText = `Bravo, vous avez trouvé la bonne valeur "${this.#find}" en ${this.#essai} essais`;
  }

  /**
   * Permet de mettre fin au jeu
   */
  #endGame(){
    // On cache le formulaire
    let form = document.querySelector("#form");
    form.style.display = "none";

    // On cache les proposition
    document.querySelector("#oldValue").removeAttribute("style");

    // On affiche les boutons de choix de niveau
    let startButtons = document.querySelector("#startButtons");
    startButtons.style.display = "flex";

    // On remet à 0 le contenu du formulaire
    document.querySelector("#value").value = "";

    // On remet le conpteur à 0
    this.#find = 0;
    this.#max = 0
    this.#essai = 0;

    // On signale que la partie est fini
    this.#isFinish = true;

    // On vide la variable game
    game = undefined;
  }
}