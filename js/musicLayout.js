
let myAudio;
let songList;
let musicLoop;
let listChk;
let imgBtn;
let progressBar;
let isLoop = false; 
let currTime, totalTime;
let cdList;

let optIdx = 0;   
let sw1 = 0;      


const playlistToggleBtn = document.getElementById("choice_image");
const playlistBox = document.getElementById("songs");
const playlistSelect = document.getElementById("songlist");
const playBtn = document.getElementById("play");

const songTitleEl = document.getElementById("songTitle");
const artistNameEl = document.getElementById("artistName");
const imgChange = document.getElementById("img_change");
progressBar = document.getElementById("progressBar");




function mInit() {
  loadXML();
  myAudio = document.getElementById("audio_ele");
  songList = document.getElementById("songlist");
  musicLoop = document.getElementById("music_loop");
  listChk = document.getElementById("list_chk");
  imgBtn = document.querySelectorAll(".img_btn");

  currTime=document.getElementById("currTime");
  totalTime=document.getElementById("totalTime");

  
for (let i = 0; i < imgBtn.length; i++) {
  imgBtn[i].addEventListener("click", () => {
    switch (i) {
      case 0: mFirst(); break;
      case 1: mPrevious(); break;
      case 2: togglePlay(); break;
      case 3: mNext(); break;
      case 4: mLast(); break;
      case 5: mStop(); break;
    }
  });
}

myAudio.addEventListener("timeupdate", function () {
  if (!myAudio.duration) {
    return;
  }
  progressBar.max = Math.floor(myAudio.duration);
  progressBar.value = Math.floor(myAudio.currentTime);

   currentTime();
});
progressBar.addEventListener("input", function () {
  myAudio.currentTime = progressBar.value;
});
musicLoop.addEventListener("click", function () {
  isLoop = !isLoop;   
  if (isLoop) {
    musicLoop.style.opacity = "1";     
  } else {
    musicLoop.style.opacity = "0.4";
  }
});
myAudio.addEventListener("ended", function () {
  if (isLoop) {
      myAudio.currentTime = 0;
    myAudio.play();
  } else {
     mNext();
  }
});
//  setMusic(optIdx);

  playlistBox.style.display = "none";
  songList.addEventListener("change", musicChoice);
}

function makePlaylist() {
  songList.innerHTML = "";

  for (let i = 0; i < cdList.length; i++) {
    const title =
    cdList[i].getElementsByTagName("TITLE")[0].textContent;

    const opt = document.createElement("option");
    opt.text = title;
    songList.appendChild(opt);
  }
}

function setMusic(idx) {
  const cd = cdList[idx];

  const title = cd.getElementsByTagName("TITLE")[0].textContent;
  const artist = cd.getElementsByTagName("ARTIST")[0].textContent;
  const img = cd.getElementsByTagName("IMG")[0].textContent;
  const music = cd.getElementsByTagName("MUSIC")[0].textContent;

  myAudio.src = music;
  songTitleEl.textContent = title;
  artistNameEl.textContent = artist;
  imgChange.src = img;

  songList.selectedIndex = idx;
}

playlistToggleBtn.onclick = function () {
  playlistBox.style.display =
    playlistBox.style.display === "block" ? "none" : "block";
};

function musicChoice() {
  optIdx = songList.selectedIndex;
  myAudio.play();
  playBtn.src = "./../img/fause.png";
  sw1 = 1;

  setMusic(optIdx);
  playlistBox.style.display = "none";
}

function togglePlay() {
  if (sw1 === 0) {
    myAudio.play();
    playBtn.src = "./../img/fause.png";
    sw1 = 1;
  } else {
    myAudio.pause();
    playBtn.src = "./../img/end_files/5529954.png";
    sw1 = 0;
  }
}

function mNext() {
  optIdx++;
  if (optIdx >= cdList.length) optIdx=0;

  setMusic(optIdx);
  myAudio.play();
  sw1 = 1;
}

function mPrevious() {
  optIdx--;
  if (optIdx < 0) optIdx = cdList.length - 1;

  setMusic(optIdx);
  myAudio.play();
  sw1 = 1;
}

function mFirst() {
  optIdx = 0;
  setMusic(optIdx);
  myAudio.play();
  playBtn.src = "./../img/fause.png";
  sw1 = 1;
}

function mLast() {
  optIdx = cdList.length - 1;
  setMusic(optIdx);
  myAudio.play();
  playBtn.src = "./../img/fause.png";
  sw1 = 1;
}
function mStop() {
  myAudio.pause();
  myAudio.currentTime = 0;
  playBtn.src = "./../img/end_files/5529954.png";
  sw1 = 0;
}
myAudio.addEventListener('loadedmetadata', totTime);
progressBar.oninput = function () {
  moveBar();
};

function moveBar() {
  myAudio.currentTime = progressBar.value;
}

function totTime() {
  let totMin = Math.floor(myAudio.duration / 60);
  let totSec = Math.floor(myAudio.duration % 60);
  let sTotSec = String(totSec).trim();

  if (totSec < 10) {
    if (totSec == 0) {
      sTotSec = sTotSec.replace('0', '00');
    } else {
      sTotSec = sTotSec.padStart(2, '0');
    }
  }

  totalTime.value = totMin + ":" + sTotSec;
  progressBar.max = myAudio.duration;
}

function currentTime() {
  let curMin = Math.floor(myAudio.currentTime / 60);
  let curSec = Math.floor(myAudio.currentTime % 60);

  let sCurSec = String(curSec).trim(); // 문자열 함수 쓰기 위해 변환

  if (curSec < 10) {
    if (curSec == 0) {
      sCurSec = sCurSec.replace('0', '00');
    } else {
      sCurSec = sCurSec.padStart(2, '0');
    }
  }
  currTime.value = curMin + ":" + sCurSec;

  if (myAudio.currentTime == 0) {
    currTime.value = '0:00';
  }

  progressBar.value = myAudio.currentTime;
  totTime(); 
}
function loadXML() {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
  const xmlDoc = xhr.responseXML;
  cdList = xmlDoc.getElementsByTagName("CD");

  makePlaylist();   // select 채우기
  setMusic(0);      // 첫 곡 세팅
  };

  xhr.open("GET", "./../xml/music_catalog.xml", true);
  xhr.send();
}
