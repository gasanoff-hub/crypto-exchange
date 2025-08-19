document.addEventListener('DOMContentLoaded', () => {
    const el = {
        tbody: document.querySelector('tbody'),
        pagination: document.querySelector('.pagination')
    };

    const perPage = 100;
    let totalPages = 1;
    let currentPage = 1;

    const liquidity = async page => {
        currentPage = page;

        if (page === 1 && !window.totalCoins) {
            const res = await fetch("https://api.coingecko.com/api/v3/coins/list");
            const coins = await res.json();
            window.totalCoins = coins.length;
            totalPages = Math.ceil(coins.length / perPage);
        }

        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h,24h,7d`);
        const data = await response.json();

        el.tbody.innerHTML = '';

        data.forEach(coin => {
            const tr = document.createElement('tr');
            tr.classList.add('liquidity-row');

            const changeClass = value => value >= 0 ? 'positive' : 'negative';

            tr.innerHTML = `
                <td class="liquidity-rank">${coin.market_cap_rank}</td>
                <td class="liquidity-name">
                    <img src="${coin.image}" alt="${coin.name}" class="coin-icon">
                    <span class="coin-title">${coin.name}</span>
                    <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
                </td>
                <td class="liquidity-price">$${coin.current_price.toLocaleString()}</td>
                <td class="liquidity-change change-1h ${changeClass(coin.price_change_percentage_1h_in_currency)}">
                    ${coin.price_change_percentage_1h_in_currency?.toFixed(2) || '0'}%
                </td>
                <td class="liquidity-change change-24h ${changeClass(coin.price_change_percentage_24h)}">
                    ${coin.price_change_percentage_24h?.toFixed(2) || '0'}%
                </td>
                <td class="liquidity-change change-7d ${changeClass(coin.price_change_percentage_7d_in_currency)}">
                    ${coin.price_change_percentage_7d_in_currency?.toFixed(2) || '0'}%
                </td>
                <td class="liquidity-marketcap">$${coin.market_cap.toLocaleString()}</td>
                <td class="liquidity-volume">$${coin.total_volume.toLocaleString()}</td>
                <td class="liquidity-supply">${coin.circulating_supply?.toLocaleString()} ${coin.symbol.toUpperCase()}</td>
            `;

            el.tbody.appendChild(tr);
        });

        createPagination(totalPages, currentPage);
    };

    const createPagination = (totalPages, currentPage) => {
        el.pagination.innerHTML = "";
        let maxButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = startPage + maxButtons - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        if (currentPage > 1) {
            let prev = document.createElement("button");
            prev.classList.add('btn-page');
            prev.innerText = "<";
            prev.addEventListener("click", () => liquidity(currentPage - 1));
            el.pagination.appendChild(prev);
        }

        for (let i = startPage; i <= endPage; i++) {
            let btn = document.createElement("button");
            btn.classList.add('btn-page');
            btn.innerText = i;
            if (i === currentPage) btn.classList.add("page-active");
            btn.addEventListener("click", () => liquidity(i));
            el.pagination.appendChild(btn);
        }

        if (currentPage < totalPages) {
            let next = document.createElement("button");
            next.classList.add('btn-page');
            next.innerText = ">";
            next.addEventListener("click", () => liquidity(currentPage + 1));
            el.pagination.appendChild(next);
        }
    };

    liquidity(1);
});