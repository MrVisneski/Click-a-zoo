var food = 0;

function gather(resource) {
    if (resource == food) {
        food++;
        document.getElementById("food").children[2].children[0].innerHTML = food;
        document.getElementById("foodStaff").children[3].children[0].children[0].innerHTML = food;
    }
}