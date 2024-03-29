// import { bakeryNames } from "./bakeryNames.js";
import { grandmaNames } from "./grandmaNames.js";
import { upgradesInfo } from "./upgradesInfo.js";
import { comments } from "./comments.js";



let totalCookies = 0;

// LOAD DATA FROM LOCALSTORAGE
let onLoadBakeryName;
if(
    localStorage.getItem('bakeryName') &&
    localStorage.getItem('cookieCount') &&
    localStorage.getItem('totalCookieCount') &&
    !isNaN(localStorage.getItem('cookieCount')) &&
    !isNaN(localStorage.getItem('totalCookieCount'))
    ){
        onLoadBakeryName = localStorage.getItem('bakeryName');
        totalCookies = parseInt(localStorage.getItem('totalCookieCount'));
        loadDataFromStorage();
}

function loadDataFromStorage(){
    window.addEventListener('load', () => {
        // Cookie count
        instaCookieCount = parseInt(localStorage.getItem('cookieCount'));
        cookieCount = parseInt(localStorage.getItem('cookieCount'));

        cookieCountText.innerText = formatNum(instaCookieCount);
        
        // All functions to update game
        checkEnabledItems();
        showChangedPrize();

        // Buildings
        let storageBuildings = JSON.parse(localStorage.getItem('buildingsArr'));
        
        if(storageBuildings !== null){
            storageBuildings.forEach((storageBuilding, index) => {
                if(storageBuilding > 0){
                    for (let i = 0; i < storageBuilding; i++) {
                        let buildingsArray = Array.prototype.slice.call(buildings());
    
                        let currentStorageBuilding = buildingsArray[index];                    
    
                        let infoPrizeText = currentStorageBuilding.querySelector('.info__prizeText');
                        let descPrizeText = currentStorageBuilding.querySelector('.desc__count');
                        let itemCountText = currentStorageBuilding.querySelector('.item__count');
    
                        buyBuilding(buildingsArray[index], buildCountArr[index], index);
    
                        if(runningCookieInterval === true) disableCookieInterval = true;
    
                        // Prize
                        let minusCookies = Math.round(buildPrizesArr[index] / 5);
                        buildPrizesArr[index] += minusCookies;
                        
                        infoPrizeText.innerText = formatNum(buildPrizesArr[index]);
                        descPrizeText.innerText = formatNum(buildPrizesArr[index]);
                        
                        // Count
                        buildCountArr[index]++;
                        itemCountText.innerText = buildCountArr[index];
                    }
                }
            })
        }

        showUpgrades();
        checkItemPrize();
        checkUpgradePrize();


        // Upgrades
        let storageUpgrades = JSON.parse(localStorage.getItem('upgradesArr'));

        if(storageUpgrades !== null){
            storageUpgrades.forEach((storageUpgrade) => {
                let storageUpgradeType = storageUpgrade.upgradeType;
                let storageUpgradeNumber = storageUpgrade.upgradeNumber;
    
                let currentStorageUpgrade = document.querySelector(`[data-type="${storageUpgradeType}"][data-index="${storageUpgradeNumber}"]`);
    
                // Buy upgrade
                let currentBuilding = buildings()[storageUpgradeType];
                let currentUpgradeName = upgradesInfo[storageUpgradeType].type;
                let currentUpgradeNameUpper = currentUpgradeName.charAt(0).toUpperCase() + currentUpgradeName.slice(1)
                let productionPerText = currentBuilding.querySelector('.desc__info span');
    
                if(runningCookieInterval === true) disableCookieInterval = true;
    
                buildingsPerSecond[storageUpgradeType] += buildingsPerSecond[storageUpgradeType];
    
                productionPerText.innerText = buildingsPerSecond[storageUpgradeType];

                if(storageUpgradeType == 0){
                    cookieClickStep *= 2;
                }
    
                setUpgradeInterval(currentUpgradeNameUpper, storageUpgradeType);
    
                boughtUpgrades.push({upgradeType: storageUpgradeType, upgradeNumber: storageUpgradeNumber});
    
                currentStorageUpgrade.remove();
            })
        }
    })
}




// AUDIO
let clickInSound = new Audio('./res/img/sounds/clickIn.mp3');
let clickOutSound = new Audio('./res/img/sounds/clickOut.mp3');
let buildingClickInSound = new Audio('./res/img/sounds/buildingClickIn.mp3');
let buildingClickOutSound = new Audio('./res/img/sounds/buildingClickOut.mp3');
let tickInSound = new Audio('./res/img/sounds/tick.mp3');
let tickOutSound = new Audio('./res/img/sounds/tickOff.mp3');
let buySound = new Audio('./res/img/sounds/buy.mp3');
let sellSound = new Audio('./res/img/sounds/sell.mp3');

clickInSound.volume = 0.16;
clickOutSound.volume = 0.16;
buildingClickInSound.volume = 0.35;
buildingClickOutSound.volume = 0.3;
tickInSound.volume = 0.3;
tickOutSound.volume = 0.3;
buySound.volume = 0.35;
sellSound.volume = 0.4;

// GAME
const cookie = document.querySelector('.cookie__img');
const cookieContainer = document.querySelector('.cookie');
const cookieCountText = document.querySelector('.cookie__count');
let cookieCount = 0;
let instaCookieCount = 0;

// FORMAT NUMBERS
function formatNum(num){
    let lookup = [
        { value: 1, symbol: ""},
        { value: 1e6, symbol: " milion"},
        { value: 1e9, symbol: " billion"},
        { value: 1e12, symbol: " trillion"},
        { value: 1e15, symbol: " quadrillion"},
        { value: 1e18, symbol: " quantillion"},
        { value: 1e21, symbol: " sextillion"},
        { value: 1e24, symbol: " septillion"},
        { value: 1e27, symbol: " octillion"},
        { value: 1e30, symbol: " nonillion"},
        { value: 1e33, symbol: " decillion"},
        { value: 1e36, symbol: " undecillion"},
        { value: 1e39, symbol: " duodecillion"},
        { value: 1e42, symbol: " tredecillion"},
        { value: 1e45, symbol: " quattuordecillion"},
        { value: 1e48, symbol: " quindecillion"},
        { value: 1e51, symbol: " sexdecillion"},
        { value: 1e54, symbol: " septendecillion"},
        { value: 1e57, symbol: " octodecillion"},
        { value: 1e60, symbol: " novemdecillion"},
        { value: 1e63, symbol: " vigintillion"},
        { value: 1e303, symbol: " centillion"},
    ];

    let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

    let item = lookup.slice().reverse().find((item) => {
        return num >= item.value;
    });

    if(num < 1e6){
        return num.toLocaleString('en-Us');
    }
    else if(item){
        return (num / item.value).toFixed(3).replace(rx, "$1") + item.symbol;
    }
    else{
        return "0";
    }
}


// Cookie hover animation
cookie.addEventListener('mouseenter', () => {
    cookie.style.animation = "cookieHoverIn 550ms linear forwards";
})

cookie.addEventListener('mouseleave', () => {
    cookie.style.animation = "cookieHoverOut 500ms linear forwards";
})

// Cookie upgrade cursor around cookie
const cookieUpgradeContainer = document.querySelector('.cookie__upgradesContainer');
let cookieSize = 256;
let numberOfBoxes = 20;
let cookieId = 0;

createCursors();

function createCursors(){
    // Create boxes for cursors
    for (let i = 0; i < numberOfBoxes; i++) {
        let newCursorBx = document.createElement("div");
        newCursorBx.classList.add('cookie__upgradesBx');
    
        cookieUpgradeContainer.appendChild(newCursorBx);
    }

    let cookieUpgradeBxs = document.querySelectorAll('.cookie__upgradesBx');
    
    cookieUpgradeBxs.forEach((cookieUpgradeBx, cookieIndex) => {
        // Create cursors
        let numberOfCursors = 50 + (cookieIndex * 2);

        let div = 360 / numberOfCursors;
        let radius = 150 + (cookieIndex * 20);
        let offsetToParentCenter = parseInt(cookieUpgradeBx.offsetWidth / 2);//assumes parent is square
        let offsetToChildCenter = 10;
        let totalOffset = offsetToParentCenter - offsetToChildCenter;
        let angles = [285];
        let angleStep = 360 / (numberOfCursors + 1);
        let index = 0;
    
        for (let i = 0; i < numberOfCursors; i++) {
            index++
            let newImg = document.createElement('img');
            newImg.src = "./res/img/cursor-pointer.png";
            newImg.setAttribute('draggable', "false");
            newImg.classList.add("cookie__upgrade", `id${cookieId}`);
            cookieUpgradeBx.appendChild(newImg);
            
            let y = Math.sin((div * index) * (Math.PI / 180)) * radius;
            let x = Math.cos((div * index) * (Math.PI / 180)) * radius;
            newImg.style.top = (y + totalOffset).toString() + "px";
            newImg.style.left = (x + totalOffset).toString() + "px";
            
            newImg.style.rotate = angles[i] + "deg";
            newImg.style.display = "none";
            angles.push((angles[i] + angleStep) % 360);
            cookieId++;
        }

        let allCursorsInBx = cookieUpgradeBx.querySelectorAll('.cookie__upgrade');
        let cursorsIndex = 0;
        let halfCursorIndex = Math.round(allCursorsInBx.length / 2);

        allCursorsInBx[cursorsIndex].classList.add('active');
        allCursorsInBx[halfCursorIndex].classList.add('active');

        setInterval(() => {
            allCursorsInBx[cursorsIndex].classList.remove('active');
            allCursorsInBx[halfCursorIndex].classList.remove('active');

            cursorsIndex++;
            halfCursorIndex++;

            if(cursorsIndex === allCursorsInBx.length) cursorsIndex = 0;
            if(halfCursorIndex === allCursorsInBx.length) halfCursorIndex = 0;

            allCursorsInBx[cursorsIndex].classList.add('active');
            allCursorsInBx[halfCursorIndex].classList.add('active');
        }, 300);
    })

    // document.querySelector('.cookie__upgrade.id0').style.display = "block";
}

// Mooving upgrade description
function updateMoovingUpgradeDesc(){
    const buildingUpgradeBx = document.querySelectorAll('.upgrade__bx');
    
    buildingUpgradeBx.forEach((upgrade) => {
        let upgradeDesc = upgrade.querySelector('.item__desc');
    
        upgrade.addEventListener('mouseenter', (e) => {
            upgradeDesc.style.display = "block";
    
            if(e.clientY <= 166){
                upgradeDesc.style.top = 0 + "px";
            }
            else{
                upgradeDesc.style.top = (e.clientY - 165) + "px";
            }
        })
    
        upgrade.addEventListener('mousemove', (e) => {
    
            if(e.clientY <= 166){
                upgradeDesc.style.top = 0 + "px";
            }
            else{
                upgradeDesc.style.top = (e.clientY - 165) + "px";
            }
        })
    
        upgrade.addEventListener('mouseleave', () => {
            upgradeDesc.style.display = "none";
        })
    })
}


// BAKERY NAME - GENERATE AND CHANGE
const bakeryNameBx = document.querySelector('.cookie__name');
const bakeryName = document.querySelector('.cookie__bakeryName');
const customBakery = document.querySelector('.customBakeryName');
const customBInput = document.querySelector('.custom__input');
const customSubmitBtn = document.querySelector('.custom__btn.customSubmit');
const customRandomBtn = document.querySelector('.custom__btn.customRandom');
const customEscBtn = document.querySelector('.custom__btn.customEsc');
const customCloseIcon = document.querySelector('.custom__close');
const customBakeryError = document.querySelector('.custom__error');

function randomBakeryName(){
    let firstHalfName = ["Kouzelná", "Fantastická", "Luxusní", "Troufalá", "Elegantní", "Hezká", "Rozkošná", "Pirátská", "Ninjovská", "Zombie", "Robotí", "Radikální", "Městská", "Super", "Pořádná", "Sladká", "Děsná", "Dvojitá", "Trojitá", "Turbo", "Techno", "Disko", "Elektro", "Tančící", "Divotvorná", "Mutantí", "Vesmírná", "Vědecká", "Středověká", "Budoucí", "Kapitánská", "Vousatá", "Rozmilá", "Maličká", "Veliká", "Ohnivá", "Vodní", "Zmrzlá", "Kovová", "Plastová", "Pevná", "Tekutá", "Plesnivá", "Blýskavá", "Šťastná", "Šťastná malá", "Slizká", "Chutná", "Delikátní", "Hladová", "Chamtivá", "Smrtonosná", "Profesorská", "Doktorská", "Mocná", "Čokoládová", "Drobivá", "Čoklitová", "Spravedlivá", "Slavná", "Mnemonická", "Psychická", "Šílená", "Uspěchaná", "Bláznivá", "Královská", "El", "Von"]
    let secondHalfName = ["Keks", "Sušenka", "Muffin", "Koláček", "Dortík", "Palačinka", "Střípek", "Rozeta", "Aparát", "Loutka", "Palčák", "Ponožka", "Konvice", "Záhada", "Pekař", "Kuchař", "Babička", "Klik", "Klikač", "Raketa", "Továrna", "Portál", "Stroj", "Experiment", "Příšera", "Panika", "Lupič", "Bandita", "Kořist", "Brambora", "Pizza", "Burger", "Klobása", "Karbanátek", "Špageta", "Makaron", "Koťátko", "Štěňátko", "Žirafa", "Zebra", "Papoušek", "Delfín", "Kachňátko", "Lenochod", "Želva", "Goblin", "Skřítek", "Gnóm", "Počítač", "Pirátská", "Ninjovská", "Zombie", "Robotí"]

    let firstNameNum = Math.round(Math.random() * firstHalfName.length);
    let secondNameNum = Math.round(Math.random() * secondHalfName.length);

    let randomCombineBakeryName = firstHalfName[firstNameNum] + " " + secondHalfName[secondNameNum];

    return randomCombineBakeryName;
};

if(!onLoadBakeryName){
    onLoadBakeryName = randomBakeryName();
    localStorage.setItem('bakeryName', onLoadBakeryName);
}

let newBakeryName;
bakeryName.innerText = onLoadBakeryName;


// Bakery event listeners
bakeryNameBx.addEventListener('click', () => {
    tickInSound.play();
    customBakery.style.animation = "fadeIn 200ms ease-in-out forwards";
    newBakeryName ? customBInput.value = newBakeryName : customBInput.value = onLoadBakeryName;

    setTimeout(() => {
        customBInput.focus();
        customBInput.select();
    }, 20);

    document.body.addEventListener('keydown', checkBakeryEsc);
})

customBakery.addEventListener('click', (e) => {
    if(e.target === customBakery){
        customBakeryEsc();
    }
})

customEscBtn.addEventListener('click', () => {
    tickOutSound.play();
    customBakeryEsc();
});
customCloseIcon.addEventListener('click', () => {
    tickOutSound.play();
    customBakeryEsc();
});

customRandomBtn.addEventListener('click', () => {
    tickInSound.play();
    customBInput.value = randomBakeryName();
})

customSubmitBtn.addEventListener('click', customBNameValidation);
customBInput.addEventListener('keydown', (e) => {
    e.key === "Enter" ? customBNameValidation() : null;
})


// Bakery functions
function checkBakeryEsc(e){
    if(e.key === "Escape"){
        tickOutSound.play();
        customBakeryEsc();
    }
}

function customBakeryEsc(){
    customBakery.style.animation = "fadeOut 200ms ease-in-out forwards";

    document.body.removeEventListener('keydown', checkBakeryEsc);

    setTimeout(() => {
        customBakeryError.style.display = "none";
    }, 150);
}

function customBNameValidation(){
    tickInSound.play();
    if(customBInput.value.length <= 2){
        customBakeryError.style.display = "block";
    }
    else{
        customBakeryError.style.display = "none";

        localStorage.setItem('bakeryName', customBInput.value);
        bakeryName.innerText = customBInput.value;
        newBakeryName = customBInput.value;

        customBakeryEsc();
    }
}


// COOKIE CLICKING
let intervalsCount = 0;
let intervalsCountArray = [];
let cookieClickStep = 1;
let remainingCookies = 0;
let remainingIntervalCount = 0;
let disableCookieInterval = false;
let runningCookieInterval = false;

cookie.addEventListener('mousedown', () => {
    cookie.style.animation = "cookieHoverOut 400ms linear forwards";
    clickInSound.play();
})
cookie.addEventListener('mouseup', (e) => {
    cookie.style.animation = "cookieHoverIn 400ms linear forwards";
    clickOutSound.play();
    
    cookieClickIncrease();
    cookieClickEffect(e);
})


function cookieClickIncrease(){
    instaCookieCount += cookieClickStep;
    totalCookies += cookieClickStep;
    remainingCookies += cookieClickStep;
    localStorage.setItem('cookieCount', instaCookieCount);
    localStorage.setItem('totalCookieCount', totalCookies);
    checkEnabledItems();
    checkItemPrize();
    checkUpgradePrize();
    showChangedPrize();
    updateCurrentComments();

    remainingIntervalCount++;

    let intervalI = 0;
    let numDiff = 0;
    runningCookieInterval = true;

    intervalsCount++;
    intervalsCountArray.push(intervalsCount);

    window['cookieAddInterval' + intervalsCount] = setInterval(() => {
        if(cookieClickStep < 10000){
            cookieCount += 1;
            remainingCookies -= 1;

            intervalI++;
        }
        else{
            let numberLength = cookieClickStep.toString().length;
            let numberIncrement = Math.round(cookieClickStep / (numberLength * 100));

            cookieCount += numberIncrement;
            remainingCookies -= numberIncrement;
            intervalI += numberIncrement;
        }

        cookieCountText.innerText = formatNum(cookieCount);

        if(intervalI >= cookieClickStep){
            clearInterval(window['cookieAddInterval' + intervalsCountArray[0]]);
            
            numDiff = intervalI % cookieClickStep;

            intervalsCountArray.shift();
            disableCookieInterval = false;
            if(intervalsCountArray.length === 0){
                runningCookieInterval = false;

                cookieCount -= remainingIntervalCount * numDiff;

                cookieCountText.innerText = formatNum(cookieCount);
            }
        }
        if(disableCookieInterval === true){
            clearAllCookieIntervals(intervalsCount);
            intervalsCountArray = [];
            disableCookieInterval = false;

            cookieCount += remainingCookies;
            remainingCookies = 0;
            cookieCountText.innerText = formatNum(cookieCount);
            // console.log(cookieCount);
        }
    });
}

// Disable all intervals
function clearAllCookieIntervals(intervalIndex){
    for (let i = 1; i <= intervalIndex; i++) {
        clearInterval(window['cookieAddInterval' + i]);
    }

    runningCookieInterval = false;
}


// COOKIE CLICK EFFECT
function cookieClickEffect(e){
    // Text
    let leftPos = e.pageX;
    let topPos = e.pageY;

    let newP = document.createElement('p');
    newP.innerText = `+${formatNum(cookieClickStep)}`;
    newP.classList.add('floatingCookieEffect');

    let randomPLeft = Math.floor(Math.random() * ((leftPos + 2) - (leftPos - 2) + 1) + (leftPos - 2))

    newP.style.left = `${randomPLeft}px`;
    newP.style.top = `10%`;
    newP.style.opacity = 0;
    
    cookieContainer.appendChild(newP);

    newP.animate([
        // Keyframes
        {   top: `${topPos}px`,
            opacity: 1
        },
        {   top: '10%',
            opacity: 0
        },
    ], {
        duration: 4000,
    });

    setTimeout(() => {
        newP.remove();
    }, 4000);


    // Cookie
    let newCookieIcon = document.createElement('img');
    newCookieIcon.classList.add('floatingCookieIcon');
    newCookieIcon.src = "./res/img/icons.png";

    let centeredLeftPos = leftPos - 19;
    let randomLeftPos = Math.floor(Math.random() * ((centeredLeftPos + 5) - (centeredLeftPos - 5) + 1) + (centeredLeftPos - 5));

    newCookieIcon.style.left = `${randomLeftPos}px`;
    newCookieIcon.style.top = `${topPos}px`;
    newCookieIcon.style.opacity = 0;

    cookieContainer.appendChild(newCookieIcon);

    let animateTop = Math.floor(Math.random() * ((topPos + 100) - (topPos + 50) + 1) + (topPos + 50))

    newCookieIcon.animate([
        {
            left: `${randomLeftPos}px`,
            top: `${topPos}px`,
            opacity: 1
        },
        {
            left: `${randomLeftPos}px`,
            top: `${animateTop}px`,
            opacity: 0
        }
    ], {
        duration: 1000
    })

    setInterval(() => {
        newCookieIcon.remove();
    }, 1000);
}


// IF THERE IS ENOUGHT TOTAL COOKIES, ENABLE BUY ITEM
const itemBx = document.querySelector('.buy__itemBx');
const itemCursor = document.querySelector('.itemCursor');
const itemGrandma = document.querySelector('.itemGrandma');
let itemFarm,
    itemMine,
    itemFactory,
    itemBank,
    itemTemple,
    itemWizard,
    itemShip,
    itemAlchemy,
    itemPortal,
    itemTime,
    itemCondenser,
    itemPrism,
    itemChance,
    itemEngine,
    itemJsconsole,
    itemIdle,
    itemCortex;


let buildCountArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// Total cookies produces by each building
let buildCookieCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];



function checkEnabledItems(){
    // Autoclick
    if(totalCookies >= 15 && itemCursor.classList.contains('itemDisabled')){
        itemCursor.classList.remove('itemDisabled');

        itemBx.insertAdjacentHTML('beforeend', newFarmHtml);
        itemFarm = itemBx.querySelector('.itemFarm');

        buildingsMoovingDesc();
    }

    // Grandma
    if(totalCookies >= 100 && itemGrandma.classList.contains('itemDisabled')){
        itemGrandma.classList.remove('itemDisabled');

        itemBx.insertAdjacentHTML('beforeend', newMineHtml);
        itemMine = itemBx.querySelector('.itemMine');

        buildingsMoovingDesc();
    }

    // Farm
    if(totalCookies >= 1100 && itemFarm.classList.contains('itemDisabled')){
        itemFarm.classList.remove('itemDisabled');

        itemBx.insertAdjacentHTML('beforeend', newFactoryHtml);
        itemFactory = itemBx.querySelector('.itemFactory');

        buildingsMoovingDesc();
    }

    // Mine
    if(totalCookies >= 12000 && itemMine.classList.contains('itemDisabled')){
        itemMine.classList.remove('itemDisabled');

        itemBx.insertAdjacentHTML('beforeend', newBankHtml);
        itemBank = itemBx.querySelector('.itemBank');

        buildingsMoovingDesc();
    }

    // Factory
    if(totalCookies >= 130000 && itemFactory.classList.contains('itemDisabled')){
        itemFactory.classList.remove('itemDisabled');

        itemBx.insertAdjacentHTML('beforeend', newTempleHtml);
        itemTemple = itemBx.querySelector('.itemTemple');

        buildingsMoovingDesc();
    }

    // Bank
    if(totalCookies >= 1400000 && itemBank.classList.contains('itemDisabled')){
        itemBank.classList.remove('itemDisabled');

        itemBx.insertAdjacentHTML('beforeend', newWizardHtml);
        itemWizard = itemBx.querySelector('.itemWizard');

        buildingsMoovingDesc();
    }

    // Temple
    if(totalCookies >= 20000000 && itemTemple.classList.contains('itemDisabled')){
        itemTemple.classList.remove('itemDisabled');

        itemBx.insertAdjacentHTML('beforeend', newShipHtml);
        itemShip = itemBx.querySelector('.itemShip');

        buildingsMoovingDesc();
    }

    // Wizard
    if(totalCookies >= 330000000 && itemWizard.classList.contains('itemDisabled')){
        itemWizard.classList.remove('itemDisabled');

        itemBx.insertAdjacentHTML('beforeend', newAlchemyHtml);
        itemAlchemy = itemBx.querySelector('.itemAlchemy');

        buildingsMoovingDesc();
    }

    // Ship
    if(totalCookies >= 5100000000 && itemShip.classList.contains('itemDisabled')){
        itemShip.classList.remove('itemDisabled');

        itemBx.insertAdjacentHTML('beforeend', newPortalHtml);
        itemPortal = itemBx.querySelector('.itemPortal');

        buildingsMoovingDesc();
    }

    // Alchemy
    if(totalCookies >= 75000000000 && itemAlchemy.classList.contains('itemDisabled')){
        itemAlchemy.classList.remove('itemDisabled');

        itemBx.insertAdjacentHTML('beforeend', newTimeHtml);
        itemTime = itemBx.querySelector('.itemTime');

        buildingsMoovingDesc();
    }

    // Portal
    if(totalCookies >= 1000000000000 && itemPortal.classList.contains('itemDisabled')){
        itemPortal.classList.remove('itemDisabled');

        itemBx.insertAdjacentHTML('beforeend', newCondenserHtml);
        itemCondenser = itemBx.querySelector('.itemCondenser');

        buildingsMoovingDesc();
    }

    // Time
    if(totalCookies >= 14000000000000 && itemTime.classList.contains('itemDisabled')){
        itemTime.classList.remove('itemDisabled');

        itemBx.insertAdjacentHTML('beforeend', newPrismHtml);
        itemPrism = itemBx.querySelector('.itemPrism');

        buildingsMoovingDesc();
    }

    // Condenser
    if(totalCookies >= 170000000000000 && itemCondenser.classList.contains('itemDisabled')){
        itemCondenser.classList.remove('itemDisabled');

        itemBx.insertAdjacentHTML('beforeend', newChanceHtml);
        itemChance = itemBx.querySelector('.itemChance');

        buildingsMoovingDesc();
    }

    // Prism
    if(totalCookies >= 2100000000000000 && itemPrism.classList.contains('itemDisabled')){
        itemPrism.classList.remove('itemDisabled');

        itemBx.insertAdjacentHTML('beforeend', newEngineHtml);
        itemEngine = itemBx.querySelector('.itemEngine');

        buildingsMoovingDesc();
    }

    // Chance
    if(totalCookies >= 26000000000000000 && itemChance.classList.contains('itemDisabled')){
        itemChance.classList.remove('itemDisabled');

        itemBx.insertAdjacentHTML('beforeend', newJsconsoleHtml);
        itemJsconsole = itemBx.querySelector('.itemJsconsole');

        buildingsMoovingDesc();
    }

    // Engine
    if(totalCookies >= 310000000000000000 && itemEngine.classList.contains('itemDisabled')){
        itemEngine.classList.remove('itemDisabled');

        itemBx.insertAdjacentHTML('beforeend', newIdleHtml);
        itemIdle = itemBx.querySelector('.itemIdle');

        buildingsMoovingDesc();
    }

    // Jsconsole
    if(totalCookies >= 71000000000000000000 && itemJsconsole.classList.contains('itemDisabled')){
        itemJsconsole.classList.remove('itemDisabled');

        itemBx.insertAdjacentHTML('beforeend', newCortexHtml);
        itemCortex = itemBx.querySelector('.itemCortex');

        buildingsMoovingDesc();
    }

    // Idle
    if(totalCookies >= 12000000000000000000000 && itemIdle.classList.contains('itemDisabled')){
        itemIdle.classList.remove('itemDisabled');
        buildingsMoovingDesc();
    }

    // Cortex
    if(totalCookies >= 1900000000000000000000000 && itemCortex.classList.contains('itemDisabled')){
        itemCortex.classList.remove('itemDisabled');
        buildingsMoovingDesc();
    }
}


// GENERATE ALL BUILDINGS
let cursorPrize = 15,
    grandmaPrize = 100,
    farmPrize = 1100,
    minePrize = 12000,
    factoryPrize = 130000,
    bankPrize = 1400000,
    templePrize = 20000000,
    wizardPrize = 330000000,
    shipPrize = 5100000000,
    alchemyPrize = 75000000000,
    portalPrize = 1000000000000,
    timePrize = 14000000000000,
    condenserPrize = 170000000000000,
    prismPrize = 2100000000000000,
    chancePrize = 26000000000000000,
    enginePrize = 310000000000000000,
    jsconsolePrize = 71000000000000000000,
    idlePrize = 12000000000000000000000,
    cortexPrize = 1900000000000000000000000;

let startBuildPrizesArr = [cursorPrize, grandmaPrize, farmPrize, minePrize, factoryPrize, bankPrize, templePrize, wizardPrize, shipPrize, alchemyPrize, portalPrize, timePrize, condenserPrize, prismPrize, chancePrize, enginePrize, jsconsolePrize, idlePrize, cortexPrize];
let buildPrizesArr = [cursorPrize, grandmaPrize, farmPrize, minePrize, factoryPrize, bankPrize, templePrize, wizardPrize, shipPrize, alchemyPrize, portalPrize, timePrize, condenserPrize, prismPrize, chancePrize, enginePrize, jsconsolePrize, idlePrize, cortexPrize];


// Generate all buildings
const newFarmHtml = generateNewBuilding("Farma", "Farm", formatNum(farmPrize), "Tady se z keksových semínek pěstují keksové rostliny.", "234.4", 3, -101);
const newMineHtml = generateNewBuilding("Důl", "Mine", formatNum(minePrize), "Těží sušenkové těsto a čokoládové střípky.", "1,065", 4, -148);
const newFactoryHtml = generateNewBuilding("Továrna", "Factory", formatNum(factoryPrize), "Produkuje velké množství keksů.", "5,893", 5, -196);
const newBankHtml = generateNewBuilding("Banka", "Bank", formatNum(bankPrize), "Generuje keksy z úroku.", "31,733", 6, -726);
const newTempleHtml = generateNewBuilding("Chrám", "Temple", formatNum(templePrize), "Plné vzácné, starodávné čokolády.", "176,802", 7, -774);
const newWizardHtml = generateNewBuilding("Čarodějná věž", "Wizard", formatNum(wizardPrize), "Vyvolává keksy pomocí kouzel.", "997,347", 8, -821);
const newShipHtml = generateNewBuilding("Dodávka", "Ship", formatNum(shipPrize), "Přiváží čerstvé keksy z keksové planety.", "2.947 milion", 9, -244);
const newAlchemyHtml = generateNewBuilding("Alchymistická laboratoř", "Alchemy", formatNum(alchemyPrize), "Přetváří zlato na keksy.", "36.267 milion", 10, -292);
const newPortalHtml = generateNewBuilding("Portál", "Portal", formatNum(portalPrize), "Otevírá brány do Keksmíru.", "113.335 milion", 11, -340);
const newTimeHtml = generateNewBuilding("Stroj času", "Time", formatNum(timePrize), "Přinášejte keksy z minulosti, které ještě nikdo nesnědl.", "736.677 milion", 12, -387);
const newCondenserHtml = generateNewBuilding("Antihmotový kondenzátor", "Condenser", formatNum(condenserPrize), "Kondenzuje antihmotu ve vesmíru na keksy.", "4.873 bilion", 13, -628);
const newPrismHtml = generateNewBuilding("Prizma", "Prism", formatNum(prismPrize), "Samotné světlo přeměňuje na keksy.", "32.867", 14, -674);
const newChanceHtml = generateNewBuilding("Šancovač", "Chance", formatNum(chancePrize), "Generuje keksy jen tak z ničeho, čistě na bázi štěstí.", "238.003 bilion", 15, -914);
const newEngineHtml = generateNewBuilding("Fraktální motor", "Engine", formatNum(enginePrize), "Přeměňuje keksy na ještě více keksů.", "1.7 trillion", 16, -966);
const newJsconsoleHtml = generateNewBuilding("Konzole javascript", "Jsconsole", formatNum(jsconsolePrize), "Vytváří keksy přímo v kódu, ve kterém je psána tato hra.", "6.233 trillion", 17, -1541);
const newIdleHtml = generateNewBuilding("Nečinný vesmír", "Idle", formatNum(idlePrize), "Vedle našeho vesmíru existuje i několik dalších, nečinných vesmírů. Konečně jste objevili způsob, jak se nabourat do jejich produkce a cokoliv, co vyrábějí, přeměnit na keksy.", "47.034 trillion", 18, -1590);
const newCortexHtml = generateNewBuilding("Kortexový pekař", "Cortex", formatNum(cortexPrize), "Tyto umělé mozky o velikosti planety jsou schopné zhmotnit sny o keksech. Čas a prostor jsou nepodstatné. Realita je svévolná.", "101.506 septillion", 19, -1637);

function generateNewBuilding(name, buildClass, prize, citation, productionPerSec, buldingIndex, descIconPos){
    return (`
        <div class="buy__item item${buildClass} itemDisabled">
            <img src="./res/img/buildings.png" alt="" style="object-position: 0px -${buldingIndex * 64}px;" class="item__icon" draggable="false">
            <div class="item__textBx">
                <h4 class="item__name">???</h4>
                <h4 class="item__name itmNameDis">${name}</h4>
                <div class="item__info">
                    <p class="info__amount infoAmountOne">x<span>10</span></p>
                    <p class="info__amount infoAmountTwo">x<span>100</span></p>
                    <p class="info__prize prizeGreen">
                        <img src="./res/img/money.png" alt="" class="prize__icon" draggable="false">
                        <span class="info__prizeText">${prize}</span>
                    </p>
                </div>
            </div>
            <h4 class="item__count"></h4>
            <div class="item__desc">
                <div class="desc__top">
                    <img src="./res/img/icons.png" alt="" style="object-position: ${descIconPos}px 0px;" class="desc__icon" draggable="false">
                    <div class="desc__nameBx">
                        <p class="desc__name">???</p>
                        <p class="desc__name descNameDis">${name}</p>
                        <p class="desc__own">vlastněno: <span>0</span></p>
                    </div>
                    <div class="desc__countBx">
                        <img src="./res/img/money.png" alt="" class="desc__countImg" draggable="false">
                        <p class="desc__count prizeGreen">${prize}</p>
                    </div>
                </div>
                <p class="desc__citation">"???"</p>
                <p class="desc__citation descCitDis">"${citation}"</p>

                <ul class="desc__infoBx">
                    <li class="desc__info">každé ${name.toLowerCase()} produkuje <span class="whiteT">${productionPerSec} keksy</span> za sekundu</li>
                    <li class="desc__info descInfoProduction">
                        <span class="infoCount">5</span>
                        ${name.toLowerCase()} produkuje
                        <span class="infoPerSec whiteT">0.5</span>
                        <span class="whiteT">keksy</span>
                        za sekundu
                        (<span class="infoProduction whiteT">100</span><span class="whiteT">%</span> z celkových K/s)
                    </li>
                    <li class="desc__info">
                        <span class="infoProduces whiteT">0</span>
                        <span class="whiteT">keksy</span>
                        dosud vyprodukováno
                    </li>
                </ul>
            </div>
        </div>
    `);
}



// MOOVING BUILDING DESCRIPTION, TRIGGERING ALSO BUY ITEMS
let buildings = function(){ return document.querySelectorAll('.buy__item')};
let multiSelection = false;
let noCheck = false;


function buildingsMoovingDesc(){
    buildings().forEach((building) => {
        let buildingDesc = building.querySelector('.item__desc');
    
        building.addEventListener('mouseenter', () => {
            buildingDesc.style.display = "block";
        })
    
        building.addEventListener('mousemove', (e) => {
            let currentY = e.clientY;
            let updatedY = currentY - 344;
            let updatedBodyHeight = document.body.scrollHeight - buildingDesc.offsetHeight + 40;

            if(updatedBodyHeight > currentY){
                buildingDesc.style.bottom = "";
                buildingDesc.style.top = `${updatedY}px`;
            }
            else{
                buildingDesc.style.top = "";
                buildingDesc.style.bottom = 0;
            }
        })
    
        building.addEventListener('mouseleave', () => {
            buildingDesc.style.display = "none";
        })


        building.addEventListener('click', buyItemBuilding, false);
        building.buildingInfo = [building];
        // Buy item function
        // buyItemBuilding(buildings, building);
    })
}

function buyItemBuilding(e){
    if(multiSelection) return;

    let building = e.currentTarget.buildingInfo[0];
    
    const buildingsArray = Array.prototype.slice.call(buildings());
    
    let buildingIndex = buildingsArray.indexOf(building); // 0

    if(instaCookieCount >= buildPrizesArr[buildingIndex]){
        buySound.play();

        let infoPrizeText = building.querySelector('.info__prizeText');
        let descPrizeText = building.querySelector('.desc__count');
        let itemCountText = building.querySelector('.item__count');

        // Cookie count
        decrementCookies(buildPrizesArr[buildingIndex]);
        buyBuilding(buildingsArray[buildingIndex], buildCountArr[buildingIndex], buildingIndex);

        if(runningCookieInterval === true) disableCookieInterval = true;

        // Prize
        let minusCookies = Math.round(buildPrizesArr[buildingIndex] / 5);
        buildPrizesArr[buildingIndex] += minusCookies;
        
        infoPrizeText.innerText = formatNum(buildPrizesArr[buildingIndex]);
        descPrizeText.innerText = formatNum(buildPrizesArr[buildingIndex]);
        
        // Count
        buildCountArr[buildingIndex]++;
        localStorage.setItem('buildingsArr', JSON.stringify(buildCountArr));
        itemCountText.innerText = buildCountArr[buildingIndex];

        showUpgrades();
        checkItemPrize();
        checkUpgradePrize();
    }
    else{
        console.log("you dont have enought money");
        console.log(instaCookieCount);
    }
}

buildingsMoovingDesc();


function decrementCookies(cookies){
    cookieCount -= cookies;
    instaCookieCount -= cookies;
    localStorage.setItem('cookieCount', instaCookieCount);
    localStorage.setItem('totalCookieCount', totalCookies);

    updateCurrentComments();

    cookieCountText.innerText = formatNum(cookieCount);
}


// CHECK ITEM COST - IF THERE IS ENOUGHT COOKIES, THE PRIZE TEXT WILL BE GREEN AND VICE-VERSA
let multiplied = 1;

function checkItemPrize(){
    if(noCheck) return;

    let checkMultipliedPrize;

    if(multiplied === 10 || multiplied === 100){
        checkMultipliedPrize = multiplied;
    }
    else{
        checkMultipliedPrize = 1;
    }

    buildings().forEach((building) => {
        const buildingsArray = Array.prototype.slice.call(buildings());
        let buildingIndex = buildingsArray.indexOf(building);

        let buildingMultipliedPrize = buildPrizesArr[buildingIndex];
       
        for (let i = 1; i < checkMultipliedPrize; i++) {
            buildingMultipliedPrize += (buildPrizesArr[buildingIndex] + (Math.floor(buildingMultipliedPrize / 5)));
        }


        if(instaCookieCount < buildingMultipliedPrize){
            building.classList.add('noEnoughtCookies');
        }
        else{
            building.classList.remove('noEnoughtCookies');
        }
    })
}


// BUY BUILDING - ADD UTILS
const middleBuildingsBx = document.querySelector('.middle__buildings');

// Generate random age for grandmas
function generateRandomGrandma(){
    let minAge = 80;
    let maxAge = 115;
    let randomAge = Math.floor(Math.random() * (maxAge - minAge)) + minAge;

    let randomGrandmaName = grandmaNames[(Math.random() * grandmaNames.length) | 0];
    
    return {
        age: randomAge,
        name: randomGrandmaName
    };
}

function buyBuilding(building, buildingCount, buildingIndex){
    let buildingNameUpper = building.classList[1].replace('item', '');
    let buildingNameLow = building.classList[1].replace('item', '').toLowerCase();

    // Only cursor
    if(buildingNameLow === "cursor"){
        let currentCursor = document.querySelector(`.cookie__upgrade.id${buildingCount}`);

        currentCursor.style.display = "block";

        building.classList.remove('buildingProductionDis');
        
        setBuildingInterval(buildingNameUpper, buildingIndex);
    }

    // Create buildings background - only grandmas
    else if(buildingCount === 0 && buildingNameLow === "grandma"){
        let grandmaInfo = generateRandomGrandma();

        let grandmaBx = `
            <div class="buildBx buildGrandma" style="background-image: url('./res/img/buildings/grandmaBg.png'); grid-row: ${buildingIndex}">
                <div class="buildContainer build__grandmaContainer">
                    <div class="grandmaImgBx" style="--graNum: 1; --graName: '${grandmaInfo.name}, věk ${grandmaInfo.age}'">
                        <img src="./res/img/buildings/grandma.png" alt="" draggable="false">
                    </div>
                </div>
            </div>
        `;

        middleBuildingsBx.insertAdjacentHTML('afterbegin', grandmaBx);

        building.classList.remove('buildingProductionDis');
        
        setBuildingInterval(buildingNameUpper, buildingIndex);
    }
    
    // Create buildings background - not cursor and grandmas
    else if(buildingCount === 0){
        let currentBuildingContainer = document.querySelector(`.build${buildingNameUpper}Container`);

        let buildingBx = `
            <div class="buildBx build${buildingNameUpper}" style="background-image: url('./res/img/buildings/${buildingNameLow}Bg.png'); grid-row: ${buildingIndex}">
                <div class="buildContainer build__${buildingNameLow}Container">
                    <img src="./res/img/buildings/${buildingNameLow}.png" alt="" style="--${buildingNameLow}Num: 1;" draggable="false">
                </div>
            </div>
        `;

        currentBuildingContainer.insertAdjacentHTML('beforeend', buildingBx);

        building.classList.remove('buildingProductionDis');
        
        setBuildingInterval(buildingNameUpper, buildingIndex);
    }

    // IF THERE IS BUILDING BACKGROUND - just add building
    // Add building - Only grandmas
    else if(buildingCount > 0 && buildingNameLow === "grandma"){
        let grandmaBuildingBx = middleBuildingsBx.querySelector('.buildGrandma .build__grandmaContainer');
        let grandmaInfo = generateRandomGrandma();
        
        let newGrandma = `
        <div class="grandmaImgBx" style="--graNum: ${buildingCount + 1}; --graName: '${grandmaInfo.name}, věk ${grandmaInfo.age}'">
        <img src="./res/img/buildings/grandma.png" alt="" draggable="false">
        </div>
        `;
        
        grandmaBuildingBx.insertAdjacentHTML('beforeend', newGrandma);

        setBuildingInterval(buildingNameUpper, buildingIndex);
    }


    // Add building - not cursor and grandmas
    else if(buildingCount > 0){
        let currentBuildingBgBx = middleBuildingsBx.querySelector(`.buildBx.build${buildingNameUpper}`);
        let currentBuildingBg = currentBuildingBgBx.querySelector('.buildContainer');

        let newBuilding = `
            <img src="./res/img/buildings/${buildingNameLow}.png" alt="" style="--${buildingNameLow}Num: ${buildingCount + 1};" draggable="false">
        `;

        currentBuildingBg.insertAdjacentHTML('beforeend', newBuilding);

        setBuildingInterval(buildingNameUpper, buildingIndex);
    }
}


// BUILDING INTERVALS
// Variables - check if there is interval
let runningIntervalsArr = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];


// Variables for each building interval
let buildingIntervals = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

// Variables for buildings - cookies per second
let cursorPerSecond = 0.1,
    grandmaPerSecond = 1,
    farmPerSecond = 8,
    minePerSecond = 47,
    factoryPerSecond = 260,
    bankPerSecond = 1400,
    templePerSecond = 7800,
    wizardPerSecond = 44000,
    shipPerSecond = 260000,
    alchemyPerSecond = 1600000,
    portalPerSecond = 10000000,
    timePerSecond = 65000000,
    condenserPerSecond = 430000000,
    prismPerSecond = 2900000000,
    chancePerSecond = 21000000000,
    enginePerSecond = 150000000000,
    jsconsolePerSecond = 1100000000000,
    idlePerSecond = 8300000000000,
    cortexPerSecond = 64000000000000;

let buildingsPerSecond = [cursorPerSecond, grandmaPerSecond, farmPerSecond, minePerSecond, factoryPerSecond, bankPerSecond, templePerSecond, wizardPerSecond, shipPerSecond, alchemyPerSecond, portalPerSecond, timePerSecond, condenserPerSecond, prismPerSecond, chancePerSecond, enginePerSecond, jsconsolePerSecond, idlePerSecond, cortexPerSecond];



// SET BUILDINGS INTERVAL
const cookiePerSecText = document.querySelector('.cookie__secText');
let totalCookiesPerSecArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let totalCookiesPerSec = 0;

function setBuildingInterval(buildingNameUpper, buildingIndex){
    let infoItemCount = document.querySelector(`.item${buildingNameUpper} .infoCount`);
    let infoPerSec = document.querySelector(`.item${buildingNameUpper} .infoPerSec`);

    let itemBuildCount = (buildCountArr[buildingIndex] + 1);

    infoItemCount.innerText = itemBuildCount;
    infoPerSec.innerText = formatNum((itemBuildCount * buildingsPerSecond[buildingIndex]));

    // Count all buildings production per second and display it in text under cookie
    totalCookiesPerSecArr[buildingIndex] = (Math.round(buildingsPerSecond[buildingIndex] * itemBuildCount * 10) / 10);

    totalCookiesPerSec = totalCookiesPerSecArr.reduce((a, b) => a + b, 0);

    cookiePerSecText.innerText = formatNum(totalCookiesPerSec);
    
    // Show information
    buildings()[buildingIndex].classList.add('descInfoEnabled');

    setIncrementingInterval(buildingNameUpper, buildingIndex, itemBuildCount);
}


// BUILDING UPGRADES
const upgradeContainer = document.querySelector('.upgrade__container');
let displayedUpgrades = [];
let boughtUpgrades = [];    // For save upgrades into local storage
let createUpgrade = true;

function showUpgrades(){
    buildCountArr.forEach((building, index) => {
        if(building > 0 && index < 17){
            upgradesInfo[index].arr.forEach((info, upgradeIndex) => {
                // Index = top info, buildcountarr = downInfo
                if(info[4] <= buildCountArr[index]){
                    createUpgrade = true;

                    displayedUpgrades.forEach((displayed) => {
                        if(displayed.upgradeType === index && displayed.upgradeIndex === upgradeIndex){
                            createUpgrade = false;
                        };
                    })

                    if(createUpgrade === true){
                        displayedUpgrades.push({ upgradeType: index, upgradeIndex: upgradeIndex });

                        let upgradeHtml = `
                            <div class="upgrade__bx" data-type=${index} data-index=${upgradeIndex}>
                                <img src="./res/img/icons.png" alt="" class="upgrade__item" draggable="false" style="object-position: -${(info[5].yPos - 1) * 48}px -${(info[5].xPos - 1) * 48}px;">
                                <div class="item__desc">
                                    <div class="desc__top">
                                        <img src="./res/img/icons.png" alt="" class="desc__icon" draggable="false"  style="object-position: -${(info[5].yPos - 1) * 48}px -${(info[5].xPos - 1) * 48}px;">
                                        <div class="desc__nameBx">
                                            <p class="desc__name">${info[1]}</p>
                                            <p class="desc__own">Aktualizovat</p>
                                        </div>
                                        <div class="desc__countBx">
                                            <img src="./res/img/money.png" alt="" class="desc__countImg" draggable="false">
                                            <p class="desc__count prizeGreen">${formatNum(info[2])}</p>
                                        </div>
                                    </div>
                                    <p class="desc__upgTitle">${(info[3])}</p>
                                    <p class="desc__upgClick">Kliknutím kupte</p>
                                </div>
                            </div>
                        `;
    
                        upgradeContainer.insertAdjacentHTML('beforeend', upgradeHtml);
    
                        checkUpgradePrize();
                        updateUpgrades();
                    }
                }
            })
        }
    })
}


function upgradesSelector(){
    return document.querySelectorAll('.upgrade__container .upgrade__bx');
};

// CHECK UPGRADE COST - IF THERE IS ENOUGHT COOKIES, THE PRIZE TEXT WILL BE GREEN AND VICE-VERSA
function checkUpgradePrize(){
    upgradesSelector().forEach((upgrade) => {
        let upgradeType = upgrade.getAttribute('data-type');
        let upgradeIndex = upgrade.getAttribute('data-index');

        let currentUpgradePrize = upgradesInfo[upgradeType].arr[upgradeIndex][2];

        if(instaCookieCount < currentUpgradePrize){
            upgrade.classList.add('noEnoughtCookies');
        }
        else{
            upgrade.classList.remove('noEnoughtCookies');
        }
    })
}


// BUY UPGRADES
function updateUpgrades(){
    updateMoovingUpgradeDesc();

    upgradesSelector().forEach((upgrade, index) => {
        upgrade.addEventListener('click', buyUpgrade, false);
        upgrade.upgradeInfo = [upgrade, index];
    })
}

function buyUpgrade(e){
    let currentUpgrade = e.currentTarget.upgradeInfo[0];
    let currentIndex = e.currentTarget.upgradeInfo[1];

    let upgradeType = currentUpgrade.getAttribute('data-type');
    let upgradeIndex = currentUpgrade.getAttribute('data-index');
    let currentUpgradePrize = upgradesInfo[upgradeType].arr[upgradeIndex][2];

    if(instaCookieCount >= currentUpgradePrize){
        buySound.play();

        let currentBuilding = buildings()[upgradeType];
        let currentUpgradeName = upgradesInfo[upgradeType].type;
        let currentUpgradeNameUpper = currentUpgradeName.charAt(0).toUpperCase() + currentUpgradeName.slice(1)
        let productionPerText = currentBuilding.querySelector('.desc__info span');

        if(runningCookieInterval === true) disableCookieInterval = true;

        buildingsPerSecond[upgradeType] += buildingsPerSecond[upgradeType];

        productionPerText.innerText = buildingsPerSecond[upgradeType];

        if(upgradeType == 0){
            cookieClickStep *= 2;
        }

        setUpgradeInterval(currentUpgradeNameUpper, upgradeType);

        decrementCookies(currentUpgradePrize);

        boughtUpgrades.push({upgradeType: upgradeType, upgradeNumber: upgradeIndex});

        localStorage.setItem('upgradesArr', JSON.stringify(boughtUpgrades)); // JSON.parse to get this

        currentUpgrade.remove();
    }
    else{
        console.log('you dont have enought money');
        console.log(instaCookieCount);
        console.log(currentUpgradePrize);
        console.log(upgradeType, currentIndex);
    }
}


function setUpgradeInterval(upgradeNameUpper, upgradeIndex){
    let infoPerText = document.querySelector(`.item${upgradeNameUpper} .infoPerSec`);

    let itemBuildCount = (buildCountArr[upgradeIndex]);
    let currentProduction = buildingsPerSecond[upgradeIndex] * itemBuildCount;

    infoPerText.innerText = formatNum(currentProduction);

    totalCookiesPerSecArr[upgradeIndex] = (Math.round(buildingsPerSecond[upgradeIndex] * itemBuildCount * 10) / 10);
    totalCookiesPerSec = totalCookiesPerSecArr.reduce((a, b) => a + b, 0);

    cookiePerSecText.innerText = formatNum(totalCookiesPerSec);

    setIncrementingInterval(upgradeNameUpper, upgradeIndex, itemBuildCount);
}


// FUNCTION FOR INCREMENTING COOKIE - SET INTERVAL
function setIncrementingInterval(buildingNameUpper, buildingIndex, itemBuildCount){
    let infoProducesCookies = document.querySelector(`.item${buildingNameUpper} .infoProduces`);

    // Cookie incrementing
    if(runningIntervalsArr[buildingIndex] === true){
        clearInterval(buildingIntervals[buildingIndex]);
    }

    if(itemBuildCount === 0) return;

    runningIntervalsArr[buildingIndex] = true;


    if((1000 / (Math.round(buildingsPerSecond[buildingIndex] * itemBuildCount * 10) / 10)) > 6){
        buildingIntervals[buildingIndex] = setInterval(() => {
            totalCookies += 1;
            cookieCount += 1;
            instaCookieCount += 1;
            localStorage.setItem('cookieCount', instaCookieCount);
            localStorage.setItem('totalCookieCount', totalCookies);
            buildCookieCount[buildingIndex] += 1;
    
            infoProducesCookies.innerText = formatNum(buildCookieCount[buildingIndex]);
            cookieCountText.innerText = formatNum(instaCookieCount);
    
            
            updateCurrentComments();
            checkItemPrize();
            checkUpgradePrize();
        }, (1000 / (Math.round(buildingsPerSecond[buildingIndex] * itemBuildCount * 10) / 10)));
    }
    else{
        let startNum = buildingsPerSecond[buildingIndex] * itemBuildCount;

        let arr = startNum.toString().split("");
        let lastNonzero;

        arr.forEach((num, index) => {
            if(num != 0){
                lastNonzero = index;
            }
        })

        let newNumArr = arr;
        let finalNumber = '';
        newNumArr.length = (lastNonzero + 1);

        newNumArr.forEach((newNum) => {
            finalNumber += newNum;
        })

        let smallerStartNum = parseInt(finalNumber);

        if((1000 / (startNum / smallerStartNum)) > 6){
            buildingIntervals[0] = setInterval(() => {
                totalCookies += smallerStartNum;
                cookieCount += smallerStartNum;
                instaCookieCount += smallerStartNum;
                localStorage.setItem('cookieCount', instaCookieCount);
                localStorage.setItem('totalCookieCount', totalCookies);
                buildCookieCount[0] += smallerStartNum;

                infoProducesCookies.innerText = formatNum(buildCookieCount[0]);
                cookieCountText.innerText = formatNum(instaCookieCount);

                updateCurrentComments();
                checkItemPrize();
                checkUpgradePrize();
            }, (1000 / (startNum / smallerStartNum)));
        }
        else{
            let whileActive = false;
            let i = 0;

            while(whileActive === false){
                i++;

                smallerStartNum *= i;

                if((1000 / (startNum / smallerStartNum)) > 7){
                    whileActive = true;
                }
            }

            buildingIntervals[0] = setInterval(() => {
                totalCookies += smallerStartNum;
                cookieCount += smallerStartNum;
                instaCookieCount += smallerStartNum;
                localStorage.setItem('cookieCount', instaCookieCount);
                localStorage.setItem('totalCookieCount', totalCookies);
                buildCookieCount[0] += smallerStartNum;

                infoProducesCookies.innerText = formatNum(buildCookieCount[0]);
                cookieCountText.innerText = formatNum(instaCookieCount);

                updateCurrentComments();
                checkItemPrize();
                checkUpgradePrize();
            }, (1000 / (Math.round(startNum / smallerStartNum))));
        }
    }
}



// BUYING MORE BUILDINGS
const selectionTypes = document.querySelectorAll('.selection__text');
const selectionAmount = document.querySelectorAll('.selection__number');

toggleActive(selectionTypes);
toggleActive(selectionAmount);

function toggleActive(elements){
    elements.forEach((select) => {
        select.addEventListener('click', () => {
            tickInSound.play();

            elements.forEach((selects) => {
                selects.classList.remove('active');
            })
            
            select.classList.add('active');

            if(elements.length === 4){
                toggleAmounts(select);
            }
            else{
                toggleTypes(select);
            }
        })
    })
}

let selectType = "buy";

function toggleAmounts(select){
    let selectNumber = parseInt(select.getAttribute('data-amount'));

    // Show select number in buildings
    if(selectNumber === 10){
        itemBx.classList.add('selectionOneActive');
        itemBx.classList.remove('selectionTwoActive');

        multiSelection = true;
        multiplied = 10;

        showChangedPrize();
    }
    else if(selectNumber === 100){
        itemBx.classList.remove('selectionOneActive');
        itemBx.classList.add('selectionTwoActive');

        multiSelection = true;
        multiplied = 100;

        showChangedPrize();
    }
    else if(selectNumber === 1000){
        itemBx.classList.remove('selectionOneActive');
        itemBx.classList.remove('selectionTwoActive');

        multiSelection = true;
        multiplied = 1000;

        showChangedPrize();
    }
    else if(selectNumber === 1 && selectType === "sell"){
        itemBx.classList.remove('selectionOneActive');
        itemBx.classList.remove('selectionTwoActive');
    
        multiSelection = true;
        multiplied = 1;
    
        showChangedPrize();
    }
    else{
        itemBx.classList.remove('selectionOneActive');
        itemBx.classList.remove('selectionTwoActive');
    
        multiSelection = false;
        multiplied = 1;
    
        showChangedPrize();
    }
}


const buyMoreSelection = document.querySelector('.buy__selection');

function toggleTypes(select){
    selectType = select.getAttribute('data-select-type');

    if(selectType === "sell"){
        itemBx.classList.add('selectionBuy');
        buyMoreSelection.classList.add('selectionSell');
        showChangedPrize();
        multiSelection = true;
        noCheck = true;
    }
    else{
        if(multiplied === 1000){
            multiplied = 1;

            selectionAmount.forEach((selectAmount) => {
                selectAmount.classList.remove('active');
            })

            selectionAmount[0].classList.add('active');
        }

        itemBx.classList.remove('selectionBuy');
        buyMoreSelection.classList.remove('selectionSell');
        showChangedPrize();
        multiSelection = false;
        noCheck = false;
        checkItemPrize();
    }
}

function showChangedPrize(){
    if(selectType === "buy"){
        buildings().forEach((building, index) => {
            building.removeEventListener('click', buyMultiBuildings);
            building.removeEventListener('click', sellBuildings);

            let infoPrizeText = building.querySelector('.info__prizeText');
            let descPrizeText = building.querySelector('.desc__count');
            let multipliedPrize = buildPrizesArr[index];
            let newBuildPrize = startBuildPrizesArr[index];

            for (let i = 0; i < buildCountArr[index]; i++) {
                newBuildPrize += (Math.floor(newBuildPrize / 5));
            }

            buildPrizesArr[index] = newBuildPrize
        
            infoPrizeText.innerText = formatNum(buildPrizesArr[index]);
            descPrizeText.innerText = formatNum(buildPrizesArr[index]);

            checkItemPrize();
            checkUpgradePrize();

            if(multiplied !== 1){
                building.addEventListener('click', buyMultiBuildings, false);
                building.multiBuildingInfo = [building, multiplied, index];
            }
        })
    }
    else{
        buildings().forEach((building, index) => {
            building.removeEventListener('click', sellBuildings);
            building.removeEventListener('click', buyMultiBuildings);

            let infoPrizeText = building.querySelector('.info__prizeText');
            let descPrizeText = building.querySelector('.desc__count');
            let sellPrize = 0;

            for (let i = 0; i < buildCountArr[index]; i++) {
                sellPrize += (Math.floor(buildPrizesArr[index] / 4));
            }

            let updatedMultiply;

            if(multiplied === 1000){
                updatedMultiply = buildCountArr[index];
            }
            else if(buildCountArr[index] > multiplied){
                updatedMultiply = multiplied
            }
            else{
                updatedMultiply = buildCountArr[index];
            }

            let devidedSellPrize = sellPrize / buildCountArr[index];
            let updatedSellPrize = devidedSellPrize * updatedMultiply;
            let finalSellPrize;

            isNaN(updatedSellPrize) ? finalSellPrize = 0 : finalSellPrize = updatedSellPrize;
            
            infoPrizeText.innerText = formatNum(finalSellPrize);
            descPrizeText.innerText = formatNum(finalSellPrize);

            // If there is no building, add class
            if(buildCountArr[index] === 0){
                building.classList.add('noEnoughtCookies');
            }
            else{
                building.classList.remove('noEnoughtCookies');
            }

            if(buildCountArr[index] > 0){
                building.addEventListener('click', sellBuildings, false);
                building.sellInfo = [building, index, updatedMultiply, finalSellPrize];
            }
       })
    }
}


// BUYING MULTIPLE BUILDINGS
function buyMultiBuildings(building){
    let currentBuilding = building.currentTarget.multiBuildingInfo[0];
    let currentAmount = building.currentTarget.multiBuildingInfo[1];
    let currentIndex = building.currentTarget.multiBuildingInfo[2];

    let multipliedPrize = buildPrizesArr[currentIndex];
       
    for (let i = 1; i < currentAmount; i++) {
        multipliedPrize += (buildPrizesArr[currentIndex] + (Math.floor(multipliedPrize / 5)));
    }


    if(instaCookieCount >= multipliedPrize){
        let infoPrizeText = currentBuilding.querySelector('.info__prizeText');
        let descPrizeText = currentBuilding.querySelector('.desc__count');
        let itemCountText = currentBuilding.querySelector('.item__count');

        // Cookie count
        decrementCookies(multipliedPrize);
        checkItemPrize();
        checkUpgradePrize();

        buySound.play();

        if(runningCookieInterval === true) disableCookieInterval = true;

        // Prize
        for (let i = 0; i < currentAmount; i++) {
            let minusMultipliedCookies = Math.round((buildPrizesArr[currentIndex] / 5));
            buildPrizesArr[currentIndex] += minusMultipliedCookies;

            buyBuilding(currentBuilding, buildCountArr[currentIndex], currentIndex);

            buildCountArr[currentIndex] += 1;
            localStorage.setItem('buildingsArr', JSON.stringify(buildCountArr));
        }

        infoPrizeText.innerText = formatNum(buildPrizesArr[currentIndex]);
        descPrizeText.innerText = formatNum(buildPrizesArr[currentIndex]);

        showChangedPrize(currentAmount);

        // Count
        itemCountText.innerText = buildCountArr[currentIndex];

        showUpgrades();
    }
    else{
        console.log('you dont have enought money');
        console.log(`you have: ${instaCookieCount}, but you need: ${multipliedPrize}`);
    }
}


// SELLING BUILDINGS
function sellBuildings(e){
    sellSound.play();

    let sellBuilding =  e.currentTarget.sellInfo[0];
    let sellIndex = e.currentTarget.sellInfo[1];
    let sellBuildingCount = e.currentTarget.sellInfo[2];
    let sellPrize = e.currentTarget.sellInfo[3];

    let sellBuildingNameUpper = sellBuilding.classList[1].replace('item', '');

    if(runningCookieInterval === true) disableCookieInterval = true;

    // Add sell prize to cookie count
    totalCookies += sellPrize;
    cookieCount += sellPrize;
    instaCookieCount += sellPrize;
    localStorage.setItem('cookieCount', instaCookieCount);
    localStorage.setItem('totalCookieCount', totalCookies);

    updateCurrentComments();

    cookieCountText.innerText = formatNum(instaCookieCount);

    // Deduct buildings
    let oldBuildCount = buildCountArr[sellIndex];

    buildCountArr[sellIndex] -= sellBuildingCount;
    localStorage.setItem('buildingsArr', JSON.stringify(buildCountArr));

    showChangedPrize();

    setIncrementingInterval(sellBuildingNameUpper, sellIndex, buildCountArr[sellIndex]);

    // Upgrade info
    let descInfoProductionBx = sellBuilding.querySelector('.desc__info.descInfoProduction');
    let descInfoPer = descInfoProductionBx.querySelector('.infoPerSec');
    let itemCountText = sellBuilding.querySelector('.item__count');
    let descInfoCount = sellBuilding.querySelector('.infoCount');

    let currentProduction = buildingsPerSecond[sellIndex] * buildCountArr[sellIndex];

    // Count all buildings production per second and display it in text under cookie
    totalCookiesPerSecArr[sellIndex] = (Math.round(buildingsPerSecond[sellIndex] * buildCountArr[sellIndex] * 10) / 10);

    totalCookiesPerSec = totalCookiesPerSecArr.reduce((a, b) => a + b, 0);

    cookiePerSecText.innerText = formatNum(totalCookiesPerSec);


    // Delete cursor
    if(sellIndex === 0){
        for (let i = 0; i < sellBuildingCount; i++) {
            let lastCursor = document.querySelector(`.cookie__upgrade.id${(oldBuildCount - i) - 1}`);
    
            lastCursor.style.display = "none";
        }
    }

    if(buildCountArr[sellIndex] <= 0 && sellBuildingCount === oldBuildCount){
        // If there is no building
        sellBuilding.classList.add('buildingProductionDis');
        itemCountText.innerText = "";

        if(sellIndex === 1){
            // Grandma
            let deleteGrandmaBg = document.querySelector('.buildBx.buildGrandma');

            deleteGrandmaBg.remove();
        }
        else if(sellIndex !== 0){
            let deleteBuildingBg = document.querySelector(`.buildBx.build${sellBuildingNameUpper}`);

            deleteBuildingBg.remove();
        }
    }
    else{
        // If there is min one building
        sellBuilding.classList.remove('buildingProductionDis');
    
        descInfoPer.innerText = formatNum(currentProduction);
        itemCountText.innerText = buildCountArr[sellIndex];
        descInfoCount.innerText = buildCountArr[sellIndex];

        // Just delete building
        if(sellIndex === 1){
            // Grandma
            for (let i = 0; i < sellBuildingCount; i++) {
                console.log(i);
                let lastGrandma = document.querySelector('.buildContainer.build__grandmaContainer .grandmaImgBx:last-child');
    
                lastGrandma.remove();
            }
        }
        else if(sellIndex !== 0){
            for (let i = 0; i < sellBuildingCount; i++) {
                let lastBuilding = document.querySelector(`.build__${sellBuildingNameUpper.toLowerCase()}Container img:last-child`);
    
                lastBuilding.remove();                
            }
        }
    }
}



// COMMENTS
// Generate random comment
let currentCommentsArr = [];
    
function updateCurrentComments(){
    currentCommentsArr = [];

    comments.forEach((comment) => {
        if(totalCookies >= comment[1]){
            currentCommentsArr.push(comment);
        }
    })

    if(totalCookies > 10){
        currentCommentsArr.shift();
    }
    if(totalCookies > 100){
        currentCommentsArr.shift();
    }
}

updateCurrentComments();

function generateRandomComment(){
    let randomCommentNumber = Math.floor(Math.random() * currentCommentsArr.length);

    let randomComment = currentCommentsArr[randomCommentNumber][2];

    return randomComment;
}

// Change comments
const attrCitatesText = document.querySelectorAll('.attr__citate');

attrCitatesText.forEach((attrCitate) => {
    attrCitate.innerText = generateRandomComment();
    attrCitate.addEventListener('click', changeComments);
})

let commentInterval = setInterval(() => {
    changeComments();
}, 5000);

let runningCommentAnimation = false;

function changeComments(){
    if(runningCommentAnimation === true) return;
    clearInterval(commentInterval);
    runningCommentAnimation = true;

    let index;
    let updatedIndex;

    if(attrCitatesText[0].classList.contains('activeOnLoad') || attrCitatesText[0].classList.contains('activeCitate')){
        index = 0;
    }
    else{
        index = 1;
    }
    
    index === 1 ? updatedIndex = 0 : updatedIndex = 1;

    attrCitatesText[index].classList.remove('activeOnLoad');
    attrCitatesText[index].classList.remove('activeCitate');
    attrCitatesText[index].classList.add('inactiveCitate');
    
    attrCitatesText[updatedIndex].classList.remove('inactiveOnLoad');
    attrCitatesText[updatedIndex].classList.remove('inactiveCitate');
    attrCitatesText[updatedIndex].classList.add('activeCitate');
    
    setTimeout(() => {
        attrCitatesText[index].innerText = generateRandomComment();
        runningCommentAnimation = false;
        commentInterval = setInterval(() => {
            changeComments();
        }, 5000);
    }, 300);
}



// MIDDLE FULL BXS (ABOUT, OPTIONS, ATTRIBUTES)
const middleAbout = document.querySelector('.middle__about');
const middleOption = document.querySelector('.middle__option');
const middleAttributes = document.querySelector('.middle__attributes');

const attrOptionBtn = document.querySelector('.attr__roundedBtn.attrOption');
const attrAttributesBtn = document.querySelector('.attr__cleanBtn.attrAttributes');
const attrAboutBtn = document.querySelector('.attr__cleanBtn.attrAbout');

const middleBxsArr = [
    [
        middleAbout,
        middleOption,
        middleAttributes
    ],
    [
        attrAboutBtn,
        attrOptionBtn,
        attrAttributesBtn
    ]
]

middleBxsArr[1].forEach((attrBtn, index) => {
    attrBtn.addEventListener('click', () => {
        insertMiddlebxData(index);

        middleBxsArr[0].forEach((middleSec, secIndex) => {
            if(secIndex !== index) middleSec.style.display = "none";
        })

        if(middleBxsArr[0][index].style.display === "block"){
            middleBxsArr[0][index].style.display = "none";
            buildingClickOutSound.play();
        }
        else{
            middleBxsArr[0][index].style.display = "block";
            buildingClickInSound.play();
        }

        let currentMiddleEsc = middleBxsArr[0][index].querySelector('.middle__escBx');

        currentMiddleEsc.addEventListener('click', () => {
            middleBxsArr[0].forEach((middleBxs) => {
                middleBxs.style.display = "none";
                buildingClickOutSound.play();
            })
        })
    })
})


// Insert data into each building info
function insertMiddlebxData(index){
    if(index === 1){
        // OPTION SECTION
        let middleDeleteBtn = middleBxsArr[0][index].querySelector('.basic__deleteBtn');
        let middleMuteBtn = middleBxsArr[0][index].querySelector('.sett__volumeBtn');

        // Delete all progress
        middleDeleteBtn.addEventListener('click', () => {
            tickInSound.play();
            // if(runningCookieInterval === true) disableCookieInterval = true;
            
            // totalCookies = 0;
            // cookieCount = 0;
            // instaCookieCount = 0;

            // buildCountArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            // buildCookieCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            // buildPrizesArr = [cursorPrize, grandmaPrize, farmPrize, minePrize, factoryPrize, bankPrize, templePrize, wizardPrize, shipPrize, alchemyPrize, portalPrize, timePrize, condenserPrize, prismPrize, chancePrize, enginePrize, jsconsolePrize, idlePrize, cortexPrize];
            // runningIntervalsArr = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
            // buildingIntervals = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
            // buildingsPerSecond = [cursorPerSecond, grandmaPerSecond, farmPerSecond, minePerSecond, factoryPerSecond, bankPerSecond, templePerSecond, wizardPerSecond, shipPerSecond, alchemyPerSecond, portalPerSecond, timePerSecond, condenserPerSecond, prismPerSecond, chancePerSecond, enginePerSecond, jsconsolePerSecond, idlePerSecond, cortexPerSecond];
            // boughtUpgrades = [];
            // displayedUpgrades = [];

            // for(let i=0; i<100; i++){
            //     window.clearInterval(i);
            // }

            // checkEnabledItems();
            // showChangedPrize();
            // showUpgrades();
            // checkItemPrize();
            // checkUpgradePrize();

            localStorage.removeItem('bakeryName');
            localStorage.removeItem('cookieCount');
            localStorage.removeItem('totalCookieCount');
            localStorage.removeItem('buildingsArr');
            localStorage.removeItem('upgradesArr');

            window.location = window.location;
        })

        // Mute audio
        middleMuteBtn.addEventListener('click', () => {
            tickInSound.play();

            let middleMuteText = middleMuteBtn.querySelector('span');

            if(middleBxsArr[0][index].classList.contains('mutedAudio')){
                middleBxsArr[0][index].classList.remove('mutedAudio');
                middleMuteText.innerText = "Zapnuto";

                clickInSound.volume = 0.16;
                clickOutSound.volume = 0.16;
                buildingClickInSound.volume = 0.35;
                buildingClickOutSound.volume = 0.3;
                tickInSound.volume = 0.3;
                tickOutSound.volume = 0.3;
                buySound.volume = 0.35;
                sellSound.volume = 0.4;
            }
            else{
                middleBxsArr[0][index].classList.add('mutedAudio');
                middleMuteText.innerText = "Vypnuto";

                clickInSound.volume = 0;
                clickOutSound.volume = 0;
                buildingClickInSound.volume = 0;
                buildingClickOutSound.volume = 0;
                tickInSound.volume = 0;
                tickOutSound.volume = 0;
                buySound.volume = 0;
                sellSound.volume = 0;
            }
        })
    }
    else{
        // ATTRIBUTES SECTION
        let middleTotalCookieText = document.querySelector('.basicTotalCookies');
        let middleCurrentCookieText = document.querySelector('.basicCurrentCookies');
        let middleBuildingsText = document.querySelector('.basicTotalBuildings');
        let middleCookiesPerText = document.querySelector('.basicCookiePerSec');
        let middleBasicCookiePerClick = document.querySelector('.basicCookiePerClick');

        let totalBuildingCount = buildCountArr.reduce((a, b) => a + b, 0);

        totalCookiesPerSec = totalCookiesPerSecArr.reduce((a, b) => a + b, 0);
        
        middleTotalCookieText.innerText = formatNum(instaCookieCount);
        middleCurrentCookieText.innerText = formatNum(totalCookies);
        middleBuildingsText.innerText = totalBuildingCount;
        middleCookiesPerText.innerText = totalCookiesPerSec;
        middleBasicCookiePerClick.innerText = cookieClickStep;
    }
}