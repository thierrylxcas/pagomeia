const API_KEY = "69f20920b621de40289df7481ea14b29";
const IMG_BASE = "https://image.tmdb.org/t/p/original";

let currentMovie = null;
let images = [];
let step = 0;

async function getRandomMovie(){
  const page = Math.floor(Math.random()*500)+1;
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=pt-BR&sort_by=popularity.desc&page=${page}`
  );
  const data = await res.json();
  const movie = data.results[Math.floor(Math.random()*data.results.length)];
  return movie;
}

async function getImagesForMovie(movie){
  try{
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=${API_KEY}`);
    const data = await res.json();
    let imgs = data.backdrops;
    if(!imgs || imgs.length===0){
      if(movie.poster_path) imgs = [{file_path: movie.poster_path}];
      else imgs=[];
    }
    if(imgs.length > 5) imgs = imgs.sort(()=>0.5-Math.random()).slice(0,5);
    while(imgs.length < 5) imgs.push(imgs[0]);
    return imgs.map(i => IMG_BASE + i.file_path);
  } catch(e){console.error(e); return [];}
}

async function newRound(){
  document.getElementById("answer").innerText = "";
  step = 0;
  document.getElementById("counter").innerText = `Imagem 1/5`;
  currentMovie = await getRandomMovie();
  images = await getImagesForMovie(currentMovie);
  if(images.length===0) return newRound();
  showImage();
}

function showImage(){
  const img = document.getElementById("frame");
  img.src = images[step];
  img.style.filter = step<4?"blur(12px)":"blur(0)";
  document.getElementById("counter").innerText = `Imagem ${step+1}/5`;
}

document.getElementById("next").onclick = ()=>{if(step<4){step++; showImage();}};
document.getElementById("prev").onclick = ()=>{if(step>0){step--; showImage();}};
document.getElementById("reveal").onclick = ()=>{step=4; showImage(); document.getElementById("answer").innerText = currentMovie.title;};

newRound();
