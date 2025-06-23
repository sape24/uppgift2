"use strict"

//skapar variablar av knapp elementen i html
let openButton = document.getElementById("open-menu")
let closeButton = document.getElementById("close-menu")


//skapar en eventlistener som lyssnar efter när användare klickar på dessa element
openButton.addEventListener('click', toggleMenu)
closeButton.addEventListener('click', toggleMenu)
//function som kollar ifall mobilmenyn visas eller inte när man trycker på respektive knapp, om den inte visas så visas den och vice versa. Den ändrar knappens css ifall display är none till block annars ändras den till none
function toggleMenu(){
    let mobileMenuEl = document.getElementById("mobilemenu")
    let style = window.getComputedStyle(mobileMenuEl)

    if(style.display === "none") {
        mobileMenuEl.style.display = "block";
    } else{
        mobileMenuEl.style.display = "none"
    }
}

window.onload = init                     //anropa init funktion när sidan laddats klart

function init(){                          
    getAPI()
}

async function getAPI(){                                   //funktion för att hämta arbetserfarenheter
    try{
        const response = await fetch(`http://localhost:3000/api/users`, {      //hämta sparad arbetserfarenhet med fetch
            
        });

        if (!response.ok){
            throw new Error ('Nätverksproblem - felaktigt svar från servern');
        }

    const data = await response.json();
    displayWorkexperience(data);                                      //anropar funktion och skickar med datana
    } catch (error){
        console.error('Det uppstod ett fel:', error.message);
    }
}

function displayWorkexperience(data){                               
    const container = document.getElementById("worklist")            
    container.innerHTML = ""

    if (data.length == 0) {                                        //om listan är tom visas ett meddelande om att inga erfarenheter finns
        container.innerHTML = "Inga arbetserfarenheter hittades"
        return
    }

    data.forEach(row => {                                        //loopar igenom arbetserfarenheter 
        const companyName = row.companyname
        const jobTitle = row.jobtitle
        const location = row.location
        const description = row.description
        const workID = row.id

        const workExperience = document.createElement("article")      
        const name = document.createElement("h1")
        name.textContent = companyName
        const title = document.createElement("p")
        title.textContent = jobTitle
        const locat = document.createElement("p")
        locat.textContent = location
        const descrip = document.createElement("p")
        descrip.textContent = description

        const deleteButton = document.createElement("button")
        deleteButton.textContent = "Radera"
        deleteButton.addEventListener("click", () => {               
            deleteWorkexperience(workID)
        })

        workExperience.appendChild(name)
        workExperience.appendChild(title)
        workExperience.appendChild(locat)
        workExperience.appendChild(descrip)                 
        workExperience.appendChild(deleteButton)

        container.appendChild(workExperience)                   
    });
}

async function deleteWorkexperience(id){                      //funktion för att ta bort arbetserfarenheter
    try{
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {         //en delete förfråga till api med ID
            method:"delete",
        });

        if (!response.ok){
            throw new Error ('Nätverksproblem - felaktigt svar från servern');
        }
    getAPI();
    } catch (error){
        console.error('Det uppstod ett fel:', error.message);
    }
}

async function addWork() {                    
    let user = {
        companyname: document.getElementById("name").value,        //skapar ett objekt med värden från förmuläret
        jobtitle: document.getElementById("title").value,            
        location:document.getElementById("location").value,            
        description:document.getElementById("description").value
    }

    if(!user.companyname || !user.jobtitle || !user.location || !user.description){      //validering om nått fält i förmuläret är tomt return så funktionen stoppas
        const error = document.getElementById("errormessage")
        error.textContent = ("Du måste fylla i alla fält!")             
        return                                                         
    }

    try{
    let response = await fetch('http://localhost:3000/api/users', {       //post förfrågan till api
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'                               //anger att det är json som skickas
    },
        body: JSON.stringify(user)                                         //user objekt blir json sträng
    });
    if (!response.ok){
            throw new Error ('Nätverksproblem - felaktigt svar från servern');
        }
    
    let data = await response.json();
    console.log(data);
    } catch (error){
        console.error('Det uppstod ett fel:', error.message);
    }
} 

document.querySelector(".form").addEventListener("submit", (event) => {        //lyssnar när formuläret skickas som vid knapptryck eller enter
    event.preventDefault()                                                   //förhindrar att sidan laddas om
    addWork()                                                                //anropar addwork funktionen 
})