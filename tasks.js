'use strict';

/* eslint-disable quote-props */

import {env} from 'process';
import {fetch, input, inputMatches, output} from 'alfy';
import uniqWith from 'lodash.uniqwith';

const Authorization = 'Bearer ' + env.token;

fetch('https://web.timingapp.com/api/v1/time-entries', {
	query: {
		search_query: input,
		include_project_data: true
	},
	headers: {
		'Content-Type': 'application/json',
		Authorization
	},
	json: true
}).then(result => {
	const data = result.data;

  // Remove tasks with the same title under the same project
	const sortedData = uniqWith(
    data,
    (a, b) => a.task === b.task && a.project.self === b.project.self
  );

	var task = inputMatches(
    sortedData.map(t => {
	const project = t.project ? t.project.self : 'Unassigned';
	const projectTitle = t.project ?
        t.project.title_chain.join(' ▸ ') :
        'Unassigned';

	const title = t.title ? t.title : project;
	return {
		title: title,
		subtitle: `Project: ${projectTitle}`,
		autocomplete: title,
		arg: title,
		variables: {
			projectTitle: projectTitle,
			project: project
		}
	};
}),
    'title'
  );

	if (input.length !== 0) {
		task.unshift({title: `Create Task: "${input}"`, arg: input});
	}

	output(task);
});
