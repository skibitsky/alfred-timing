'use strict';
import {env} from 'process';
import {fetch, output, inputMatches} from 'alfy';

const Authorization = 'Bearer ' + env.token;

fetch('https://web.timingapp.com/api/v1/projects', {
	headers: {
		'Content-Type': 'application/json',
		Authorization
	},
	json: true
}).then(result => {
	const data = result.data
        .filter(pr => !pr.is_archived)
        .map(pr => {
	return {
		uid: pr.self,
		title: pr.title,
		autocomplete: pr.title,
		arg: pr.title
	};
});
	// insert unassigned project at top
	data.unshift({
		uid: 0,
		title: 'Unassigned',
		autocomplete: 'Unassigned',
		arg: 'Unassigned'
	});

	output(inputMatches(data, 'title'));
});
