const getApi = async () => {
	try {
		const apiUrl = `https://type.fit/api/quotes`;
		const fetchApi = await fetch(apiUrl);
		const parsedData = await fetchApi.json();
		return parsedData;
	} catch (e) {
		console.log(e);
	}
};

const getRandomQuote = (data) => {
	//Dapat pag null ang author lagyan natin ng placeholder
	return new Promise((resolve, reject) => {
		if (data) {
			let randomIndex = Math.floor(Math.random() * data.length);
			const author = data[randomIndex].author;
			const quote = data[randomIndex].text;
			resolve({
				quote: quote,
				author: author,
				number: randomIndex,
				quotesCount: data.length,
			});
		} else {
			reject('Cannot fetch data');
		}
	});
};

const appendInformation = (data) => {
	const quoteParagraph = document.querySelector('#quote');
	const authorParagraph = document.querySelector('#author');
	const quoteID = document.querySelector('#quoteID');
	const quoteCount = document.querySelector('#quoteCount');
	quoteParagraph.textContent = data.quote;
	authorParagraph.textContent = data.author;
	quoteID.textContent = data.number;
	quoteCount.textContent = data.quotesCount;
};

getApi().then(getRandomQuote).then(appendInformation);
