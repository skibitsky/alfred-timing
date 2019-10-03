'use strict';
const process = require('process');
const alfy = require('alfy');

const Authorization = 'Bearer ' + process.env.token;

alfy.fetch("https://web.timingapp.com/api/v1/projects",{
		headers: {
			'Content-Type': 'application/json',
			Authorization
		},
		json: true
}).then(result => {
	const data = result.data.map(pr => {
		return {
			uid: pr.self,
			title: pr.title,
			autocomplete: pr.title,
			arg: pr.title,
		}
	})

	alfy.output(alfy.inputMatches(data, 'title'));
});