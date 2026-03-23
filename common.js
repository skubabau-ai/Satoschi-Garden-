// common.js — общий код для Kindnology портала
let currentLang = 'en';
let passportsMap = null;
let currentProfit = null;

// ------------------- Загрузка passports.csv -------------------
async function loadPassports() {
    if (passportsMap) return passportsMap;
    try {
        console.log("🔍 Загружаю passports.csv...");
        const response = await fetch('passports.csv');
        console.log("📡 Статус ответа:", response.status);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const text = await response.text();
        console.log("📄 Текст CSV (первые 200 символов):", text.slice(0,200));
        const lines = text.split('\n').filter(l => l.trim());
        const map = new Map();
        let totalProfitSum = 0;
        let uniqueCount = 0;
        for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(',');
            if (parts.length >= 2) {
                const addr = parts[0].toLowerCase();
                const profit = parseFloat(parts[1]);
                if (!isNaN(profit)) {
                    map.set(addr, profit);
                    totalProfitSum += profit;
                    uniqueCount++;
                }
            }
        }
        console.log(`✅ Загружено операторов: ${uniqueCount}, суммарный опыт: ${totalProfitSum.toFixed(0)} ETH`);
        if (document.getElementById('invitedCount')) {
            document.getElementById('invitedCount').innerText = uniqueCount.toLocaleString();
            document.getElementById('totalExperience').innerText = totalProfitSum.toFixed(0).toLocaleString();
        }
        passportsMap = map;
        return map;
    } catch (err) {
        console.error("❌ Ошибка загрузки passports.csv:", err);
        if (document.getElementById('passportsStatus')) {
            document.getElementById('passportsStatus').innerHTML = '⚠️ Could not load passports.csv';
        }
        return null;
    }
}

async function getProfit(address) {
    const map = await loadPassports();
    if (!map) return null;
    const addr = address.toLowerCase();
    return map.get(addr) || null;
}

// ------------------- Обновление формы по адресу -------------------
async function updateFromAddress(address) {
    const addr = address.trim().toLowerCase();
    if (!addr || !addr.startsWith('0x')) {
        if (document.getElementById('taxContainer')) document.getElementById('taxContainer').style.display = 'none';
        if (document.getElementById('profitInput')) document.getElementById('profitInput').value = '';
        currentProfit = null;
        return;
    }
    const profit = await getProfit(addr);
    if (profit !== undefined && profit !== null) {
        currentProfit = profit;
        if (document.getElementById('profitInput')) document.getElementById('profitInput').value = profit.toFixed(4);
        if (document.getElementById('displayProfit')) document.getElementById('displayProfit').innerText = profit.toFixed(4) + ' ETH';
        const tax = profit * 0.15;
        if (document.getElementById('taxAmount')) document.getElementById('taxAmount').innerText = tax.toFixed(4) + ' ETH';
        if (document.getElementById('taxContainer')) document.getElementById('taxContainer').style.display = 'block';
    } else {
        if (document.getElementById('profitInput')) document.getElementById('profitInput').value = 'Not found in passports';
        if (document.getElementById('taxContainer')) document.getElementById('taxContainer').style.display = 'none';
        currentProfit = null;
    }
}

// ------------------- Языковой переключатель -------------------
function setLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-en]').forEach(el => {
        const attr = el.getAttribute('data-' + lang);
        if (attr !== null) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                const placeholderAttr = el.getAttribute('data-' + lang + '-placeholder');
                if (placeholderAttr !== null) el.placeholder = placeholderAttr;
                else el.value = attr;
            } else {
                el.innerText = attr;
            }
        }
    });
    document.querySelectorAll('#pathSelect option').forEach(opt => {
        const attr = opt.getAttribute('data-' + lang);
        if (attr !== null) opt.innerText = attr;
    });
    const cardIds = ['card1', 'card2', 'card3'];
    cardIds.forEach(id => {
        const card = document.getElementById(id);
        if (card) {
            const titleAttr = card.getAttribute('data-' + lang + '-title');
            if (titleAttr) card.setAttribute('title', titleAttr);
        }
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

// ------------------- Web3 / MetaMask (заглушка) -------------------
let provider, signer, kindContract, gardenContract;
const KIND_ADDRESS = "0xcd9CCd6C9DA89bE6f0CaCec4a5041eC0406C63F4";
const GARDEN_ADDRESS = "0x5b7AaFAEC25e23b27B02FD3D74C417Ed9C519452";
const KIND_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 value) returns (bool)",
    "function transferFrom(address from, address to, uint256 value) returns (bool)",
    "function transfer(address to, uint256 value) returns (bool)"
];
const GARDEN_ABI = [
    "function depositETH() external payable",
    "function subscribe(uint256 months) external",
    "function mintWillkomm() external",
    "function exchangeRate() view returns (uint256)",
    "function subscriptionPrice() view returns (uint256)",
    "function kindToken() view returns (address)"
];

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            kindContract = new ethers.Contract(KIND_ADDRESS, KIND_ABI, signer);
            gardenContract = new ethers.Contract(GARDEN_ADDRESS, GARDEN_ABI, signer);
            return await signer.getAddress();
        } catch (error) {
            console.error(error);
            return null;
        }
    } else {
        alert('MetaMask not installed.');
        return null;
    }
}

async function startJourney(address, profit, contribution, subscription, path, reason) {
    if (!signer) {
        const addr = await connectWallet();
        if (!addr) {
            alert('Please connect MetaMask.');
            return false;
        }
        if (addr.toLowerCase() !== address.toLowerCase()) {
            alert('Please use the same wallet as the address entered.');
            return false;
        }
    }
    try {
        const exchangeRate = await gardenContract.exchangeRate();
        const subscriptionKind = 10;
        const ethNeeded = contribution + (subscriptionKind * (1 / (exchangeRate / 1e18)));
        const ethWei = ethers.utils.parseEther(ethNeeded.toFixed(18));
        const tx1 = await gardenContract.depositETH({ value: ethWei });
        await tx1.wait();
        const kindAmount = ethers.utils.parseUnits('10', 18);
        const approveTx = await kindContract.approve(GARDEN_ADDRESS, kindAmount);
        await approveTx.wait();
        const subscribeTx = await gardenContract.subscribe(1);
        await subscribeTx.wait();
        const mintTx = await gardenContract.mintWillkomm();
        await mintTx.wait();
        alert('🎉 You are now a gardener! Welcome to the Kindnology Garden.');
        return true;
    } catch (err) {
        console.error(err);
        alert('Transaction failed: ' + (err.message || err));
        return false;
    }
}

// ------------------- Экспорт для использования в других скриптах (необязательно) -------------------
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { connectWallet, loadPassports, getProfit, setLanguage, startJourney, updateFromAddress };
}