/* Copyright (C) 2018 Elkael Maxime

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA. */

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