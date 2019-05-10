const path = require('path');
const fs = require('fs');
const MidiWriter = require('midi-writer-js');

const openmojis = require('./openmoji.json');


// MidiWriterJS defaults to 128 ticks per beat. If your song is 120bpm there are 15360 ticks every minute (tpb * bpm)
// https://github.com/grimmdude/MidiWriterJS/issues/39#issuecomment-363820101

let tracks = []

const notesEmojis = openmojis.map((om, i) => {
	return new MidiWriter.NoteEvent({
		pitch: 64,
		duration: '32',
		startTick: 128/4*i
	});
});
tracks.push(createTrack(notesEmojis, 'Emojis'));

let notesSkintones = [];
openmojis.forEach((om, i) => {
	if (om.skintone !== "") {
		if (om.skintone_combination === 'multiple') {
			const skintones = om.skintone.split(',');
			notesSkintones.push(
				new MidiWriter.NoteEvent({
					pitch: 64 + skintones[0],
					duration: '32',
					startTick: 128/4*i
				})
			);
			notesSkintones.push(
				new MidiWriter.NoteEvent({
					pitch: 96 + skintones[1],
					duration: '32',
					startTick: 128/4*i
				})
			);
		} else {
			notesSkintones.push(
				new MidiWriter.NoteEvent({
					pitch: 64 + om.skintone,
					duration: '32',
					startTick: 128/4*i
				})
			);
		}
	}
});
tracks.push(createTrack(notesSkintones, 'Skintones'));

let notesNextGroup = [];
let currentGroup = '';
let groupCount = 0;
openmojis.forEach((om, i) => {
	if (om.group !== currentGroup) {
		notesNextGroup.push(
			new MidiWriter.NoteEvent({
				pitch: 64 + groupCount,
				duration: '2',
				startTick: 128/4*i
			})
		);
		currentGroup = om.group;
		groupCount += 1;
	}
});
tracks.push(createTrack(notesNextGroup, 'New Group Marker'));

saveTrack(tracks, 'openmoji.mid');
console.log("✅ Done");


function createTrack(notes, name) {
	let track = new MidiWriter.Track();
	track.setTempo(120);
	track.addTrackName(name);
	track.addEvent(new MidiWriter.ProgramChangeEvent({instrument : 1}));
	track.addEvent(notes);
	return track;
}

function saveTrack(track, filepath) {
	const write = new MidiWriter.Writer(track);
  // Generate a base64 representation of the MIDI file
	const base64String = write.base64();
	// Strip off the header
	const data = base64String.split("base64,").pop();
	fs.writeFileSync(filepath, data, {encoding: 'base64'});
}
