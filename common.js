// common.js — общий код для Kindnology портала
let currentLang = 'en';
let passportsMap = null;
let currentProfit = null;

// ===================== ВСТРОЕННЫЕ ДАННЫЕ (fallback) =====================
const embeddedPassports = [
    { address: "0xae2Fc483527B8EF99EB5D9B44875F005ba1FaE13", total_profit: 14608.2297 },
    { address: "0x5B43453FCE04b92E190f391a83136bfBeCEDEFd1", total_profit: 7217.449122 },
    { address: "0x9642b23Ed1E01Df1092B92641051881a322F5D4E", total_profit: 5223.721374 },
    { address: "0x54Ba52CbD043b0B2e11A6823A910360e31BB2544", total_profit: 3670.053359 },
    { address: "0xE8832A868C091263ed190a9F4be304A03895dd91", total_profit: 1608.052646 },
    { address: "0x315D2Ee4fcCdA0def532Ef4108FF57204F8D9EbA", total_profit: 1576.888142 },
    { address: "0xd9A4Fa21dEf68E139Fa37010CF52A5a74e35Cc08", total_profit: 1555.293078 },
    { address: "0x4e9141d2Fb79b2A94a0256283f1547c7D6a12e7f", total_profit: 1175.662081 },
    { address: "0x00000027F490AcEe7F11ab5fdD47209d6422C5a7", total_profit: 1095.725769 },
    { address: "0x6809b95622B2dcC53d2F3Fb2301B36F6a8c5B584", total_profit: 929.289248 },
    { address: "0x276BF434613BD8CB5c8B3282Ec6445c9370e33FA", total_profit: 920.147058 },
    { address: "0x1380DDbF66F7d79B3715FA0a9792fD959b0b2dFe", total_profit: 822.245933 },
    { address: "0xbeccf19b026f12677e5Ce1Ce9e2D94dcc4772fEB", total_profit: 813.953153 },
    { address: "0x559432E18b281731c054cD703D4B49872BE4ed53", total_profit: 798.547464 },
    { address: "0x168470C67f1b6d6e89D0c7cb51C1AdC6b5c6Cc8A", total_profit: 664.16 },
    { address: "0xc9f5296Eb3ac266c94568D790b6e91ebA7D76a11", total_profit: 605.534434 },
    { address: "0x22B0351D445840dB59B97df3808dd642DCB17e96", total_profit: 574.791586 },
    { address: "0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97", total_profit: 540.319315 },
    { address: "0xF9b6a1EB0190bf76274B0876957Ee9F4f508Af41", total_profit: 522.93914 },
    { address: "0xeB6c4bE4b92a52e969F4bF405025D997703D5383", total_profit: 519.400557 },
    { address: "0x9359269CFBb80d154129Dd9B0074cD7336B9a3A6", total_profit: 511.259752 },
    { address: "0x93793Bd1f3e35a0Efd098c30e486A860A0ef7551", total_profit: 457.037161 },
    { address: "0x91aaE0aAfd9D2d730111b395c6871f248d7Bd728", total_profit: 439.361028 },
    { address: "0xbbDE9f0C24b6F59D7E828bb4E129992BE0cDC237", total_profit: 413.190145 },
    { address: "0x3EE92Cd00993a4488Ae153AB41ac7947cBCBC1de", total_profit: 405.852423 },
    { address: "0xE6c9adF066484Ee303deAcdD0493Bc8Da1371C8B", total_profit: 404.999932 },
    { address: "0x448166a91e7BC50D0ac720C2FBED29e0963F5af8", total_profit: 383.508162 },
    { address: "0x66c6778DEdbA51B87103c8543EE751e7Cd960659", total_profit: 382.021765 },
    { address: "0x604d23a2EBB002DF6Fdc77B82da716222ca43B8b", total_profit: 368.936969 },
    { address: "0xc4bb1B16f86388f6926Cd6467016c80AE1050CBf", total_profit: 360.056988 },
    { address: "0x930B88a592a045C428f3d99f7f3E5f95e3967508", total_profit: 358.448196 },
    { address: "0xe2e92e66B3a6C99A7fa453aa9434CF53Ff54b6c4", total_profit: 355.949012 },
    { address: "0xfc9928F6590D853752824B0B403A6AE36785e535", total_profit: 342.210516 },
    { address: "0x3EFf3Dc5A4f5c65d28E88dc8fD22800979C9E7C6", total_profit: 340.890894 },
    { address: "0xC5267F13b9B4BA7BB73BDD53A2A3C944733a2961", total_profit: 329.456672 },
    { address: "0x3d9aAE030B9661e3605b3acB5d0385EDE221a0cC", total_profit: 313.593873 },
    { address: "0xC0ffeEBABE5D496B2DDE509f9fa189C25cF29671", total_profit: 311.496574 },
    { address: "0x0BdE59981FDEaC219Ce9E618d27F193438Bff786", total_profit: 300.112339 },
    { address: "0x3e0a91dc5848E17765E3167249A2cb018cbB60Ee", total_profit: 299.154599 },
    { address: "0x264bd8291fAE1D75DB2c5F573b07faA6715997B5", total_profit: 277.220858 },
    { address: "0xBE49Bd130e126A917dDb5FaBF7cDeB6DD9887f40", total_profit: 263.478821 },
    { address: "0xd9D8F818a7A71Ed0E1fe936b991508b0E88b1609", total_profit: 262.862006 },
    { address: "0x91D40E4818F4D4C57b4578d9ECa6AFc92aC8DEbE", total_profit: 257.098009 },
    { address: "0x8357eFA84F91013Bd6b285eF0f6b93C211cC3d9d", total_profit: 241.230806 },
    { address: "0x18a3C42D492974DCb1C87362470bCd451c8718Ec", total_profit: 236.173959 },
    { address: "0xf5213a6a2f0890321712520b8048D9886c1A9900", total_profit: 226.09277 },
    { address: "0x517a67D809549093bD3Ef7C6195546B8BDF24C04", total_profit: 217.709274 },
    { address: "0xb04AaFbe155f05AEb0065411fb5d08e918ecD39D", total_profit: 216.473993 },
    { address: "0x7Bf30399dBA8051C2BF191afe2cd07eA4E064625", total_profit: 204.692033 },
    { address: "0x695624c9AaeC6a1a8B37c349EAB06E92Ad8e9Be4", total_profit: 201.664334 },
    { address: "0xAdDeC634f0bA86e788C54b306e86dda52bbeE398", total_profit: 193.157826 },
    { address: "0x12c88f64e5E35393D38255aB42858010Cbd72eBd", total_profit: 186.516919 },
    { address: "0xdBF79Adf5AF85d01fF4136cAe6E9853188941533", total_profit: 185.697973 },
    { address: "0xdc1857Ae11b2AA8b2F9DF3dC74cE7f55eD892637", total_profit: 180.0 },
    { address: "0x7830c87C02e56AFf27FA8Ab1241711331FA86F43", total_profit: 179.58631 },
    { address: "0xEB9863e28d0fC0702a5197e66674F86EE2c35b5E", total_profit: 179.313048 },
    { address: "0x974CaA59e49682CdA0AD2bbe82983419A2ECC400", total_profit: 167.883912 },
    { address: "0xC99F94635Cf84c5113D4193611E067f33E77a823", total_profit: 167.420707 },
    { address: "0xDDf725D2EbD795748DD8c6b700b7c98d1Dfb8CE5", total_profit: 160.636051 },
    { address: "0xdb3d858dCC295bE2309e69539b2De07b41D658F7", total_profit: 155.92 },
    { address: "0x974413b8C1D9eEB96758F9d4b5093ea12B3eEf54", total_profit: 155.07939 },
    { address: "0x5934E06498Db785Ff26807161CE9d09063231321", total_profit: 154.933151 },
    { address: "0x6c01050D46C98BA23d952C424FE032dC839380F5", total_profit: 154.507392 },
    { address: "0x64dDc0430EEc16DBf928e985177B5a93f4Cb3d27", total_profit: 154.410957 },
    { address: "0x2c1b3240631826Cd4f9a894A207c09b6e861dcE8", total_profit: 147.243212 },
    { address: "0x9bdbbd6FF7889e1cb668C21c5dA3c8a73A7742AE", total_profit: 144.892138 },
    { address: "0x28C6c06298d514Db089934071355E5743bf21d60", total_profit: 142.622266 },
    { address: "0x12D2b8ac38C59758a062a9f757F2740461779439", total_profit: 141.290639 },
    { address: "0xa130772609c7FA01B59bFd75aB56660c1A6Ae14A", total_profit: 139.340604 },
    { address: "0xB8FF877ed78Ba520Ece21B1de7843A8a57cA47Cb", total_profit: 137.890195 },
    { address: "0x9EE397D93c9eE2D64ED0973C93ef71fEa54b41C7", total_profit: 135.862788 },
    { address: "0xD95D7761A585bBc1B59B4B6F441B9eDc2878DAdE", total_profit: 133.148269 },
    { address: "0x3511f837687Ff7272A39a231Cac1452Ad71141Fa", total_profit: 132.332952 },
    { address: "0x26FD09c8B44AF53df38a9BAD41D5Abc55a1786AF", total_profit: 131.975785 },
    { address: "0x68c0D9a97dFcDf7De78a6063891475b60823Fdfe", total_profit: 130.669058 },
    { address: "0x3B6c26116749a6F9D194172d56299377E61bB0aE", total_profit: 127.619048 },
    { address: "0xF77f53C7C2f930B5FAC7E00A99f94AB3639533E7", total_profit: 126.985508 },
    { address: "0xdaC39DF012c81b2cBCba4FED9Ecb30822dC9f10d", total_profit: 126.3 },
    { address: "0x339d413CCEfD986b1B3647A9cfa9CBbE70A30749", total_profit: 122.787289 },
    { address: "0x1dC89aB25Ab5D8714Fcf9eE4bD9c9a58dEbEB4d8", total_profit: 119.595947 },
    { address: "0x3787fE53F56d05576912914e348B3c81B95FA485", total_profit: 118.082893 },
    { address: "0x055854daBe7Deb658E62D3e93F31Cb59CAA8D226", total_profit: 117.918832 },
    { address: "0x19C77B18eF49ab6ad2e16c3C42eb98Aa78d0Bf14", total_profit: 115.418194 },
    { address: "0xFbFF53e5fEc6A107EB6C5708846D326A595c12b8", total_profit: 113.818026 },
    { address: "0xAdc26Ec3D7fdcc3332e67fD74CB8Df7F475A3706", total_profit: 113.331115 },
    { address: "0xE83F75907Fb4c575414FA6F5cfe8cef24Dc5870C", total_profit: 112.239409 },
    { address: "0x109681B2489354903b968E555C4bfe7552596288", total_profit: 110.324094 },
    { address: "0x732101354af9A6E5bb40024835A748958c091dED", total_profit: 110.142075 },
    { address: "0x828D76e33b9Db71538b167a1E3Cc988ba9ac4b22", total_profit: 107.991661 },
    { address: "0x7F881d3EA884051Dfa36DCf68Fa879Dc83A9fc85", total_profit: 107.594798 },
    { address: "0xd611CC7512952ebf8d1C70E4161bBD68616920bb", total_profit: 107.455903 },
    { address: "0xBcE22b93DC1D03b6081bdB57a85A3A9e3F657A22", total_profit: 105.53499 },
    { address: "0x607AaeBEcE105255bE33C4B5F1f696f3a1776D29", total_profit: 102.048224 },
    { address: "0x5BC099567ffcA406ef32f6a343B0f957DEAd7777", total_profit: 101.667179 },
    { address: "0xFe44DAeb65166846fccb3f4aA7186e36247b1C1E", total_profit: 101.25 },
    { address: "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d", total_profit: 101.157967 },
    { address: "0x39419e2F124a2BFf928c64494BFF67bAE96C83D3", total_profit: 101.123645 },
    { address: "0x646f8870fBBfEf4eAb416e8Ed46e787a842F98c4", total_profit: 100.0 }
];

// ===================== ЗАГРУЗКА PASSPORTS (сначала из файла, потом fallback) =====================
async function loadPassports() {
    if (passportsMap) return passportsMap;
    try {
        console.log("🔍 Загружаю passports.csv...");
        const response = await fetch('passports.csv');
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const text = await response.text();
        console.log("✅ Файл загружен, парсим...");
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
        console.log(`✅ Загружено ${uniqueCount} операторов из CSV, суммарный опыт ${totalProfitSum.toFixed(0)} ETH`);
        passportsMap = map;
        updateStatsUI(uniqueCount, totalProfitSum);
        return map;
    } catch (err) {
        console.warn("❌ Не удалось загрузить passports.csv, использую встроенные данные:", err);
        // Используем встроенные данные
        const map = new Map();
        let totalProfitSum = 0;
        for (const row of embeddedPassports) {
            map.set(row.address.toLowerCase(), row.total_profit);
            totalProfitSum += row.total_profit;
        }
        const uniqueCount = embeddedPassports.length;
        passportsMap = map;
        updateStatsUI(uniqueCount, totalProfitSum);
        return map;
    }
}

function updateStatsUI(uniqueCount, totalProfitSum) {
    const invitedEl = document.getElementById('invitedCount');
    const expEl = document.getElementById('totalExperience');
    if (invitedEl) invitedEl.innerText = uniqueCount.toLocaleString();
    if (expEl) expEl.innerText = totalProfitSum.toFixed(0).toLocaleString();
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