# Savings Tool

This is a small and simple application in Node.js for tracking my retirement savings.

At this moment it periodically queries my retirement plan company - [NN Investment Partners](https://www.nntfi.pl/) - for quotes of securities I invest in. When it detects a change (which happens once a day) it sends me an email with updated quotes as well as updates a Google spreadsheet based in which I've set up some simple tracking tools.

=========================

* [Usage](#usage)
* [Config file](#config-file)
* [Project assumptions](#project-assumptions)
* [Ideas for future](#ideas-for-future)
* [Version history](#version-history)

## Usage

1. Login to [Google Developers' console](https://console.developers.google.com).
1. Create a new project. Generate an OAuth 'other' key and download the secret file. Copy it to `./data_private/google-api-key.json`.
1. Enable Sheets API and GMail API for this project
1. Copy the `config.example.json` to `config.json` 
1. Within this file adjust the config settings
1. Create a spreadsheet on Google Docs where daily updates will be stored
1. Run the application for the first time. It will ask you to authenticate with your Google account. Go to the link displayed in the command line, accept the request for modifying spreadsheets and sending email. Afterwards copy the generated token back to the application.
1. You can leave the application running in the background now. A wise idea is to use [`pm2`](http://pm2.keymetrics.io/) as a process supervisor.

## Config file

### fundsToTrack

An array with IDs of funds to track. Its prefilled with all the funds available from [NN Investment Partners](https://www.nntfi.pl/) as of October 2016

### requestInterval

Number of milliseconds. How often to poll the NN website for new quotes. 

### requestOptions

Configuration object for the HTTPS request used for fetching new data.

### googleSpreadsheet

Settings relevant to Google Spreadsheets

#### apiKeyFile

String indicating the path were API key will be stored

#### spreadsheetId

String with an id of a spreadsheet where daily quotes will be stored

#### sheetName

String with a name of a sheet within the spreadsheet where daily quotes will be stored

### gmail

Settings relevant to GMail

#### from

String: this will be used as the 'from' field in your email. It should be the address associated with your Google account.

#### to

String: this will be the address to which the email with daily updates will be send to

#### subject

String: This will be used as the first part of email subject. Date and hour of an update will be appended to it.

## Project assumptions

* Node.js 5+, ES2015
* Use as few 3rd party modules as possible. Currently only Google API libraries are imported.
* Use Google APIs for storing data in Google docs and sending email through Gmail

## Ideas for future

* [ ] Only query for new data when new data is expected (after 3pm on weekdays)
* [ ] Persist historical data
* [ ] Use data from my spreadsheet to do some more advanced calculations of profitability 
* [ ] Do some kind of nice visualization
* [ ] Fetch data from more sources
* [ ] Add a Web UI for configuration and management
* [ ] Dockerize
* [ ] Automatic discovery of new securities to track
* [ ] ...
* [ ] Profit

## Version history

### 1.0.0

* Basically 0.0.3 which has proven to be stable enough over a course of several days
* Added README.md
* Added LICENSE

### 0.0.3

* Ignore some errors arising from API returning malformed data or connectivity errors

### 0.0.2

* First functional release with basic features in place