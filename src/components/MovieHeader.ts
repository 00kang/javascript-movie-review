import { POPULAR_TITLE } from '../constants';
import { changeTitle, resetSearchBox } from '../dom';
import { LOGO } from '../icons';

import { $, dispatchCustomEvent, isFormElement } from '../utils/domUtils';

class MovieHeader extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = /* html */ `
      <header>
        <h1 class="title" aria-label="Movielist 로고">${LOGO}</h1>
        <form class="search-box">
          <input id="search-input" type="text" placeholder="검색" required />
          <button class="search-button">검색</button>
        </form>
      </header>
    `;
  }

  connectedCallback() {
    const $searchBox = $('.search-box');
    if (isFormElement($searchBox)) {
      $searchBox.addEventListener('submit', (e: SubmitEvent) => this.handleSubmit(e));
    }

    $('.title')?.addEventListener('click', () => this.handleLogoClick());
  }

  handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (!(e.target instanceof HTMLFormElement)) return;

    const [input] = e.target.elements;
    if (!(input instanceof HTMLInputElement)) return;

    const trimmedInput = input.value.trim();
    const isInputEmpty = trimmedInput === '';
    if (isInputEmpty) {
      alert('검색어를 입력해 주세요.');
      return;
    }

    changeTitle(`"${trimmedInput}" 검색 결과`);
    dispatchCustomEvent(this, 'search', trimmedInput);
  }

  handleLogoClick() {
    changeTitle(POPULAR_TITLE);
    resetSearchBox();
    dispatchCustomEvent(this, 'home');
  }
}

export default MovieHeader;