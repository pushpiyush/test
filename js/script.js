const navEntry = performance.getEntriesByType('navigation')[0];
const examNode = document.getElementById("exam");
const examDetailNode = document.getElementById("exam-detail");
const testNode = document.getElementById("test");
const navExamNode = document.getElementById("nav-exam-name");
const selectYearNode = document.getElementById("select-year");
const filterNode = document.getElementById("filter");
const filterOptionsNode = document.getElementById("filter-options");
const filterTypeNode = document.getElementById("filter-type");
const filterModalNode = document.getElementById("filter-modal");

const exams = {
  jee_mains: ["icons/jee_mains.webp", "icons/jee_mains.webp", "jm"],
  jee_advanced: ["icons/jee_mains.webp", "icons/jee_mains.webp", "ja"],
  neet: ["icons/jee_mains.webp", "icons/jee_mains.webp", "neet"],
  cuet: ["icons/jee_mains.webp", "icons/jee_mains.webp"],
  bitsat: ["icons/jee_mains.webp", "icons/jee_mains.webp"],
  viteee: ["icons/jee_mains.webp", "icons/jee_mains.webp"],
  cat: ["icons/jee_mains.webp", "icons/jee_mains.webp"],
  gate: ["icons/jee_mains.webp", "icons/jee_mains.webp"],
  upsc: ["icons/jee_mains.webp", "icons/jee_mains.webp"],
  clat: ["icons/jee_mains.webp", "icons/jee_mains.webp"],
  nda: ["icons/jee_mains.webp", "icons/jee_mains.webp"],
  gre: ["icons/jee_mains.webp", "icons/jee_mains.webp"],
};
const ecardColor = 4; //number of var(--ecard) in css
const testCardDisplayDelay = 0.1; //s

const intro = {
  "3026": ["012201"],
  "3025": ["012201"],
  "3024": ["012701"],
  "3023": ["012401"],
  "3022": ["062401"],
  "3021": ["022301"],
  "3020": ["010601"]
}
let testDate = intro;

// https://raw.githubusercontent.com/pushpiyush/test/refs/heads/main/json/${name}_date.json
async function getTestDate(name) {
  try {
    const response = await fetch(`/json/${name}_date.json`);
    if (response.ok) {
      const text = await response.text();
      const result = JSON.parse(text);
      return result;
    } else {
      return {}; // don't remove this
    }
  } catch (err) {
    console.log(`Error in fetching ${name}_date.json: \n`+err.message);
  }
}

const monthNames = ["", "Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

function examCard(name, image, num) {
  const name2 = name.replace("_", " ").toUpperCase();
  return `<div class="exam-card" title=${name} onclick=examCardClick(this)>
    <img src=${image}>
    <h4>${name2}</h4>
  </div>`;
  
  //style="background-color: var(--ecard${num})
}

function testCard(year, date, num, name="jee_mains") {
  name = "jee_mains";
  const month = monthNames[(Number(date.slice(0,2)))];
  const EXAM = `${exams[name][2]}${year}${date}`;
  /*return `<div class="test-card" style="animation: slidedown 0.3s ${(num-1)*testCardDisplayDelay}s both" onclick="window.location.href='test_preview.html#${EXAM}'">
      <p class="result-preview"></p>
      <p class="test-year">${year}</p>
      <p class="test-date">${month} ${date.slice(2,4)}</p>
      <p class="test-shift">Shift ${date.slice(5)}</p>
      <img src="icons/arrow_right.svg">
    </div>`*/
  return `<div class="test-card" style="animation: slidedown 0.3s ${(num-1)*testCardDisplayDelay}s both" onclick="window.location.href='test_preview.html#${EXAM}'">
        <div class="test-img"><img src="../icons/jee_mains9.png" style="width: 100%; height: 100%;"></div>
        <div class="test-body">
          <div class="test-date">${date.slice(2,4)} ${month}</div>
          <div class="test-year">${year}</div>
        </div>
        <div class="result-preview"></div>
        <div class="test-right">
          <span class="test-shift">Shift ${date.slice(5)}</span>
          <span class="test-arrow">→</span>
        </div>
    </div>`
}

function createExamCards(exams) {
  let el = "";
  let i = 1;
  for (let name in exams) {
    el += examCard(name, exams[name][0], i%ecardColor);
    i += 1;
  }
  examNode.innerHTML = el;
}

function createTestCards(tests, order="dsc",name = "jee_mains") {
  let el = "";
  let yr = "";
  let total = Object.values(tests).reduce((total, arr) => total + arr.length, 0);
  let num = 1; //change it to 4 for asc delay during filtermodal close
  for (let y in tests) {
    tests[y].forEach((v) => {
      if (order=="dsc") {
        num = Math.min(total, 20);
        el =  testCard(y, v, num, name) + el;
      } else {
        el +=  testCard(y, v, num, name);
        num += 1;
      }
      total -= 1;
    });
  }
  testNode.innerHTML = el;
}

const SKELETON = {
  pd: "Loading Data ...",
  timeoutId3: null,
  timeoutId4: null,
  
  el: function(text) {
    const cards = Array(7).fill('<div class="skeleton-test-card"></div>').join('');
    return `
      ${cards}
      <p style="text-align: center; color: var(--ptext); font-size: 14px;">${text}</p>
    `;
  },
  
  main: function() {
    testNode.innerHTML = this.el(this.pd);
    this.timeoutId3 = setTimeout(() => {
      this.pd = "Taking longer than usual...";
      testNode.innerHTML = this.el(this.pd);
    }, 3000);
    
    this.timeoutId4 = setTimeout(() => {
      this.pd = "Give a cheers for your patience...";
      testNode.innerHTML = this.el(this.pd);
    }, 10000);
  },
  
  clear: function() {
    if (this.timeoutId3) {
      clearTimeout(this.timeoutId3);
      this.timeoutId3 = null;
    }
    if (this.timeoutId4) {
      clearTimeout(this.timeoutId4);
      this.timeoutId4 = null;
    }
    this.pd = "Loading Data ...";
  }
};


function createYearFilter(tests, year=false) {
  let yr = "";
  for (let y in tests) {
    if (year && y==year) {
      yr = `<p title="${y}" onclick="selectYearFilter(this.title)" class="active">${y}</p>` + yr;
    } else {
      yr = `<p title="${y}" onclick="selectYearFilter(this.title)">${y}</p>` + yr;
    }
  }
  if (!year) {
    yr = `<p title="Reset" class="reset" onclick="">Reset</p>` + yr;
  } else {
    yr = `<p title="Reset" class="reset active" onclick="selectYearFilter(this.title)">Reset</p>` + yr;
  }
  
  selectYearNode.innerHTML = yr;
}

function changeExamName(name) {
  const name2 = name.split("_").at(-1).toUpperCase();
  const myDiv = navExamNode.firstElementChild;
  myDiv.style.animation = "godown 0.5s ease-in";
  setTimeout((() => {
    myDiv.textContent = `${name2}`;
    myDiv.style.color = "var(--ptext)";
    myDiv.style.animation = " comedown 0.5s ease-out";
  }), 500);
  setTimeout((() => {
    myDiv.style.borderBottom = "2px solid var(--brand)";
  }), 1000);
  navExamNode.title = `${name}`;
}

//has got issue. Currently not functional
function navExamNameClick(title) {
  if (title == "exam") {
  } else {
  /*  //window.location.assign(`index.html#${title}`);
   history.pushState(null, "", `#${title}`);
   openExamDetail(title);*/
  }
}

async function openExamDetail(name, his=true) {
  const style = document.createElement('style');
  style.textContent = `#exam-section h3::after { background: linear-gradient(to right, transparent, var(--bgcolor), transparent); animation: glint 1.5s ease-in-out forwards; }`;

  examNode.classList.add("hide");
  examDetailNode.classList.remove("hide");
  examDetailNode.firstElementChild.firstElementChild.setAttribute("src", exams[name][1]);
  examDetailNode.parentElement.getElementsByTagName("h3")[0].textContent = name.replace("_", " ").toUpperCase();
  document.head.appendChild(style);
  
  window.addEventListener("popstate", () => {
      location.reload();
  });
  if (his) {
    history.pushState(null, "", `#${name}`);
  }
  
  changeExamName(name);
  SKELETON.main();
  
  console.log(`Fetching data for ${name}`);
  let time = Date.now();
  testDate = await getTestDate(name);
  console.log(`Data Fetched Successfully.\nTime taken: ${Date.now() - time}ms\ntestDate:`, testDate);
  SKELETON.clear();
  
  createTestCards(testDate, "dsc" , name);
  createYearFilter(testDate);
  createYearOptions(testDate);
}

function selectYearFilter(year) {
  if (year=="Reset") {
    createTestCards(testDate);
    createYearFilter(testDate);
    createYearOptions(testDate);
    return;
  }
  const newDate = {};
  for (let y in testDate) {
    if (y == year) {
      newDate[y] = testDate[y];
    }
  }
  
  createTestCards(newDate);
  createYearFilter(testDate, year);
}

if (navEntry.type === 'reload') {
  const h = window.location.hash;
  if (h != "") {
    const n = h.slice(1);
    openExamDetail(n, false);
  }
}

createExamCards(exams);
createTestCards(testDate);
createYearFilter(testDate);
createYearOptions(testDate);

function examCardClick(t) {
  let cardWidth = t.offsetWidth;
  let vW = examNode.clientWidth;
  let scrollLeft = examNode.scrollLeft;
  let cardLeft = t.offsetLeft;
  let currentLeft = cardLeft-scrollLeft;
  let currentX = currentLeft + cardWidth/2;
  let moveX = vW/2 - currentX;
  let reqScaleX = (vW-40)/cardWidth;
  
  t.style.transform = `translateX(${moveX}px) scaleX(${reqScaleX})`;
  
  setTimeout(() => {openExamDetail(t.title)}, 250);
}

const ftcn = filterTypeNode.children;
ftcn[1].classList.add("active");
let ticking = false;
let p =0;
let recentFT = ftcn[1];

filterOptionsNode.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      let l = Number(filterOptionsNode.scrollLeft.toFixed());
      let w = filterOptionsNode.offsetWidth;
      let n = Number((l/w).toFixed());
      if (n>p || n<p) {
        recentFT.classList.remove("active");
        ftcn[n+1].classList.add("active");
        recentFT = ftcn[n+1];
        p = n;
      }
      ticking = false;
    });
    ticking = true;
  }
});

Array.from(ftcn).forEach((ch, index) => {
  if (index==0) {
    ch.addEventListener("click", () => {
      filterOptionsNode.scrollTo({
      left: filterOptionsNode.offsetWidth * (index),
      behavior: 'smooth'
      });
      document.querySelectorAll('#filter-options input').forEach(input => {
        input.checked = input.defaultChecked;
      });
    });
    return;
  }
  ch.addEventListener("click", () => {
    filterOptionsNode.scrollTo({
      left: filterOptionsNode.offsetWidth * (index - 1),
      behavior: 'smooth'
    });
  })
});

let filterModalOpen = false;
let ow = filterNode.clientWidth;
filterNode.style.minWidth = `${ow}px`;

function openFilterModal() {
  if (filterModalOpen) {
    filterNode.style.animation = "rotatex-anticlock 0.2s"
    applyFilter();
    setTimeout(() => {
      filterNode.innerHTML = `Filter<span class="material-symbols-outlined">filter_list</span>`;
      filterNode.style.animation = "rotatex-anticlock2 0.2s"}, 200);
    filterModalNode.style.maxHeight = "0px";
  } else {
    filterNode.style.animation = "rotatex-clock 0.2s"
    setTimeout(() => {
      filterNode.innerHTML = `Apply<span class="material-symbols-outlined" style="transform: rotate(180deg);">filter_list</span>`;
      filterNode.style.animation = "rotatex-clock2 0.2s"}, 200);
    filterModalNode.style.maxHeight = "300px";
  }
  filterModalOpen = !filterModalOpen;
}

function applyFilter() {
  const sort = Array.from(document.querySelectorAll("input[name=sort]:checked")).map((e) => {return e.value});
  const evaluated = Array.from(document.querySelectorAll("input[name=au]:checked")).map((e) => {return e.value});
  const year = Array.from(document.querySelectorAll("input[name=yf]:checked")).map((e) => {return e.value});
  const shift = Array.from(document.querySelectorAll("input[name=shift]:checked")).map((e) => {return e.value});
  const session = Array.from(document.querySelectorAll("input[name=session]:checked")).map((e) => {return e.value});
  
  
  const newDate = {};
  // filtering year
  year.forEach((y) => {
    if (testDate[y]) {
      newDate[y] = [...testDate[y]];
      //If we do newDate[y] = testDate[y]. newDate[y] will copy the reference and not the value. Hence, any change in newDate[y] will also change testDate[y]
    }
  });
  
  //filtering shift
  for (let d in newDate) {
  newDate[d] = newDate[d].filter(p => shift.includes(p.slice(4, 6)));
  }
  
  //filtering session
 /* for (let d in newDate) {
  newDate[d] = newDate[d].filter(p => session.includes(p.slice(6, 8)));
  }
  */
  
  for (let d in newDate) {
    if (newDate[d].length == 0) {
      delete newDate[d];
    }
  }

  createTestCards(newDate, sort);
  createYearFilter(testDate, "dummy");
}

function createYearOptions(test) {
  let yr = "";
  for (let y in test) {
    yr = `<label><input type="checkbox" name="yf" value="${y}" checked onclick="yearOptionsSelect()">${y}</label>` + yr;
  }
  yr = `<label><input id="all-year" type="checkbox" name="reset" value="all" checked onclick="allYearOptionsSelect(this)">All</label><label></label>` + yr;
  document.getElementById("years-options").innerHTML = yr;
}

function yearOptionsSelect() {
    const year = Array.from(document.querySelectorAll("input[name=yf]:checked")).map((e) => {return e.value});
    const a = document.querySelector("input[name=reset]");
    if (year.length == Object.keys(testDate).length) {
      a.checked = true;
    } else {
      a.checked = false;
    }
  }
  
function allYearOptionsSelect(t) {
    if (t.checked) {
      Array.from(document.querySelectorAll("input[name=yf]")).forEach((e) => {e.checked = true});
    } else {
      Array.from(document.querySelectorAll("input[name=yf]")).forEach((e) => {e.checked = false});
    }
  }


/*
Functions of Test Section

-----testCard(year, date, num)
To create html tags and details for a card

-----createTestCards(test, order="dsc")
To create all the test cards of given test with testCard function and place then using innerHTML.
It will call testCard()

-----createYearFilter(tests, year=false)
To create reset, and other year buttons that are directly visible under #year-filter tag.

-----selectYearFilter(year)
Function that runs when any (directly visible) year or reset button is selected
It will sort the data and call createTestCards() and createYearFilter()

-----openFilterModal()
Function that executes when "Filter" button is clicked.It calls createYearOptions(). If that button is "OK", it calls applyFilter()

-----applyFilter()
Function that takes all value of filter options and sort the data accordingly and calls createTestCards() and createYearFilter(). createYearFilter is called to activate the reset button and deactivate(remove border) any selected year options.

-----createYearOptions(test)
To create options for Year in #filter-modal.

*/




/*
----------------------    TO   DO    ----------------------
1. Fetching data from server takes time and while those time, the previous-intro test cards are still there. Replace them with skeleton screens with shimmer effect.




*/
