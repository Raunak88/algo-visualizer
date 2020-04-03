var arr = [], n, flag, bflag = false, search, delay;
var towers = document.getElementById("towers");
var sorted = document.getElementById("sorted");
var searched = document.getElementById("searched");
var notFound = document.getElementById("notFound");
document.getElementById("delay").value = 2000;


function assignData() {
	n = document.getElementById("data").value;

	while (arr.length < n) {
		var r = Math.floor(Math.random() * n);
		if (arr.indexOf(r) === -1) arr.push(r);
	}
}

function createTowers() {
	towers.innerHTML = ""; //empty data to reset
	for (let i = 0; i < arr.length; i++) {
		const data = document.createElement("span");
		data.className = "tower" + i;
		const data_text = document.createTextNode(arr[i]);
		data.appendChild(data_text);
		data.setAttribute('index', i);
		data.style.height = (data_text.data * 5) + 35 + "px";
		data.style.order = i;
		towers.appendChild(data);
	}
}

function resetData() {
	towers.innerHTML = "";
	arr.length = 0;
	sorted.classList.add("hide");
	searched.classList.add("hide");
	notFound.classList.add("hide");
	sorted.classList.remove("show");
	searched.classList.remove("show");
	notFound.classList.remove("show");
	document.getElementById('indexFound').innerHTML = "";
}

function bubbleSwap(el1, el2) {
	return new Promise(resolve => {

		const style1 = window.getComputedStyle(el1);
		const style2 = window.getComputedStyle(el2);

		const order1 = style1.getPropertyValue("order");
		const order2 = style2.getPropertyValue("order");
		el1.style.order = order2;
		el2.style.order = order1;
		el1.setAttribute('index', el2.style.order);
		el2.setAttribute('index', el1.style.order);

		// Wait for the transition to end!
		window.requestAnimationFrame(function () {
			setTimeout(() => {
				towers.insertBefore(el2, el1);
				resolve();
			}, 250);
		});
	});
}
async function bubbleSort() {
	var delay = document.getElementById("delay").value;

	let tower = document.querySelectorAll("span");
	for (let i = 0; i < tower.length - 1; i += 1) {
		for (let j = 0; j < tower.length - i - 1; j += 1) {
			tower[j].style.backgroundColor = "red";
			tower[j + 1].style.backgroundColor = "red";

			await new Promise(resolve =>
				setTimeout(() => {
					resolve();
				}, delay)
			);

			const value1 = Number(tower[j].childNodes[0].data);
			const value2 = Number(tower[j + 1].childNodes[0].data);

			if (value1 > value2) {
				await bubbleSwap(tower[j], tower[j + 1]);
				tower = document.querySelectorAll("span");
			}

			tower[j].style.backgroundColor = "yellow";
			tower[j + 1].style.backgroundColor = "yellow";
		}

	}

	sorted.classList.remove("hide");
	sorted.classList.add("show");
}

function selectionSwap(i, j) {
	var delay = document.getElementById("delay").value;
	return new Promise(resolve => {
		tmp = i.style.order
		i.style.order = j.style.order;
		i.setAttribute('index', j.style.order);
		j.style.order = tmp;
		j.setAttribute('index', tmp);
		window.requestAnimationFrame(function () {
			setTimeout(() => {
				towers.insertBefore(i, j);
				resolve();
			}, delay);
		});
	});
}

async function selectionSort() {
	var delay = document.getElementById("delay").value;
	let tower = document.querySelectorAll("span");
	for (let i = 0; i < tower.length; i++) {
		let min = tower[i];
		tower[i].classList.add("midIndex")
		for (let j = i + 1; j < tower.length; j++) {


			tower[j].classList.add("midIndex")
			await new Promise(resolve =>
				setTimeout(() => {
					resolve();
				}, delay)
			);
			const value1 = Number(min.childNodes[0].data);
			const value2 = Number(tower[j].childNodes[0].data);
			if (value1 > value2) {
				tower[j].classList.remove("midIndex")
				min.classList.remove("midIndex")
				min = tower[j];
				min.classList.add("midIndex")
				tower[i].classList.remove("midIndex")

			} else {
				tower[j].classList.remove("midIndex")
			}
		}

		if (min !== tower[i]) {
			await selectionSwap(tower[i], min);
			tower[i].classList.remove("midIndex");
			min.classList.add("midIndex")
			var a = document.querySelectorAll("span");
			var b = Array.prototype.slice.call(a, 0);
			tower = b.sort(function (a, b) {
				return parseInt(a.getAttribute('index'), 10) - parseInt(b.getAttribute('index'), 10);
			});
		}

	}
	sorted.classList.remove("hide");
	sorted.classList.add("show");
}


async function linearSearch() {
	var delay = document.getElementById("delay").value;
	var elToFind = document.getElementById("search_data").value;
	if (elToFind == "") {
		alert("Please enter the number to search");
	} else {
		let tower = document.querySelectorAll("span");
		var flag = true;

		for (var i = 0; i < tower.length; i++) {
			await new Promise(resolve =>
				setTimeout(() => {
					resolve();
				}, delay)
			);
			tower[i].style.backgroundColor = "red";
			if (tower[i].childNodes[0].data == elToFind) {
				tower[i].style.backgroundColor = "yellow";
				searched.classList.remove("hide");
				searched.classList.add("show");
				document.getElementById('indexFound').innerHTML = i
				break;
			} else if (i === tower.length - 1 && tower[i].childNodes[0].data !== elToFind) {
				flag = false;
			}
		}
		if (flag === false) {
			notFound.classList.remove("hide");
			notFound.classList.add("show");
		}
	}
}

async function binarySearch(delay = 2000) {
	var delay = document.getElementById("delay").value;
	arr = arr.sort(function (a, b) { return a - b });
	towers.innerHTML = "";
	createTowers();
	var elToFind = document.getElementById("search_data").value;
	if (elToFind == "") {
		alert("Please enter the number to search");
	} else {
		let tower = document.querySelectorAll("span");
		var lowIndex = 0;
		tower[lowIndex].classList.add("lowIndex")
		var highIndex = arr.length - 1;
		tower[highIndex].classList.add("highIndex");
		while (lowIndex <= highIndex) {
			var midIndex = Math.floor((lowIndex + highIndex) / 2);
			tower[midIndex].classList.add("midIndex");
			if (arr[midIndex] == elToFind) {
				tower.forEach((tower) => {
					tower.classList.remove("midIndex");
				})
				tower[midIndex].classList.add("midIndex");
				document.getElementById('indexFound').innerHTML = midIndex
				searched.classList.remove("hide");
				searched.classList.add("show");
				bflag = true;
				break;
			} else if (arr[midIndex] < elToFind) {
				await new Promise(resolve =>
					setTimeout(() => {
						resolve();
					}, delay)
				);
				tower[lowIndex].classList.remove("lowIndex");
				lowIndex = midIndex + 1;
				if (lowIndex < arr.length - 1) {
					tower[lowIndex].classList.add("lowIndex")
				} else {
					tower.forEach((tower) => {
						tower.classList.remove("midIndex");
					})
					notFound.classList.remove("hide");
					notFound.classList.add("show");
				}
			}

			else {
				await new Promise(resolve =>
					setTimeout(() => {
						resolve();
					}, delay)
				);
				if (tower[highIndex]) {
					tower[highIndex].classList.remove("highIndex")
					highIndex = midIndex - 1;
					if (highIndex > 0) {
						tower[highIndex].classList.add("highIndex")
					} else {
						notFound.classList.remove("hide");
						notFound.classList.add("show");
					}
				}
				tower[midIndex].classList.remove("midIndex");
			}

		}

	}
}