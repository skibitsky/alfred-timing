'use strict';

/* eslint-disable quote-props */

import {env} from 'process';
import {fetch, input, inputMatches, output} from 'alfy';
import uniqBy from 'lodash.uniqby';

const Authorization = 'Bearer ' + env.token;

fetch('https://web.timingapp.com/api/v1/time-entries', {
	query: {
		'search_query': input,
		'include_project_data': true
	},
	headers: {
		'Content-Type': 'application/json',
		Authorization
	},
	json: true
}).then(result => {
	const data = result.data;

  // Remove tasks with the same title
	const sortedData = uniqBy(data, 'title');

	var task = inputMatches(
    sortedData.map(t => {
	const project = t.project.title;
	return {
		title: (t.title) ? t.title : project,
		subtitle: `Project: ${project}`,
		autocomplete: t.title,
		arg: t.title,
		variables: {
			project: project
		}
	};
}), 'title');

	if (input.length !== 0)		{
		task.unshift({title: `Create Task: "${input}"`, arg: input});
	}

	output(task);
});
