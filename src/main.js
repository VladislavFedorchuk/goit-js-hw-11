import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';

const url = 'https://pixabay.com/api/';

const searchParams = {
  key: '41942411-47547b04f91f4c6a01d45aac7',
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: 90,
};

const simpleGallery = new SimpleLightbox('.gallery a', {
  overlayOpacity: 0.8,
  captionsData: 'alt',
  captionDelay: 250,
});

const form = document.querySelector('.gallery-form');
const searchInput = document.querySelector('.search-input');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

form.addEventListener('submit', searchPhotos);

function searchPhotos(event) {
  event.preventDefault();
  if (!searchInput.value.trim()) {
    showErrorMessage('Please fill in the search field');
    return;
  }

  const form = event.currentTarget;

  fetchPhotos()
    .then(photos => createGallery(photos))
    .catch(error => showErrorMessage(`Something was wrong ${error}`))
    .finally(() => {
      form.reset();
      simpleGallery.refresh();
    });
}

function fetchPhotos() {
  gallery.innerHTML = '';
  loader.style.display = 'inline-block';
  searchParams.q = searchInput.value.trim();

  const searchParamsStringURL = new URLSearchParams(searchParams).toString();

  return fetch(`${url}?${searchParamsStringURL}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

function createGallery(photos) {
  if (!photos.total) {
    showErrorMessage(
      'Sorry, there are no images matching your search query. Please, try again!'
    );
    loader.style.display = 'none';
    return;
  }
  const markup = photos.hits
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<li class="gallery-item">
          <a href="${largeImageURL}">
            <img class="api-img" src="${webformatURL}" alt="${tags}">
            <div class="img-desc">
              <span><b>Likes:</b> <br/>${likes}</span>
              <span><b>Views:</b> <br/>${views}</span>
              <span><b>Comments:</b> <br/>${comments}</span>
              <span><b>Downloads:</b> <br/>${downloads}</span>
            </div>
          </a>
        </li>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('afterbegin', markup);
  loader.style.display = 'none';
}

function showErrorMessage(message) {
  iziToast.show({
    position: 'topRight',
    iconUrl: errorSvg,
    message,
    backgroundColor: '#EF4040',
    messageColor: '#FAFAFB',
    messageSize: '16px',
    close: false,
    closeOnClick: true,
    closeOnEscape: true,
  });
}