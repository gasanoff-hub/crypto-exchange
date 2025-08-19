document.addEventListener('DOMContentLoaded', async () => {
  const el = {
    swapBtn: document.querySelectorAll('.btn-swap'),
    swapOption: document.querySelectorAll('.btn-swap__option'),
    swapOverlay: document.querySelector('.header__language--overlay'),
    selectinput: document.querySelectorAll('.swap__select--input'),
    selectBtn1: document.querySelector('#swap__input-1 .btn-swap__currency'),
    selectBtn2: document.querySelector('#swap__input-2 .btn-swap__currency'),
    selectCoin: document.querySelector('.swap__select--token'),
    changeIcon: document.querySelector('.swap__switch'),
    infoMenu: document.querySelectorAll('.swap__info-row'),
    infoHeader: document.querySelector('.swap__info--header'),
    searchInput: document.querySelector('.swap__search-input'),
    searchInputList: document.querySelector('.swap__search--list'),
    coinList: document.querySelector('.swap__select--list'),
    swapInputValue1: document.querySelector('#swap__input-1 .swap__approx-value'),
    swapInputValue2: document.querySelector('#swap__input-2 .swap__approx-value'),
    swapInput: document.querySelectorAll('.swap__input')
  };

  let activeSelectBtn = null;
  let coinPrices = { coin1: 0, coin2: 1 };

  const toggleClass = (els, cls, active) => {
    els.forEach(el => el.classList.remove(cls));
    active.classList.add(cls);
  };

  const fetchCoins = async (filter = null) => {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false';
    const data = await (await fetch(url)).json();
    return filter === 'stable' ? data.filter(c => c.symbol.toLowerCase().includes('usd')) : data;
  };

  const allCoins = async q => {
    if (!q) return [];
    return (await (await fetch(`https://api.coingecko.com/api/v3/search?query=${q}`)).json()).coins || [];
  };

  const setCoinHTML = (el, coin) => {
    el.innerHTML = `
      <img class="swap__btn-img" src="${coin.image || coin.thumb || ''}">
      <span class="swap__currency-text" title="${coin.name}">${coin.symbol?.toUpperCase() || ''}</span>
    `;
  };

  const getPrice = async id =>
    (await (await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`)).json())[id]?.usd || 0;

  const renderCoins = (data, target = 'select') => {
    const container = target === 'search' ? el.searchInputList : el.coinList;
    container.innerHTML = '';

    data.forEach(coin => {
      if (!coin.symbol) return;
      const item = document.createElement('div');
      item.className = target === 'search' ? 'swap__search--item' : 'swap__select--item';
      item.innerHTML = `
        <div class="${target === 'search' ? 'swap__search--container' : 'swap__select--container'}">
          <img class="${target === 'search' ? 'swap__search--img' : 'swap__select--img'}" src="${coin.image || coin.thumb}" alt="${coin.name}">
          <span class="${target === 'search' ? 'swap__search--text' : 'swap__select--coin-name'}">${coin.symbol.toUpperCase()}</span>
        </div>
        <i class="icon icon-star fa-solid fa-star"></i>
      `;

      item.addEventListener('click', async () => {
        if (target === 'select') {
          setCoinHTML(activeSelectBtn, coin);
          el.selectCoin.classList.add('hidden');
          el.swapOverlay.classList.add('hidden');

          const price = await getPrice(coin.id);
          if (activeSelectBtn === el.selectBtn1) {
            coinPrices.coin1 = price;
            el.swapInputValue1.textContent = `$${price}`;
            el.swapInput[1].value = (el.swapInput[0].value * price).toFixed(6);
          } else {
            coinPrices.coin2 = price;
            el.swapInputValue2.textContent = `$${price}`;
            el.swapInput[0].value = (el.swapInput[1].value / coinPrices.coin1).toFixed(6);
          }
        } else {
          el.searchInput.value = '';
          el.searchInputList.classList.add('hidden');
          window.dispatchEvent(new CustomEvent('coinSelected', { detail: coin.symbol.toUpperCase() }));
        }
      });

      container.appendChild(item);
    });
  };

  const setDefaultCoins = async () => {
    const data = await (await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,tether')).json();
    const btc = data.find(c => c.id === 'bitcoin'), usdt = data.find(c => c.id === 'tether');

    if (btc && usdt) {
      [el.selectBtn1, el.selectBtn2].forEach((btn, i) => setCoinHTML(btn, i ? usdt : btc));
      [coinPrices.coin1, coinPrices.coin2] = [btc.current_price, usdt.current_price];
      [el.swapInputValue1.textContent, el.swapInputValue2.textContent] = [`$${btc.current_price}`, `$${usdt.current_price}`];
      el.swapInput[0].value = el.swapInput[1].value = 0;
    }
  };

  await setDefaultCoins();

  // Events
  document.addEventListener('click', () => el.searchInputList.classList.add('hidden'));
  el.infoHeader.addEventListener('click', () => el.infoMenu.forEach(i => i.classList.toggle('hidden')));
  el.swapBtn.forEach(btn => btn.addEventListener('click', () => toggleClass(el.swapBtn, 'btn-swap__mode--active', btn)));
  el.swapOption.forEach(opt => opt.addEventListener('click', () => toggleClass(el.swapOption, 'btn-swap__option--active', opt)));

  el.changeIcon.addEventListener('click', () => {
    [el.selectBtn1.innerHTML, el.selectBtn2.innerHTML] = [el.selectBtn2.innerHTML, el.selectBtn1.innerHTML];
    [coinPrices.coin1, coinPrices.coin2] = [coinPrices.coin2, coinPrices.coin1];
    [el.swapInputValue1.textContent, el.swapInputValue2.textContent] = [el.swapInputValue2.textContent, el.swapInputValue1.textContent];
    [el.swapInput[0].value, el.swapInput[1].value] = [el.swapInput[1].value, el.swapInput[0].value];
  });

  el.searchInput.addEventListener('click', e => {
    e.stopPropagation();
    el.searchInputList.classList.remove('hidden');
    activeSelectBtn = el.searchInput;
    fetchCoins().then(d => renderCoins(d, 'search'));
  });

  el.searchInput.addEventListener('input', async e => {
    const q = e.target.value.trim();
    renderCoins(q ? await allCoins(q) : await fetchCoins(), 'search');
  });

  [el.selectBtn1, el.selectBtn2].forEach((btn, i) => {
    btn.addEventListener('click', () => {
      activeSelectBtn = btn;
      el.selectCoin.classList.toggle('hidden');
      el.swapOverlay.classList.toggle('hidden');
      fetchCoins(i ? 'stable' : null).then(renderCoins);
    });
  });

  el.swapOverlay.addEventListener('click', () => {
    el.selectCoin.classList.add('hidden');
    el.swapOverlay.classList.add('hidden');
  });

  el.selectinput.forEach(inp =>
    inp.addEventListener('input', async e => {
      const q = e.target.value.trim();
      renderCoins(q ? await allCoins(q) : await fetchCoins(), 'select');
    })
  );

  el.swapInput[0].addEventListener('input', () => {
    const v = parseFloat(el.swapInput[0].value) || 0;
    el.swapInput[1].value = coinPrices.coin1 && coinPrices.coin2 ? ((v * coinPrices.coin1) / coinPrices.coin2).toFixed(6) : 0;
  });

  el.swapInput[1].addEventListener('input', () => {
    const v = parseFloat(el.swapInput[1].value) || 0;
    el.swapInput[0].value = coinPrices.coin1 && coinPrices.coin2 ? ((v * coinPrices.coin2) / coinPrices.coin1).toFixed(6) : 0;
  });
});