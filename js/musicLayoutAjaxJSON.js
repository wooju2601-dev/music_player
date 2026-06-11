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


let playlistToggleBtn;
let playlistBox;
let playlistSelect;
let playBtn;

const songTitleEl = document.getElementById("songTitle");
const artistNameEl = document.getElementById("artistName");
const imgChange = document.getElementById("img_change");
progressBar = document.getElementById("progressBar");


function mInit() {
  loadJSON();   //XML->JSON

  myAudio = document.getElementById("audio_ele");
  songList = document.getElementById("songlist");
  musicLoop = document.getElementById("music_loop");
  listChk = document.getElementById("list_chk");
  imgBtn = document.querySelectorAll(".img_btn");

  currTime = document.getElementById("currTime");
  totalTime = document.getElementById("totalTime");


  playlistToggleBtn = document.getElementById("choice_image");
  playlistBox = document.getElementById("songs");
  playlistSelect = document.getElementById("songlist");
  playBtn = document.getElementById("play");

  myAudio.addEventListener("loadedmetadata", totTime);

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
    if (!myAudio.duration) return;

    progressBar.max = myAudio.duration;
    progressBar.value = myAudio.currentTime;
    currentTime();
  });

  progressBar.addEventListener("input", function () {
    myAudio.currentTime = progressBar.value;
  });

  musicLoop.addEventListener("click", function () {
    isLoop = !isLoop;
    musicLoop.style.opacity = isLoop ? "1" : "0.4";
  });

  myAudio.addEventListener("ended", function () {
    if (isLoop) {
      myAudio.currentTime = 0;
      myAudio.play();
    } else {
      mNext();
    }
  });

  playlistBox.style.display = "none";
  songList.addEventListener("change", musicChoice);

  playlistToggleBtn.onclick = function () {
    playlistBox.style.display =
      playlistBox.style.display === "block" ? "none" : "block";
  };
}


function makePlaylist() {
  songList.innerHTML = "";

  for (let i = 0; i < cdList.length; i++) {
    const opt = document.createElement("option");
    opt.text = cdList[i].TITLE;
    songList.appendChild(opt);
  }
}

function setMusic(idx) {
  const cd = cdList[idx];

  myAudio.src = cd.MUSIC;
  songTitleEl.textContent = cd.TITLE;
  artistNameEl.textContent = cd.ARTIST;
  imgChange.src = cd.IMG;

  songList.selectedIndex = idx;
}

function musicChoice() {
  optIdx = songList.selectedIndex;
  setMusic(optIdx);

  myAudio.play();
  playBtn.src = "./../img/fause.png";
  sw1 = 1;

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
  if (!cdList) return;
  optIdx++;
  if (optIdx >= cdList.length) optIdx = 0;
  setMusic(optIdx);
  myAudio.play();
  sw1 = 1;
}

function mPrevious() {
  if (!cdList) return;
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

function totTime() {
  let totMin = Math.floor(myAudio.duration / 60);
  let totSec = Math.floor(myAudio.duration % 60);
  totalTime.value = totMin + ":" + String(totSec).padStart(2, "0");
  progressBar.max = myAudio.duration;
}

function currentTime() {
  let curMin = Math.floor(myAudio.currentTime / 60);
  let curSec = Math.floor(myAudio.currentTime % 60);
  currTime.value = curMin + ":" + String(curSec).padStart(2, "0");
  progressBar.value = myAudio.currentTime;
}

function loadJSON() {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      cdList = response.CATALOG.CD;

      makePlaylist();
      setMusic(0);
    }
  };

  xhr.open("GET", "./../json/music_catalog.json", true);
  xhr.send();
}
