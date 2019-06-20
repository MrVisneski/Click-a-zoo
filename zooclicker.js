//Game Variables
var cash = 100,
food = {
    name: 'food',
    total: 0,
    increment: 1,
    storage: 1000,
    staffIncrement: 0.02,
    animalUse: 0
},
water = {
    name: 'water',
    total: 0,
    increment: 1,
    storage: 1000,
    staffIncrement: 0.02,
    animalUse: 0
},
stone = {
    name: 'stone',
    total: 0,
    increment: 1,
    storage: 1000,
    staffIncrement: 0.01,
    animalUse: 0
},
wood = {
    name: 'wood',
    total: 0,
    increment: 1,
    storage: 1000,
    staffIncrement: 0.01,
    animalUse: 0
},
staff = {
    staffCost: 5,
    unusedStaff: 10,
    foodStaff: 0,
    waterStaff: 0,
    stoneStaff: 0,
    woodStaff: 0
},
butterfly = {
    name: "butterfly",
    unlocked: true,
    unlockCost: 0,
    number: 0,
    animalCost: 5,
    profit: 0.1,
    totalProfit: 0,
    requires: {
        food: 0.01,
        water: 0.01,
    },
    shelter: {
        number: 0,
        cost: 0,
        food: 0,
        water: 0,
        stone: 1,
        wood: 1
    },
    enrichment: {
        number: 0,
        increment: 0.001,
        cost:10, 
        food: 0,
        water: 0,
        stone: 10,
        wood: 10
    }
},
meerkat = {
    name: "meerkat",
    unlocked: false,
    unlockCost: 200,
    number: 0,
    animalCost: 15,
    profit: 0.2,
    totalProfit: 0,
    requires: {
        food: 0.05,
        water: 0.05
    },
    shelter: {
        number: 0,
        cost: 0,
        food: 0,
        water: 0,
        stone: 10,
        wood: 10
    },
    enrichment: {
        number: 0,
        increment: 0.002,
        cost:100, 
        food: 0,
        water: 0,
        stone: 100,
        wood: 100
    }
},
animalList = [butterfly, meerkat];

//Adds commas to long number values
function comma(string) {
    return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Total profit
var ranges = [
    { divider: 1e18 , suffix: 'E' },
    { divider: 1e15 , suffix: 'P' },
    { divider: 1e12 , suffix: 'T' },
    { divider: 1e9 , suffix: 'G' },
    { divider: 1e6 , suffix: 'M' },
    { divider: 1e3 , suffix: 'k' }
  ];
  
  function formatNumber(n) {
    for (var i = 0; i < ranges.length; i++) {
      if (n >= ranges[i].divider) {
        return (n / ranges[i].divider).toFixed(2) + ranges[i].suffix;
      }
    }
    return n.toFixed(2);
  }

var mainGameLoop = window.setInterval(function() {
    gatherResources();
    updateanimalresourceUse();
    updateTotals();
    for (let x = 0; x < animalList.length; x++) {
        getanimalProfit(animalList[x]);
    }
    }, 100);


//Gather resources button pressed, adds on the increment value.
function gather(resource) {
    if (resource.total + resource.increment >= resource.storage) {
        resource.total = resource.storage;
    } else {
        resource.total++;
    }
}

function unlockAnimal(animal) {
    if (animal.unlockCost <= cash && animal.unlocked == false) {
        animal.unlocked = true;
        checkUnlocked();
    }
}

function checkUnlocked() {
    if (meerkat.unlocked) {
        document.getElementById("meerkat").style.display = "grid";
        document.getElementById("meerkatUnlock").style.display = "none";
    } else {
        document.getElementById("meerkat").style.display = "none";
        document.getElementById("meerkatUnlock").style.display = "block";
    }
}

function buyShelter(animal, number) {
    if (animal.shelter.cost * number <= cash && animal.shelter.food * number <= food.total && animal.shelter.water * number <= water.total && animal.shelter.stone * number <= stone.total && animal.shelter.wood * number <= wood.total) {
        animal.shelter.number += number;
        cash -= animal.shelter.cost * number;
        food.total -= animal.shelter.food * number;
        water.total -= animal.shelter.water * number;
        stone.total -= animal.shelter.stone * number;
        wood.total -= animal.shelter.wood * number;
    }
}

function buyAnimal(animal, number) {
    if (animal.animalCost * number <= cash && (animal.shelter.number - animal.number) >= number) {
        cash -= animal.animalCost * number;
        animal.number += number;
    }
}

function buyEnrichment(animal, number) {
    if (animal.enrichment.cost * number <= cash && animal.enrichment.food * number <= food.total && animal.enrichment.water * number <= water.total && animal.enrichment.stone * number <= stone.total && animal.enrichment.wood * number <= wood.total) {
        animal.enrichment.number += number;
        cash -= animal.enrichment.cost * number;
        food.total -= animal.enrichment.food * number;
        water.total -= animal.enrichment.water * number;
        stone.total -= animal.enrichment.stone * number;
        wood.total -= animal.enrichment.wood * number;
        animal.profit += number*animal.enrichment.increment;
    }
}

function getanimalProfit(animal) {
    cash += animal.profit * animal.number;
    animal.totalProfit += animal.profit * animal.number;
}

function updateAnimal(animal) {
    document.getElementById(animal.name).children[5].children[0].children[1].innerHTML = animal.shelter.number;
    document.getElementById(animal.name).children[1].children[2].innerHTML = animal.number;
    document.getElementById(animal.name).children[5].children[1].children[1].innerHTML = "£" + comma((animal.profit * 10 * animal.number).toFixed(2));
    document.getElementById(animal.name).children[5].children[0].children[3].innerHTML = animal.enrichment.number;
    document.getElementById(animal.name).children[5].children[0].children[4].innerHTML = "£" + comma((animal.profit * 10).toFixed(2));
    document.getElementById(animal.name).children[5].children[1].children[0].innerHTML = "£" + formatNumber(animal.totalProfit); 

}

function updateanimalButtons(animal) {
    //Checks x100 shelters
    if (animal.shelter.cost * 100 <= cash && animal.shelter.food * 100 <= food.total && animal.shelter.water * 100 <= water.total && animal.shelter.stone * 100 <= stone.total && animal.shelter.wood * 100 <= wood.total) {
        document.getElementById(animal.name).children[3].children[2].disabled = false;
    } else {
        document.getElementById(animal.name).children[3].children[2].disabled = true;
    }
    //Checks x10 shelters
    if (animal.shelter.cost * 10 <= cash && animal.shelter.food * 10 <= food.total && animal.shelter.water * 10 <= water.total && animal.shelter.stone * 10 <= stone.total && animal.shelter.wood * 10 <= wood.total) {
        document.getElementById(animal.name).children[3].children[1].disabled = false;
    } else {
        document.getElementById(animal.name).children[3].children[1].disabled = true;
    }
    //Checks x1 shelters
    if (animal.shelter.cost * 1 <= cash && animal.shelter.food * 1 <= food.total && animal.shelter.water * 1 <= water.total && animal.shelter.stone * 1 <= stone.total && animal.shelter.wood * 1 <= wood.total) {
        document.getElementById(animal.name).children[3].children[0].disabled = false;
    } else {
        document.getElementById(animal.name).children[3].children[0].disabled = true;
    }

    //Checks x100 buy
    if (animal.animalCost * 100 <= cash && (animal.shelter.number - animal.number) >= 100) {
        document.getElementById(animal.name).children[0].children[2].disabled = false;   
    } else {
        document.getElementById(animal.name).children[0].children[2].disabled = true;
    }
    //Checks x10 buy 
    if (animal.animalCost * 10 <= cash && (animal.shelter.number - animal.number) >= 10) {
        document.getElementById(animal.name).children[0].children[1].disabled = false;   
    } else {
        document.getElementById(animal.name).children[0].children[1].disabled = true;
    }
    //Checks x1 buy 
    if (animal.animalCost * 1 <= cash && (animal.shelter.number - animal.number) >= 1) {
        document.getElementById(animal.name).children[0].children[0].disabled = false;   
    } else {
        document.getElementById(animal.name).children[0].children[0].disabled = true;
    }

    //Checks x100 enrichment
    if (animal.enrichment.cost * 100 <= cash && animal.enrichment.food * 100 <= food.total && animal.enrichment.water * 100 <= water.total && animal.enrichment.stone * 100 <= stone.total && animal.enrichment.wood * 100 <= wood.total) {
        document.getElementById(animal.name).children[2].children[2].disabled = false;   
    } else {
        document.getElementById(animal.name).children[2].children[2].disabled = true;
    }
    //Checks x10 enrichment
    if (animal.enrichment.cost * 10 <= cash && animal.enrichment.food * 10 <= food.total && animal.enrichment.water * 10 <= water.total && animal.enrichment.stone * 10 <= stone.total && animal.enrichment.wood * 10 <= wood.total) {
        document.getElementById(animal.name).children[2].children[1].disabled = false;   
    } else {
        document.getElementById(animal.name).children[2].children[1].disabled = true;
    }
    //Checks x1 enrichment
    if (animal.enrichment.cost * 1 <= cash && animal.enrichment.food * 1 <= food.total && animal.enrichment.water * 1 <= water.total && animal.enrichment.stone * 1 <= stone.total && animal.enrichment.wood * 1 <= wood.total) {
        document.getElementById(animal.name).children[2].children[0].disabled = false;   
    } else {
        document.getElementById(animal.name).children[2].children[0].disabled = true;
    }
}

//Checks to see if total of food/water is below 0 + production is less than 0, if so then starts killing off animals
function checkanimalResource() {
    if (food.total < 0 && (food.staffIncrement*staff.foodStaff - food.animalUse) < 0) {
        if ((butterfly.number - (((food.animalUse - (food.staffIncrement*staff.foodStaff))) / butterfly.requires.food)) < 0) {
            butterfly.number = 0;
        } else {
            butterfly.number -= (((food.animalUse - (food.staffIncrement*staff.foodStaff))) / butterfly.requires.food);
        }
    }
    if (water.total < 0 && (water.staffIncrement*staff.waterStaff - water.animalUse) < 0) {
        if ((butterfly.number - (((water.animalUse - (water.staffIncrement*staff.waterStaff))) / butterfly.requires.water)) < 0) {
            butterfly.number = 0;
        } else {
            butterfly.number -= (((water.animalUse - (water.staffIncrement*staff.waterStaff))) / butterfly.requires.water);
        }
    }
}


//Update animal requirement costs
function updateanimalresourceUse() {
    let foodT = 0;
    let waterT = 0;
    for (let x = 0; x < animalList.length; x++) {
        foodT += animalList[x].requires.food * animalList[x].number;
        waterT += animalList[x].requires.water * animalList[x].number;
    }
    food.animalUse = foodT;
    water.animalUse = waterT;
}


//Gathers Resources based on number of staff
function gatherResources() {
    if (food.total + food.staffIncrement * staff.foodStaff - food.animalUse <= food.storage) {
        food.total += food.staffIncrement * staff.foodStaff;
        food.total -= food.animalUse;
    } else {
        food.total = food.storage;
    }
    if (water.total + water.staffIncrement * staff.waterStaff - water.animalUse <= water.storage) {
        water.total += water.staffIncrement * staff.waterStaff;
        water.total -= water.animalUse;
    } else {
        water.total = water.storage;
    }
    if (stone.total + stone.staffIncrement * staff.stoneStaff <= stone.storage) {
        stone.total += stone.staffIncrement * staff.stoneStaff;
    } else {
        stone.total = stone.storage;
    }
    if (wood.total + wood.staffIncrement * staff.woodStaff <= wood.storage) {
        wood.total += wood.staffIncrement * staff.woodStaff;
    } else {
        wood.total = wood.storage;
    }
}

//Buy staff button default cost is £5
function buyStaff(no) {
    if (no * staff.staffCost <= cash) {
        staff.unusedStaff += no;
        cash -= no  * staff.staffCost;
    }
    updateTotals();
}

//Allows you to set the staff to the roles you wish
function setStaff(name, number) {
    if (name == 'foodStaff') {
        if (staff.foodStaff + number >= 0 && staff.unusedStaff - number >= 0) {
            staff.foodStaff += number;
            staff.unusedStaff -= number;
            document.getElementById("foodStaff").children[3].children[0].children[0].innerHTML = staff.foodStaff;
        }
    }
    if (name == 'waterStaff') {
        if (staff.waterStaff + number >= 0 && staff.unusedStaff - number >= 0) {
            staff.waterStaff += number;
            staff.unusedStaff -= number;
            document.getElementById("waterStaff").children[3].children[0].children[0].innerHTML = staff.waterStaff;
        }
    }
    if (name == 'stoneStaff') {
        if (staff.stoneStaff + number >= 0 && staff.unusedStaff - number >= 0) {
            staff.stoneStaff += number;
            staff.unusedStaff -= number;
            document.getElementById("stoneStaff").children[3].children[0].children[0].innerHTML = staff.stoneStaff;
        }
    }
    if (name == 'woodStaff') {
        if (staff.woodStaff + number >= 0 && staff.unusedStaff - number >= 0) {
            staff.woodStaff += number;
            staff.unusedStaff -= number;
            document.getElementById("woodStaff").children[3].children[0].children[0].innerHTML = staff.woodStaff;
        }
    }
    updateTotals();
}

function updateCash() {
    document.getElementById("cashText").innerHTML = "£" + comma(cash.toFixed(2));
}

//Disables staff incremental buttons depending on whether you can afford it or not.
function updatestaffButtons(name, numberStaff) {
    if (staff.unusedStaff >= 100) {
        document.getElementById(name+'Staff').children[6].children[0].disabled = false;
    } else {
        document.getElementById(name+'Staff').children[6].children[0].disabled = true;
    }
    if (staff.unusedStaff >= 10) {
        document.getElementById(name+'Staff').children[5].children[0].disabled = false;
    } else {
        document.getElementById(name+'Staff').children[5].children[0].disabled = true;
    }
    if (staff.unusedStaff >= 1) {
        document.getElementById(name+'Staff').children[4].children[0].disabled = false;
    } else {
        document.getElementById(name+'Staff').children[4].children[0].disabled = true;
    }

    if (numberStaff >= 100) {
        document.getElementById(name+'Staff').children[0].children[0].disabled = false;
    } else {
        document.getElementById(name+'Staff').children[0].children[0].disabled = true;
    } 
    if (numberStaff >= 10) {
        document.getElementById(name+'Staff').children[1].children[0].disabled = false;
    } else {
        document.getElementById(name+'Staff').children[1].children[0].disabled = true;
    } 
    if (numberStaff >= 1) {
        document.getElementById(name+'Staff').children[2].children[0].disabled = false;
    } else {
        document.getElementById(name+'Staff').children[2].children[0].disabled = true;
    } 

    //Staff buy button
    if (staff.staffCost * 100 <= cash) {
        document.getElementById("staff").children[3].disabled = false;
    } else {
        document.getElementById("staff").children[3].disabled = true;
    }
    if (staff.staffCost * 10 <= cash) {
        document.getElementById("staff").children[2].disabled = false;
    } else {
        document.getElementById("staff").children[2].disabled = true;
    }
    if (staff.staffCost * 1 <= cash) {
        document.getElementById("staff").children[1].disabled = false;
    } else {
        document.getElementById("staff").children[1].disabled = true;
    }
}


function updatestaffTotal() {
    document.getElementById("unusedStaff").innerHTML = "Unused: " + comma(staff.unusedStaff);
}

function updategatherTotal() {
    document.getElementById("food").children[4].children[0].innerHTML = comma((((food.staffIncrement * staff.foodStaff) * 10) - food.animalUse*10).toFixed(1)) + "/s";
    document.getElementById("water").children[4].children[0].innerHTML = comma((((water.staffIncrement * staff.waterStaff) * 10) - water.animalUse*10).toFixed(1)) + "/s";
    document.getElementById("stone").children[4].children[0].innerHTML = comma(((stone.staffIncrement * staff.stoneStaff) * 10).toFixed(1)) + "/s";
    document.getElementById("wood").children[4].children[0].innerHTML = comma(((wood.staffIncrement * staff.woodStaff) * 10).toFixed(1)) + "/s";

    if (food.staffIncrement * staff.foodStaff - food.animalUse < 0) {
        document.getElementById("food").children[4].children[0].style.color = 'red';
    } else {
        document.getElementById("food").children[4].children[0].style.color = 'green';
    }
    if (water.staffIncrement * staff.waterStaff - water.animalUse < 0) {
        document.getElementById("water").children[4].children[0].style.color = 'red';
    } else {
        document.getElementById("water").children[4].children[0].style.color = 'green';
    }
    if (stone.staffIncrement * staff.stoneStaff - stone.animalUse < 0) {
        document.getElementById("stone").children[4].children[0].style.color = 'red';
    } else {
        document.getElementById("stone").children[4].children[0].style.color = 'green';
    }
    if (wood.staffIncrement * staff.woodStaff - wood.animalUse < 0) {
        document.getElementById("wood").children[4].children[0].style.color = 'red';
    } else {
        document.getElementById("wood").children[4].children[0].style.color = 'green';
    }
}


function updateresourceTotal() {
    //Resouces total
    document.getElementById("food").children[2].children[0].innerHTML = comma(food.total.toFixed(1));
    document.getElementById("water").children[2].children[0].innerHTML = comma(water.total.toFixed(1));
    document.getElementById("stone").children[2].children[0].innerHTML =  comma(stone.total.toFixed(1));
    document.getElementById("wood").children[2].children[0].innerHTML = comma(wood.total.toFixed(1));
}


function updateTotals() {
    updateresourceTotal();
    updatestaffTotal();
    updateCash();
    updategatherTotal();
    updatestaffButtons('food', staff.foodStaff);
    updatestaffButtons('water', staff.waterStaff);
    updatestaffButtons('stone', staff.stoneStaff);
    updatestaffButtons('wood', staff.woodStaff);
    checkanimalResource();
    for (let x = 0; x < animalList.length; x++) {
        updateAnimal(animalList[x]);
        updateanimalButtons(animalList[x]);
    }

}

/* 
Animal List:
Butterfly
Meerkat
Squirrel Monkey
Red Panda
Penguin
Flamingo
Otter
Tiger
Zebra
*/