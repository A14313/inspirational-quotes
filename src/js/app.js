const quoteParagraph = document.querySelector('#quote');
const authorParagraph = document.querySelector('#author');
const quoteID = document.querySelector('#quoteID');
const quoteCount = document.querySelector('#quoteCount');

const newQuoteBtn = document.querySelector('#newQuoteBtn');
const copyBtn = document.querySelector('#copyBtn');
const hintContainer = document.querySelector('#hintContainer');
const closeBtn = document.querySelector('#closeBtn');
const showHintBtn = document.querySelector('#showHintBtn');

const getApi = async () => {
	try {
		const apiUrl = `https://type.fit/api/quotes`;
		const fetchApi = await fetch(apiUrl);
		const parsedData = await fetchApi.json();
		return parsedData;
		// array of objects ang nilalabas neto based sa
		// structure ng API itself
	} catch (e) {
		console.log(e);
	}
};

const getRandomQuote = (data) => {
	return new Promise((resolve, reject) => {
		if (data) {
			let randomIndex = Math.floor(Math.random() * data.length);
			const author = data[randomIndex].author;
			const quote = data[randomIndex].text;

			if (author === null) {
				resolve({
					quote: quote,
					author: `Unknown Author`,
					number: randomIndex,
					quotesCount: data.length,
				});
			} else {
				resolve({
					quote: quote,
					author: author,
					number: randomIndex,
					quotesCount: data.length,
				});
			}
		} else {
			reject('Cannot fetch data');
		}
	});
};

const appendInformation = async (data) => {
	try {
		quoteParagraph.textContent = data.quote;
		authorParagraph.textContent = data.author;
		quoteID.textContent = data.number;
		quoteCount.textContent = data.quotesCount;
		return data;
	} catch (e) {
		console.log(e);
	}
};

const getNewQuoteFn = () => {
	getApi().then(getRandomQuote).then(appendInformation);
};

getNewQuoteFn();
newQuoteBtn.addEventListener('click', getNewQuoteFn);

//For shortcut keys
window.addEventListener('keydown', (e) => {
	switch (e.code) {
		case 'NumpadEnter':
		case 'Enter':
			getNewQuoteFn();
			break;
		case 'KeyC':
			console.log('Key C');
			break;
		default:
			return "There's no shortcut for that key";
	}
});

// navigator.clipboard.writeText(data.quote);

showHintBtn.addEventListener('click', () => {
	hintContainer.classList.add('show');
	showHintBtn.classList.remove('show');
});

const showHintPromise = () => {
	return new Promise((resolve, reject) => {
		if (window.innerWidth >= 320) {
			setTimeout(() => {
				hintContainer.classList.add('show');
				resolve();
			}, 2000);
		} else {
			reject('The current screen size is less than 320px');
		}
	});
};

const showHint = async () => {
	try {
		await showHintPromise();
		closeBtn.addEventListener('click', () => {
			hintContainer.classList.remove('show');
			showHintBtn.classList.add('show');
		});
	} catch (e) {
		console.log(e);
	}
};

showHint();
