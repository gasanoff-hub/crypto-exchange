document.addEventListener('DOMContentLoaded', () => {
  const el = {
  menus: document.querySelectorAll('.trending__menu'),
  nav: ['#menu-1', '#menu-2'].map(id => ({
    coinNames: document.querySelectorAll(`${id} .coin-name`),
    coinChanges: document.querySelectorAll(`${id} .coin-change`),
    coinPrices: document.querySelectorAll(`${id} .coin-price`),
  })),
};

const formatPrice = price => {
  const num = Number(price);
  return num >= 1000
    ? Math.floor(num).toLocaleString('en-US')
    : num >= 1
    ? num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : num.toPrecision(3);
};

const formatChange = price => {
  const num = Number(price);
  return num >= 10 ? num.toPrecision(4) : num.toPrecision(3);
};

el.menus.forEach(menu => {
  ['mouseenter', 'mouseleave'].forEach(e =>
    menu.addEventListener(e, () =>
      el.menus.forEach(m =>
        m.classList[e === 'mouseenter' ? 'add' : 'remove']('animation-paused')
      )
    )
  );
});

const trendingApi = async () => {
  const resp = await fetch('https://api.coingecko.com/api/v3/search/trending');
  const data = await resp.json();

  const coinName = data.coins.map(c => c.item.symbol);
  const coinChange = data.coins.map(c => c.item.data.price_change_percentage_24h.usd);
  const coinPrice = data.coins.map(c => Number(c.item.data.price));

  el.nav.forEach(navItem => {
    navItem.coinNames.forEach((el, i) => el.textContent = coinName[i]);
    navItem.coinChanges.forEach((el, i) => {
      const val = coinChange[i];
      const sign = val > 0 ? '+' : '';
      el.textContent = `${sign}${formatChange(val)}%`;
      el.className = val >= 0 ? 'green' : 'red';
    });
    navItem.coinPrices.forEach((el, i) => {
      el.textContent = `$${formatPrice(coinPrice[i])}`;
    });
  });
};

trendingApi();
});