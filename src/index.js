import {Notify} from "notiflix";
import cards from './templates/cards.hbs';
import SimpleLightbox from "simplelightbox";
import  NewsApiService  from './js/fetchImages';
import './css/styles.css';
import "../node_modules/simplelightbox/src/simple-lightbox.scss";
const lightbox = new SimpleLightbox('.gallery a');


const refs ={
 galleryEl : document.querySelector(".gallery"),
 buttonSearch  : document.querySelector(".search-form"),
 buttonLoadMore : document.querySelector(".load-more"),
 inputEl : document.querySelector('input[type=text]'),
 buttonEl : document.querySelector('button[type=submit]')
}


refs.buttonEl.classList.add('is-visible');
refs.inputEl.classList.add('input-style');


refs. buttonSearch .addEventListener("submit", onSearch);
refs. buttonLoadMore.addEventListener("click", onLoadMore);

const newsApiService = new NewsApiService();
function onSearch(e) {
  e.preventDefault();

  newsApiService.query = e.currentTarget.elements.searchQuery.value;

  if (newsApiService.query.trim() === '') {
    return ;
  }

    
    newsApiService.resetPage();
    onclearImages();
    onHideBtn();
    fetchImages();
    lightbox.refresh();
}

 async function fetchImages() {
     try {
        const data = await newsApiService.fetchImages();
        const { data: { hits }, data: { totalHits } } = data;
         
        renderImagesMarkup(hits);
        onShowBtnLoadMore();
        lightbox.refresh();
        
         if (hits.length === 0) {
            onHideBtn();
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
       }
       Notify.info(`Hooray! We found ${totalHits} images.`);
        
     }
     catch (error) {
        console.log("Error: ", error)
    };
};
   
async function onLoadMore() {
    
     try {
        const data = await newsApiService.fetchImages();
        const { data: { hits }, data: {totalHits }} = data;
        renderImagesMarkup(hits);
        onShowBtnLoadMore();
        lightbox.refresh()

        const totalPages = totalHits/newsApiService.limit;
         console.log(totalPages);
         if (newsApiService.page>totalPages) {
            onHideBtn();
            Notify.failure("We're sorry, but you've reached the end of search results.");
           
         };
    }
     
     catch (error) {
         console.log("Error: ", error);
        };
};

function renderImagesMarkup(hits) {
    refs.galleryEl.insertAdjacentHTML("beforeend",cards(hits));
}

function onclearImages() {
  refs.galleryEl.innerHTML = '';
}


function onShowBtnLoadMore() {
    refs.buttonLoadMore.classList.remove("load-more");
    refs.buttonLoadMore.classList.add("is-visible"); 
};


function onHideBtn() {
    refs.buttonLoadMore.classList.remove("is-visible");
    refs.buttonLoadMore.classList.add("load-more");
}





