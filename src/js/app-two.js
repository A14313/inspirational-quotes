const quoteParagraph = document.querySelector('#quote');
const authorParagraph = document.querySelector('#author');
const quoteID = document.querySelector('#quoteID');
const quoteCount = document.querySelector('#quoteCount');

const newQuoteBtn = document.querySelector('#newQuoteBtn');
const copyBtn = document.querySelector('#copyBtn');
const speakBtn = document.querySelector('#speakBtn');
const hintContainer = document.querySelector('#hintContainer');
const closeBtn = document.querySelector('#closeBtn');
const showHintBtn = document.querySelector('#showHintBtn');
const copyNotifDiv = document.querySelector('#copyNotifDiv');

const twitter = document.querySelector('#twitter');
const facebook = document.querySelector('#facebook');

const signature = `Copied from Inspirational Quotes Web app\nlink: https://a14313.github.io/inspirational-quotes/dist/`;
const preventedDefaultsButtons = [
	twitter,
	facebook,
	newQuoteBtn,
	copyBtn,
	speakBtn,
];
const disabledButtons = [newQuoteBtn, speakBtn, twitter, facebook];

//******************************* */

//Shortcut keys
const invokeShortcuts = (e) => {
	switch (e.code) {
		case 'NumpadEnter':
		case 'Enter':
			getRandomQuote();
			break;
		case 'KeyC':
			copy();
			break;
		case 'KeyS':
			speak();
			break;
		default:
			return 'No shortcut for that key';
	}
};
window.addEventListener('keydown', invokeShortcuts);

//******************************* */

// Global functions
const disableButtons = () => {
	disabledButtons.forEach((el) => {
		el.disabled = true;
	});
};

const enableButtons = () => {
	disabledButtons.forEach((el) => {
		el.disabled = false;
	});
};

const whenFetchingDataFromApi = () => {
	// Hanggang hindi pa natin na fefetch ang api
	// loading muna ang state ng button
	// newQuoteBtn.textContent = '...';
	newQuoteBtn.classList.add('loading-state');
	disableButtons();
	window.removeEventListener('keydown', invokeShortcuts);
};

const whenDoneFetchingDataFromApi = () => {
	newQuoteBtn.classList.remove('loading-state');
	enableButtons();
	window.addEventListener('keydown', invokeShortcuts);
};

// Prevent defaults for buttons
preventedDefaultsButtons.forEach((el) => {
	el.addEventListener('mousedown', (e) => {
		e.preventDefault();
		// I prevented the default, to remove the default focus after clicked
	});
});

//This is for the processing of API and a randomQuote
const processRandomQuote = (parsedData) => {
	// Based sa structure ng API, Array of objects sya
	// so ang nirereturn neto array of objects [{},{}]
	const randomID = Math.floor(Math.random() * parsedData.length);
	// Pang testing
	// const randomID = 0;
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

	// newQuoteBtn.innerHTML =
	// '<span class="btn__normal__title">Get new</span><i class="fa-solid fa-arrow-rotate-right"></i>';

	whenDoneFetchingDataFromApi();
};

const onError = (e) => {
	console.log(e);
};

const getRandomQuote = () => {
	// Hanggang hindi pa natin na fefetch ang api
	// loading muna ang state ng button
	whenFetchingDataFromApi();
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

getRandomQuote();
//******************************* */

// Copy button function
const copy = () => {
	navigator.clipboard.writeText(
		`${quoteParagraph.textContent}\n\n--${authorParagraph.textContent}\n\n${signature}`
	);

	copyNotifDiv.classList.add('show');
	setTimeout(() => {
		copyNotifDiv.classList.remove('show');
	}, 2000);
};

// Speak button function
const speak = () => {
	let quote = `${quoteParagraph.textContent}`;
	let author = `by ${authorParagraph.textContent}`;
	let utteranceQuote = new SpeechSynthesisUtterance(quote);
	let utteranceAuthor = new SpeechSynthesisUtterance(author);
	utteranceQuote.pitch = 1;
	utteranceQuote.rate = 0.8;
	utteranceAuthor.pitch = 1;
	utteranceAuthor.rate = 0.8;

	speakBtn.classList.add('active');
	disableButtons();
	window.removeEventListener('keydown', invokeShortcuts);

	speechSynthesis.speak(utteranceQuote);
	utteranceQuote.addEventListener('end', () => {
		setTimeout(() => {
			speechSynthesis.speak(utteranceAuthor);
			speakBtn.classList.remove('active');
			enableButtons();
			window.addEventListener('keydown', invokeShortcuts);
		}, 500);
	});
};

//******************************* */

// Button event listeners
copyBtn.addEventListener('click', copy);
speakBtn.addEventListener('click', speak);
newQuoteBtn.addEventListener('click', getRandomQuote);

twitter.addEventListener('click', () => {
	let url = `https://twitter.com/intent/tweet?url=${quoteParagraph.textContent}\n\n--${authorParagraph.textContent}\n\n${signature}`;
	window.open(url, '_blank');
});
facebook.addEventListener('click', () => {
	let url = `https://facebook.com/profile`;
	window.open(url, '_blank');
});

//******************************* */
//******************************* */
//******************************* */

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
