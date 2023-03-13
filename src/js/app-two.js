const quoteParagraph = document.querySelector('#quote');
const authorParagraph = document.querySelector('#author');
const quoteID = document.querySelector('#quoteID');
const quoteCount = document.querySelector('#quoteCount');

const newQuoteBtn = document.querySelector('#newQuoteBtn');
const copyBtn = document.querySelector('#copyBtn');
const hintContainer = document.querySelector('#hintContainer');
const closeBtn = document.querySelector('#closeBtn');
const showHintBtn = document.querySelector('#showHintBtn');
const copyNotifDiv = document.querySelector('#copyNotifDiv');

const signature = `Copied from Inspirational Quotes Web app\nlink: https://a14313.github.io/inspirational-quotes/dist/`;

const processRandomQuote = (parsedData) => {
	// Based sa structure ng API, Array of objects sya
	// so ang nirereturn neto array of objects [{},{}]
	const randomID = Math.floor(Math.random() * parsedData.length);
	// Pang testing
	// const randomID = 937;
	if (parsedData[randomID].author === null) {
		return {
			quote: parsedData[randomID].text,
			author: `Unknown Author`,
			id: randomID,
			quotesCount: parsedData.length,
		};
	} else {
		return {
			quote: parsedData[randomID].text,
			author: parsedData[randomID].author,
			id: randomID,
			quotesCount: parsedData.length,
		};
	}
};

const appendInformation = (parsedData) => {
	quoteParagraph.textContent = parsedData.quote;
	authorParagraph.textContent = parsedData.author;
	quoteID.textContent = parsedData.id;
	quoteCount.textContent = parsedData.quotesCount;

	newQuoteBtn.textContent = 'Get new';
	newQuoteBtn.classList.remove('loading-state');
};

const onError = (e) => {
	console.log(e);
};

const getRandomQuote = () => {
	// Hanggang hindi pa natin na fefetch ang api
	// loading muna ang state ng button
	newQuoteBtn.textContent = 'Loading...';
	newQuoteBtn.classList.add('loading-state');
	// ******

	//Fetching api
	const apiUrl = 'https://type.fit/api/quotes';
	fetch(apiUrl)
		.then((response) => {
			return response.json();
		})
		.then(processRandomQuote)
		.then(appendInformation)
		.catch(onError);
};

const copy = () => {
	navigator.clipboard.writeText(
		`${quoteParagraph.textContent}\n\n--${authorParagraph.textContent}\n\n${signature}`
	);

	copyNotifDiv.classList.add('show');
	setTimeout(() => {
		copyNotifDiv.classList.remove('show');
	}, 2000);
};

copyBtn.addEventListener('click', copy);

getRandomQuote();

//Shortcut buttons
window.addEventListener('keydown', (e) => {
	switch (e.code) {
		case 'NumpadEnter':
		case 'Enter':
			getRandomQuote();
			break;
		case 'KeyC':
			copy();
			break;
		default:
			return 'No shortcut for that key';
	}
});

newQuoteBtn.addEventListener('click', getRandomQuote);

// FOR SHORCUT HINTS
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
