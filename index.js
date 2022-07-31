import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectBtn")
const fundbutton = document.getElementById("fundBtn")
const balanceButton = document.getElementById("getBalance")
const withdrawButton = document.getElementById("withdrawBtn")

connectButton.onclick = connect
fundbutton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
  if (typeof window.ethereum !== "underfined") {
    await window.ethereum.request({ method: "eth_requestAccounts" })
    connectButton.innerHTML = "Connected"
  } else {
    connectButton.innerHTML = "Please install Metamask"
  }
}

async function getBalance() {
  if (typeof Window.ethereum != "underfined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(`Contract Balance is ${ethers.utils.formatEther(balance)} ETH`)
  }
}

async function fund(ethAmount) {
  document.getElementById("test").innerHTML = "Funded......"
  ethAmount = document.getElementById("ETHAmount").value
  console.log(`Funding with ${ethAmount} ETH`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      await listenForTransactionMine(transactionResponse, provider)
    } catch (error) {
      console.log(error)
    }
    console.log("Done")
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}.....`)

  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceit) => {
      console.log(
        `Completed with ${transactionReceit.confirmations} confirmations`
      )
      resolve()
    })
  })
}

async function withdraw() {
  console.log(`Withdrawing...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.withdraw({
        gasLimit: 21000000,
      })
      await listenForTransactionMine(transactionResponse, provider)
    } catch (error) {
      console.log(error)
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask"
  }
}
