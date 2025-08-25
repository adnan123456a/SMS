  let loaderHtml = "";
    const container = document.querySelector(".msge-container");
    const namePath = window.location.pathname;
    let EveryMessage =JSON.parse(localStorage.getItem(`${namePath}`)) ||[] 
    let yourname = JSON.parse(localStorage.getItem("Alu"));
    if(!yourname) {
    yourname = prompt("Hey What's your name?") ;
      localStorage.setItem("Alu",JSON.stringify(yourname));  
    }
    if (yourname) {
  const socket = io(); 
  // create a socket connection
  const send = document.querySelector('.send');
  const input = document.querySelector('.input');
  send.addEventListener('click',()=>{
  // Send Mesge 
  msgeSent(socket,input)
  })
  } 
  document.body.addEventListener('keydown',(e)=>{
    if (e.key === "Enter") {
        //Send Msge 
        msgeSent(socket,input);
    }
  })
  const socket = io(); 
  socket.on('broadcast',msge =>{
    EveryMessage.push(msge);
    localStorage.setItem(`${namePath}`,JSON.stringify(EveryMessage));
    msgeShow ();
})

  msgeShow ()
  function msgeShow () {
    if(EveryMessage.length === 0) {
        console.log("You don't have Any Message")
    }
    else {
        EveryMessage.forEach(value => {
            if(yourname === value.name) {
                loaderHtml += `
                 <div class="myDiv">
                <div class="myMsge">
                <h3>${value.name}</h3>
                <p>${value.msge}</p>
            </div>
            </div>
                `
            }
            else {
                loaderHtml += `
                     <div class="hisDis">
                <div class="hisMsge">
                 <h3>${value.name}</h3>
                <p>${value.msge}</p>
            </div>
            </div>
                `
            }
        });
        container.innerHTML = loaderHtml;
        container.scrollTop = container.scrollHeight; // Scrolls down means sweap up so top
        loaderHtml = "";
    }
  }

//Sent Message 
function msgeSent(socket,input) {
       const message = input.value ;
    const body = {
        name:yourname,
        msge:message,
    }
   socket.emit('user-message',body);
   input.innerHTML = ``;
   input.value = ``;
}
