var tweet = 'hello twitter api';

var twit = require('twit');

var twitter = new twit({
	consumer_key:         'bSH6JZhdUBnDO1ekwh4EFCoJr',
	consumer_secret:      '4B2WqyNDyRuAIwSRdHnxx9NMiFsszd5WLicwlnNuXcTki2uhb3',
	access_token:         '715657014685343744-vhAfOH2L3zr5i0wf1V53T6daPd3Qyxh',
	access_token_secret:  'qvfTdJSC4iXAEXndGGBsGS9bem5XUceXMYA8r73ORTwoH',
	});
	
	
twitter.post('statuses/update', { status: tweet }, function(err, data, response) {
  console.log(data)
})


