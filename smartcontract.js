let web3;
let hashesStocker;
let hashedFile = 0;

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
  console.log(uploadForm);
  let description = uploadForm['description'].value;
  if(hashedFile != 0){
    hashesStocker.methods.uploadHash(hashedFile, description).call().then(res => {
      document.getElementById('error-upload').innerHTML = 'L\'upload a réussi : '+ res;
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
  let hash = String(retrieveForm['hash'].value);
  let resultat;
  hashesStocker.methods.descriptions(hash).call().then(res => {
    hashesStocker.methods.senderAddresses(hash).call().then(res2 => {
      document.getElementById('result').innerHTML = 'File description : ' + res + '<p></p>' + 'Issued by : ' + res2;
    });
  });
}


function hashFile(){
  let Form = document.forms['upload-form'];
  let File = Form.querySelector('input[name="File"]');

  File.addEventListener('change', function() {
    var reader = new FileReader();
    reader.addEventListener('load', function(){
      hashedFile = "0x" +keccak256(reader.result);
      console.log(hashedFile);
    })
    reader.readAsDataURL(File.files[0]);
  });
}