let web3;
let hashesStocker;
let hashedFile = 0;

/*Works properly*/
function checkContract() {
  let confForm = document.forms['conf-form'];
  let address = confForm['network-address'].value || 'http://localhost:8545';
  let contractAddress = confForm['contract-address'].value;

  web3 = new Web3(new Web3.providers.HttpProvider(address));

  if (!web3.utils.isAddress(contractAddress)) {
    document.getElementById('error-config').innerHTML = `Adresse ${contractAddress} invalide`;
    return;
  }

  web3.eth.getCode(contractAddress).then(res => {
    if (res == '0x') {
      document.getElementById('error-config').innerHTML = `Contrat intelligent introuvable à l'adresse ${contractAddress}`;
      return;
    }

    web3.eth.getAccounts().then(accounts => {

      hashesStocker = new web3.eth.Contract(JSON.parse(abi), contractAddress);
      web3.eth.defaultAccount = accounts[0];

    }, err => {
      document.getElementById('error-config').innerHTML = `Réseau Ethereum <strong>${address}</strong> introuvable`;
    });
  });
}

function uploadHash(){
  let uploadForm = document.forms['upload-form'];
  let description = uploadForm['description'].value;
  if(hashedFile != 0){
    hashesStocker.methods.uploadHash(hashedFile, description).send({from: web3.eth.defaultAccount}).then(res => {
      document.getElementById('error-upload').innerHTML = 'L\'upload a réussi : ' + hashedFile;
    }), err => {    
      document.getElementById('error-upload').innerHTML = 'L\'upload a échoué';
    }
  }
  else{
    document.getElementById('error-upload').innerHTML = 'Veuillez attendre la génération du hash de votre fichier';
  }
}

function getHash() {
  let retrieveForm = document.forms['retrieve-form'];
  let hash = retrieveForm['hash'].value;
  let resultat;
  hashesStocker.methods.getHash(hash).call().then(res => {
    console.log(res);
    document.getElementById('result').innerHTML = "Hash : " + res[2] + "<br/>" + "Emitting address : " + res[0] + "<br/>" +"Description : " + res[1];
  });
}


function hashFile(){
  let Form = document.forms['upload-form'];
  let File = Form.querySelector('input[name="File"]');

  File.addEventListener('change', function() {
    var reader = new FileReader();
    reader.addEventListener('load', function(){
      hashedFile = keccak256(reader.result);
    })
    reader.readAsDataURL(File.files[0]);
  });
}
/*
// Select all links with hashes
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });*/