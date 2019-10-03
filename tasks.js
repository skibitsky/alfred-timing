'use strict';
const process = require('process');
const alfy = require('alfy');
var uniqBy = require('lodash.uniqby');

const Authorization = 'Bearer ' + process.env.token;

alfy.fetch("https://web.timingapp.com/api/v1/time-entries",{
    query: {
      search_query: alfy.input,
      include_project_data: true,
    },
    headers: {
			'Content-Type': 'application/json',
			Authorization
		},
		json: true
}).then(result => {
  const data = result.data;
  
  // Remove tasks with the same title
  const sortedData = uniqBy(data, "title")
  
  var task = alfy.inputMatches(
    sortedData.map(t => {
      const project = t.project.title;
      return {
        title: t.title,
        subtitle: `Project: ${project}`,
        autocomplete: t.title,
        arg: t.title,
        variables: {
          project: project
        }
      }
    }), 'title');
    
  if(!!alfy.input.length)
    task.unshift({title: `Create Task: "${alfy.input}"`, arg: alfy.input,})

	alfy.output(task);
});